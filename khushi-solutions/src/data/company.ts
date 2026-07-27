/* ============================================================
   COMPANY DATA — Khushi Solutions company-level information
   Contact details sourced from environment variables.
   ============================================================ */

export const company = {
  name: 'Khushi Solutions',
  tagline: 'Software That Runs Real Businesses',
  description:
    'Software that helps businesses deliver, manage, and grow.',
  aboutStatement:
    'Our products serve real businesses every day — from managing deliveries across cities to running school operations and finances.',
  aboutDescription: '', // Deprecated in v2.1
  facts: [
    {
      label: 'PRODUCTS',
      value: '2',
      description: 'Complete platforms',
    },
    {
      label: 'USER ROLES',
      value: '10+',
      description: 'Across both products',
    },
    {
      label: 'INTEGRATIONS',
      value: '8+',
      description: 'Payments, AI, messaging',
    },
  ],
};

export const navItems = [
  { label: 'About', href: '/#about' },
  { label: 'Why Us', href: '/#why-us' },
  { label: 'Contact', href: '/#contact' },
];

/* Contact details from environment variables with fallbacks */
export function getContactInfo() {
  return {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@khushisolutions.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+92 XXX XXXXXXX',
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Lahore, Pakistan',
  };
}
