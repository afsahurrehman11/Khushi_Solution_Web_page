import React, { useState, useRef, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Tag } from 'lucide-react';

interface AffiliateCodeInputProps {
  onValidCode: (code: string, discount: number) => void;
  onInvalidCode: () => void;
  originalPrice: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function AffiliateCodeInput({ onValidCode, onInvalidCode, originalPrice }: AffiliateCodeInputProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'error'>('idle');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validateCode = async (code: string) => {
    setStatus('checking');
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/affiliates/${code}/validate?product=khushi_delivery`);
      if (!res.ok) {
        setStatus('error');
        setMessage('Unable to verify the affiliate code. Please try again.');
        onInvalidCode();
        return;
      }
      
      const data = await res.json();
      if (data.is_valid) {
        setStatus('valid');
        setDiscountPercent(data.discount_percentage);
        setMessage(`Affiliate code applied — ${data.discount_percentage}% discount.`);
        onValidCode(code, data.discount_percentage);
      } else {
        setStatus('invalid');
        setMessage('Invalid or inactive affiliate code.');
        onInvalidCode();
      }
    } catch (error) {
      setStatus('error');
      setMessage('Unable to verify the affiliate code. Please try again.');
      onInvalidCode();
    }
  };

  useEffect(() => {
    const code = digits.join('');
    if (code.length === 4 && status !== 'checking' && status !== 'valid') {
      validateCode(code);
    }
  }, [digits]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (!value) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      if (status !== 'idle') setStatus('idle');
      return;
    }

    const lastChar = value[value.length - 1];
    const newDigits = [...digits];
    newDigits[index] = lastChar;
    setDigits(newDigits);
    
    if (status !== 'idle') setStatus('idle');

    if (index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pastedData) {
      const newDigits = [...digits];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setDigits(newDigits);
      if (status !== 'idle') setStatus('idle');
      
      if (pastedData.length < 4) {
        inputRefs.current[pastedData.length]?.focus();
      } else {
        inputRefs.current[3]?.focus();
      }
    }
  };

  const reset = () => {
    setDigits(['', '', '', '']);
    setStatus('idle');
    setDiscountPercent(0);
    setMessage('');
    onInvalidCode();
    inputRefs.current[0]?.focus();
  };

  const discountedPrice = Math.max(0, originalPrice - (originalPrice * discountPercent / 100));

  return (
    <div className="p-3.5 border border-slate-300 rounded-xl bg-white space-y-3 shadow-2xs">
      <div className="flex items-center gap-1.5">
        <Tag className="w-4 h-4 text-primary" />
        <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Affiliate Code (Optional)</h4>
      </div>
      
      <p className="text-[10px] text-slate-500">
        Enter a 4-digit referral code to get a discount on your registration fee.
      </p>

      <div className="flex items-center gap-2">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => { inputRefs.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={digit}
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            disabled={status === 'checking' || status === 'valid'}
            className={`w-12 h-14 text-center text-xl font-bold rounded-lg border-2 shadow-sm transition-all outline-none ${
              status === 'valid' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' :
              status === 'invalid' || status === 'error' ? 'border-red-400 bg-red-50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-100' :
              'border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900'
            }`}
          />
        ))}
      </div>

      <div className="min-h-[24px] flex items-center">
        {status === 'checking' && (
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking code...
          </div>
        )}
        
        {status === 'valid' && (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> {message}
              </div>
              <button type="button" onClick={reset} className="text-[10px] font-bold text-slate-500 hover:text-red-600 underline">Change</button>
            </div>
            
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex justify-between items-center">
               <span className="text-[11px] font-bold text-emerald-900">Final Price:</span>
               <div className="flex items-center gap-2">
                 <span className="text-[11px] text-slate-500 line-through">Rs. {originalPrice.toLocaleString()}</span>
                 <span className="text-sm font-extrabold text-emerald-700">Rs. {discountedPrice.toLocaleString()}</span>
               </div>
            </div>
          </div>
        )}

        {(status === 'invalid' || status === 'error') && (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-700">
                <AlertCircle className="w-3.5 h-3.5" /> {message}
              </div>
              <button type="button" onClick={reset} className="text-[10px] font-bold text-slate-500 hover:text-slate-800 underline">Retry</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
