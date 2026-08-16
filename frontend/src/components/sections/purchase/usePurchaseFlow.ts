import { useState, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export type PurchaseState = 
  | 'idle' 
  | 'filling_form' 
  | 'reviewing' 
  | 'creating_purchase' 
  | 'redirecting_to_payment'
  | 'api_error'
  | 'network_error';

export interface Plan {
  plan_key: string;
  label: string;
  amount_pkr: number;
  description: string;
  categories?: { key: string; label: string; commission_pct: number; display: string }[];
}

export function usePurchaseFlow(productId: string) {
  const [state, setState] = useState<PurchaseState>('idle');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [files, setFiles] = useState<{ [key: string]: File | File[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  const fetchPricing = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/products/${productId}/pricing`);
      if (!res.ok) throw new Error('Failed to load pricing');
      const data = await res.json();
      setPlans(data.plans);
    } catch (err: any) {
      // Avoid console.error for standard Failed to fetch to prevent Next.js dev overlay
      if (err.name !== 'TypeError' && err.message !== 'Failed to fetch') {
        console.error(err);
      }
      setError('Could not load pricing options. Please check your connection or ensure the backend is running.');
    }
  }, [productId]);

  const selectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setState('filling_form');
    setError(null);
  };

  const submitForm = (data: any, attachments: { [key: string]: File | File[] }) => {
    setFormData(data);
    setFiles(attachments);
    setState('reviewing');
  };

  const confirmPurchase = async () => {
    if (!selectedPlan || !formData) return;
    
    setState('creating_purchase');
    setError(null);

    try {
      // 1. Create Purchase
      const payload = {
        product: productId,
        plan_key: selectedPlan.plan_key,
        customer: formData.customer,
        product_data: formData.product_data,
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to create purchase');
      }

      const purchaseData = await res.json();
      const newPurchaseId = purchaseData.purchase_id;
      setPurchaseId(newPurchaseId);

      // 2. Upload Files if any
      const fileData = new FormData();
      let hasFiles = false;
      Object.entries(files).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          val.forEach((f) => fileData.append(key, f));
          if (val.length > 0) hasFiles = true;
        } else if (val) {
          fileData.append(key, val);
          hasFiles = true;
        }
      });

      if (hasFiles) {
        const fileRes = await fetch(`${API_BASE_URL}/api/v1/purchases/${newPurchaseId}/files`, {
          method: 'POST',
          body: fileData,
        });
        if (!fileRes.ok) {
           const errData = await fileRes.json();
           throw new Error(errData.detail || 'Failed to upload files');
        }
      }

      // If zero amount (ERP free), it might be PAID already. Let's redirect to status page directly to check.
      if (purchaseData.amount_pkr === 0) {
        window.location.href = `/payment-status?purchase_id=${newPurchaseId}`;
        return;
      }

      // 3. Initiate Payment
      setState('redirecting_to_payment');
      const payRes = await fetch(`${API_BASE_URL}/api/v1/purchases/${newPurchaseId}/initiate-payment`, {
        method: 'POST',
      });

      if (!payRes.ok) {
        const errData = await payRes.json();
        throw new Error(errData.detail || 'Failed to initiate payment');
      }

      const payData = await payRes.json();
      // Redirect to AssanPay
      window.location.href = payData.complete_link;

    } catch (err: any) {
      console.error(err);
      if (err.name === 'TypeError') {
        setState('network_error');
        setError('Network error. Please check your internet connection.');
      } else {
        setState('api_error');
        setError(err.message || 'An unexpected error occurred.');
      }
    }
  };

  const reset = () => {
    setState('idle');
    setFormData(null);
    setFiles({});
    setSelectedPlan(null);
    setError(null);
  };

  return {
    state,
    plans,
    selectedPlan,
    formData,
    files,
    error,
    fetchPricing,
    selectPlan,
    submitForm,
    confirmPurchase,
    reset,
    setState,
  };
}
