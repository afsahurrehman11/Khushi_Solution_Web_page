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

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface Plan {
  plan_key: string;
  label: string;
  amount_pkr: number;
  description: string;
  is_custom_price?: boolean;
  categories?: { key: string; label: string; commission_pct: number; display: string }[];
  features?: PlanFeature[];
}

export function getFallbackPlans(productId: string): Plan[] {
  if (productId === 'khushi-erp') {
    return [
      {
        plan_key: 'base_free',
        label: 'Free Starter Plan',
        amount_pkr: 0,
        description: 'Complete educational institution & student management system.',
        is_custom_price: false,
        features: [
          { name: 'Student & Class Management', included: true },
          { name: 'Fee Vouchers & Fee Accounting', included: true },
          { name: 'Parent Mobile App & Push Alerts', included: true },
          { name: 'AI Facial Recognition Attendance', included: false },
          { name: 'HR & Staff Salary Payroll', included: false },
        ],
      },
      {
        plan_key: 'enterprise_paid',
        label: 'Enterprise Pro Plan',
        amount_pkr: 0,
        description: 'Full-scale school management with AI facial attendance & automated HR payroll.',
        is_custom_price: true,
        features: [
          { name: 'Student & Class Management', included: true },
          { name: 'Fee Vouchers & Fee Accounting', included: true },
          { name: 'Parent Mobile App & Push Alerts', included: true },
          { name: 'AI Facial Recognition Attendance', included: true },
          { name: 'HR & Staff Salary Payroll', included: true },
        ],
      },
    ];
  }

  // khushi-delivery
  return [
    {
      plan_key: 'non_commission',
      label: 'Non-Commission Model',
      amount_pkr: 11000,
      description: 'One-time registration fee. No ongoing commission.',
    },
    {
      plan_key: 'commission',
      label: 'Commission Model',
      amount_pkr: 5600,
      description: 'Reduced registration fee with a category-based revenue commission.',
      categories: [
        { key: 'food_restaurant', label: 'Food & Restaurant', commission_pct: 15, display: 'Food & Restaurant • 15% commission' },
        { key: 'grocery', label: 'Grocery', commission_pct: 5, display: 'Grocery • 5% commission' },
        { key: 'pharmacy', label: 'Pharmacy', commission_pct: 5, display: 'Pharmacy • 5% commission' },
        { key: 'general_retail', label: 'General Retail', commission_pct: 15, display: 'General Retail • 15% commission' },
        { key: 'other', label: 'Other Category', commission_pct: 15, display: 'Other • 15% commission' },
      ],
    },
  ];
}

export function usePurchaseFlow(productId: string) {
  const [state, setState] = useState<PurchaseState>('idle');
  const [plans, setPlans] = useState<Plan[]>(() => getFallbackPlans(productId));
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [files, setFiles] = useState<{ [key: string]: File | File[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  const fetchPricing = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/products/${productId}/pricing`);
      if (!res.ok) throw new Error('pricing_fetch_failed');
      const data = await res.json();
      if (data && data.plans && data.plans.length > 0) {
        setPlans(data.plans);
      }
    } catch {
      setPlans(getFallbackPlans(productId));
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
      // Convert product ID hyphen to underscore for backend compatibility (e.g. khushi-delivery -> khushi_delivery)
      const backendProductId = productId.replace('-', '_');

      // 1. Create Purchase Request
      const payload = {
        product: backendProductId,
        plan_key: selectedPlan.plan_key,
        customer: formData.customer,
        product_data: formData.product_data,
      };

      let res;
      try {
        res = await fetch(`${API_BASE_URL}/api/v1/purchases`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        throw new Error('connection_failed');
      }

      if (!res.ok) {
        throw new Error('form_validation_failed');
      }

      let purchaseData;
      try {
        purchaseData = await res.json();
      } catch {
        throw new Error('invalid_server_response');
      }

      const newPurchaseId = purchaseData.purchase_id;
      setPurchaseId(newPurchaseId);

      // 2. Upload Attachments if present
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
        try {
          const fileRes = await fetch(`${API_BASE_URL}/api/v1/purchases/${newPurchaseId}/files`, {
            method: 'POST',
            body: fileData,
          });
          if (!fileRes.ok) {
            throw new Error('file_upload_failed');
          }
        } catch (fErr: any) {
          if (fErr.message === 'file_upload_failed') throw fErr;
          throw new Error('file_upload_failed');
        }
      }

      // If zero amount (ERP free), redirect to payment status
      if (purchaseData.amount_pkr === 0) {
        window.location.href = `/payment-status?purchase_id=${newPurchaseId}`;
        return;
      }

      // 3. Initiate Checkout Payment via AssanPay
      setState('redirecting_to_payment');
      let payRes;
      try {
        payRes = await fetch(`${API_BASE_URL}/api/v1/purchases/${newPurchaseId}/initiate-payment`, {
          method: 'POST',
        });
      } catch {
        throw new Error('payment_gateway_offline');
      }

      if (!payRes.ok) {
        throw new Error('payment_gateway_offline');
      }

      let payData;
      try {
        payData = await payRes.json();
      } catch {
        throw new Error('payment_gateway_offline');
      }

      if (payData && payData.complete_link) {
        window.location.href = payData.complete_link;
      } else {
        throw new Error('payment_gateway_offline');
      }

    } catch (err: any) {
      const code = err.message || '';
      setState('api_error');

      if (code === 'form_validation_failed') {
        setError('Please check that all required contact and registration fields are filled out correctly.');
      } else if (code === 'file_upload_failed') {
        setError('Your registration details were saved, but image attachments could not be uploaded. You can retry or complete without images.');
      } else if (code === 'payment_gateway_offline' || code === 'connection_failed') {
        setError('Our online checkout service (AssanPay) is currently undergoing setup. Your registration info has been safely recorded, and our team will assist you shortly.');
      } else {
        setError('Unable to complete checkout right now. Please check your connection and try again.');
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
