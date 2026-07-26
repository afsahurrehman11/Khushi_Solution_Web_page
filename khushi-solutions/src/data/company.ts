/* ============================================================
   COMPANY DATA — Khushi Solutions company-level information
   Contact details sourced from environment variables.
   ============================================================ */

export const company = {
  name: 'Khushi Solutions',
  tagline: 'Engineered Software. Real Products. Proven Results.',
  description:
    'Khushi Solutions builds production-grade software platforms for local businesses and educational institutions. We engineer complete systems — from mobile apps to admin dashboards — with real-world reliability built into every layer.',
  aboutStatement:
    'We build real software that solves real problems. Our products serve businesses across multiple industries — from last-mile delivery operations to multi-tenant school management — each engineered from the ground up with full ownership of the codebase.',
  aboutDescription:
    'Khushi Solutions is a software engineering company specializing in full-stack platform development. We create production-grade systems designed for reliability, scalability, and the specific operational realities of Pakistani businesses and institutions.',
  facts: [
    {
      label: 'Products Built',
      value: '2',
      description: 'Full-stack production platforms',
    },
    {
      label: 'User Roles',
      value: '10+',
      description: 'Across both platforms',
    },
    {
      label: 'Integrations',
      value: '8+',
      description: 'Payment, AI, messaging, mapping',
    },
  ],
};

export const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
];

/* Contact details from environment variables with fallbacks */
export function getContactInfo() {
  return {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@khushisolutions.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+92 XXX XXXXXXX',
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Lahore, Pakistan',
  };
}
