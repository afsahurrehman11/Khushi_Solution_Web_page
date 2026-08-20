'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LocomotiveScrollProvider from '@/components/layout/LocomotiveScrollProvider';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const purchaseId = searchParams.get('purchase_id');
  
  const [status, setStatus] = useState<string | null>(null); // "PAID", "FAILED", "PENDING_VERIFICATION", "ERROR"
  const [amount, setAmount] = useState<number | null>(null);
  const [planKey, setPlanKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const attemptCount = useRef(0);
  const MAX_ATTEMPTS = 12; // 12 attempts * 5s = 60s max polling

  const checkStatus = async () => {
    if (!purchaseId) {
      setStatus("ERROR");
      setErrorMsg("No purchase ID provided.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/purchases/${purchaseId}/payment-status`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Purchase not found.");
        throw new Error("Failed to check status.");
      }
      
      const data = await res.json();
      
      if (data.purchase_status === 'PAID') {
        setStatus('PAID');
        setAmount(data.amount_pkr);
        if (data.plan_key) setPlanKey(data.plan_key);
        if (pollingRef.current) clearTimeout(pollingRef.current);
      } else if (data.purchase_status === 'FAILED') {
        setStatus('FAILED');
        if (pollingRef.current) clearTimeout(pollingRef.current);
      } else if (data.payment_status === 'PENDING_VERIFICATION') {
        setStatus('PENDING_VERIFICATION');
        attemptCount.current += 1;
        
        if (attemptCount.current < MAX_ATTEMPTS) {
          pollingRef.current = setTimeout(checkStatus, (data.retry_after_seconds || 5) * 1000);
        } else {
          // Max polling reached. Stop polling, but it's still pending.
          if (pollingRef.current) clearTimeout(pollingRef.current);
        }
      }
    } catch (err: any) {
      console.error(err);
      setStatus("ERROR");
      setErrorMsg(err.message || "Network error. Could not reach server.");
      if (pollingRef.current) clearTimeout(pollingRef.current);
    }
  };

  useEffect(() => {
    checkStatus();
    
    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, [purchaseId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-32 pb-20 px-4">
      <div className="w-full max-w-lg glass-card p-8 md:p-12 rounded-[var(--radius-xl)] text-center shadow-xl border border-border">
        
        {!status && (
          <div className="animate-pulse">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">Checking Registration Status...</h2>
            <p className="text-text-secondary">Please wait while we confirm your details.</p>
          </div>
        )}

        {status === 'PAID' && (
          <div className="animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {planKey === 'enterprise_paid' ? 'Application Submitted!' : amount === 0 ? 'Registration Complete!' : 'Payment Successful!'}
            </h2>
            <p className="text-text-secondary mb-6">
              {planKey === 'enterprise_paid'
                ? 'Your Enterprise Pro Plan registration has been received.'
                : amount === 0
                ? 'Your Free Starter Plan activation is complete.'
                : 'Your payment & registration are complete.'}
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Plan Selected</span>
                <span className="font-bold text-slate-900">
                  {planKey === 'enterprise_paid' ? 'Enterprise Pro Plan' : amount === 0 ? 'Free Starter Plan' : 'Standard Paid Plan'}
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Registration Billing</span>
                <span className="font-bold text-slate-900">
                  {planKey === 'enterprise_paid' ? 'Custom Quote' : amount === 0 ? 'Free (0 PKR)' : `Rs. ${amount?.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 text-[11px] text-slate-400 font-medium">
                <span>Registration Reference ID</span>
                <span className="font-mono">{purchaseId}</span>
              </div>

              {planKey === 'enterprise_paid' && (
                <p className="text-[11px] text-blue-700 bg-blue-50 p-2.5 rounded-lg border border-blue-200 font-semibold mt-3 leading-relaxed">
                  Our Enterprise Onboarding Team will contact you within 24 hours with your custom license quote & onboarding schedule.
                </p>
              )}
            </div>
            
            <Link href="/" className="btn-primary-gradient px-8 py-3 rounded-full text-white font-bold inline-block">
              Return to Homepage
            </Link>
          </div>
        )}

        {status === 'FAILED' && (
          <div className="animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Payment Failed</h2>
            <p className="text-text-secondary mb-6">Your transaction could not be completed.</p>
            <p className="text-xs text-text-muted mb-8">Order ID: {purchaseId}</p>
            
            <Link href="/" className="px-8 py-3 rounded-full text-text-primary bg-slate-100 hover:bg-slate-200 font-bold inline-block transition-colors">
              Go Back
            </Link>
          </div>
        )}

        {status === 'PENDING_VERIFICATION' && (
          <div className="animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
              <Clock className="w-10 h-10 text-blue-600" />
              <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-extrabold text-text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Processing Payment...</h2>
            <p className="text-text-secondary mb-6">We are waiting for confirmation from AssanPay. This may take a minute.</p>
            <p className="text-xs text-text-muted mb-8">Order ID: {purchaseId}</p>
            
            {attemptCount.current >= MAX_ATTEMPTS && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-left">
                <p className="text-sm text-yellow-800 font-medium mb-1">Taking longer than expected?</p>
                <p className="text-xs text-yellow-700">You can safely leave this page. We will update your order automatically once AssanPay confirms it.</p>
              </div>
            )}
          </div>
        )}

        {status === 'ERROR' && (
          <div className="animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <AlertCircle className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Status Unavailable</h2>
            <p className="text-text-secondary mb-6">{errorMsg}</p>
            <Link href="/" className="px-8 py-3 rounded-full text-text-primary bg-slate-100 hover:bg-slate-200 font-bold inline-block transition-colors">
              Return to Homepage
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <LocomotiveScrollProvider>
      <div className="premium-bg min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow" data-scroll-container>
          <Suspense fallback={
             <div className="min-h-[70vh] flex items-center justify-center pt-32 pb-20">
               <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
             </div>
          }>
            <PaymentStatusContent />
          </Suspense>
        </main>
        <Footer />
      </div>
    </LocomotiveScrollProvider>
  );
}
