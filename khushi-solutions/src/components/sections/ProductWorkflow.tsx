'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import type { ProductData } from '@/data/products';

interface ProductWorkflowProps {
  product: ProductData;
}

/* Workflow nodes — sourced from actual product architecture */
const bitesWorkflow = [
  { label: 'Customer / Rider / Admin', sublabel: 'Mobile & Web App', position: 'client' },
  { label: 'React Native (Expo)', sublabel: 'Single Codebase — Cross-Platform', position: 'frontend' },
  { label: 'REST API (HTTPS)', sublabel: 'Bearer JWT Authentication', position: 'api' },
  { label: 'FastAPI Backend', sublabel: 'Python — Async Production Server', position: 'backend' },
  { label: 'MongoDB Atlas', sublabel: 'NoSQL Cloud Database', position: 'database' },
  { label: 'External Services', sublabel: 'OSRM · Nominatim · Expo Push', position: 'external' },
];

const erpWorkflow = [
  { label: 'Desktop CMS / Mobile App', sublabel: 'React 18 + CMS Mobile', position: 'client' },
  { label: 'Multi-Tenant Routing', sublabel: 'JWT → Database Selection', position: 'frontend' },
  { label: 'FastAPI Backend', sublabel: 'Python 3.12 — Middleware Pipeline', position: 'api' },
  { label: 'Business Logic', sublabel: 'Fee Engine · Payroll · Grading · Attendance Sync', position: 'backend' },
  { label: 'MongoDB (Isolated)', sublabel: 'SaaS Root DB + Tenant Databases', position: 'database' },
  { label: 'Integrations', sublabel: 'PayFast · AI Face Service · WhatsApp · Push', position: 'external' },
];

export default function ProductWorkflow({ product }: ProductWorkflowProps) {
  const workflow = product.accent === 'blue' ? bitesWorkflow : erpWorkflow;
  const accentText = product.accent === 'blue' ? 'text-primary' : 'text-secondary';
  const accentBg = product.accent === 'blue' ? 'bg-primary' : 'bg-secondary';
  const accentBorderFull =
    product.accent === 'blue' ? 'border-primary/20' : 'border-secondary/20';
  const accentLineBg =
    product.accent === 'blue' ? 'bg-primary/20' : 'bg-secondary/20';

  return (
    <section className="bg-primary-dark section-padding overflow-hidden">
      <div className="container-main">
        <ScrollReveal>
          <span className="text-technical text-primary/60 inline-block mb-4">
            PRODUCT {product.number} / SYSTEM ARCHITECTURE
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="text-h2 text-text-inverse max-w-[520px] mb-4">
            How {product.name} Works
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <p className="text-body text-text-inverse/60 max-readable mb-10 md:mb-14">
            End-to-end system architecture — from user interaction to data persistence and external service integration.
          </p>
        </ScrollReveal>

        {/* Responsive vertical flow diagram */}
        <ScrollReveal delay={0.2}>
          <div className="max-w-[600px] mx-auto">
            {workflow.map((node, i) => (
              <div key={node.label} className="flex flex-col items-center">
                {/* Node */}
                <div
                  className={`w-full border ${accentBorderFull} rounded-[var(--radius-md)] px-5 py-4 md:px-6 md:py-5 bg-white/[0.03] backdrop-blur-sm`}
                >
                  <span className="text-technical text-text-inverse/40 block mb-1">
                    LAYER {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-h4 text-text-inverse mb-0.5">
                    {node.label}
                  </h4>
                  <p className="text-small text-text-inverse/50">
                    {node.sublabel}
                  </p>
                </div>

                {/* Connector line */}
                {i < workflow.length - 1 && (
                  <div className="flex flex-col items-center py-2">
                    <div className={`w-px h-6 ${accentLineBg}`} />
                    <div className={`w-2 h-2 rounded-full ${accentBg} opacity-40`} />
                    <div className={`w-px h-6 ${accentLineBg}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Tech stack badges */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-2">
            {product.techStack.map((tech) => (
              <span
                key={tech}
                className={`text-technical text-text-inverse/50 border ${accentBorderFull} rounded-full px-3 py-1.5`}
              >
                {tech}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
