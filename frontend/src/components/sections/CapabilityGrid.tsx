'use client';

import * as LucideIcons from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ScrollReveal from '@/components/ui/ScrollReveal';
import type { ProductCapability, ProductAccent } from '@/data/products';

interface CapabilityGridProps {
  capabilities: ProductCapability[];
  accent: ProductAccent;
  productName: string;
  productNumber: string;
}

/* Dynamically resolve Lucide icon by name */
function getIcon(iconName: string) {
  const icons = (LucideIcons as unknown) as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>;
  return icons[iconName] || LucideIcons.Zap;
}

function TiltCard({ cap, Icon, cardBorderHover, iconBg, glowAura }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isHovered = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });
  const scaleSpring = useSpring(isHovered, { stiffness: 400, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["22deg", "-22deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-22deg", "22deg"]);
  const scale = useTransform(scaleSpring, [0, 1], [1, 1.06]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
    isHovered.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    isHovered.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
      className={`relative overflow-hidden bg-gradient-to-b from-white to-slate-50/90 rounded-2xl p-6 md:p-7 h-full border border-border/80 shadow-md hover:shadow-2xl group cursor-pointer transition-shadow duration-300 ${cardBorderHover}`}
    >
      {/* Liquid Light Reflection Sheen Sweep */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none z-10" />

      {/* Ambient Glow Aura */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 ${glowAura} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      <div className="relative z-20 flex items-start gap-4" style={{ transform: "translateZ(50px)" }}>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-all duration-300 group-hover:scale-115 group-hover:rotate-12 ${iconBg}`}
          style={{ transform: "translateZ(20px)" }}
        >
          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <h3 className="font-extrabold text-base text-text-primary mb-1 group-hover:text-black transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
            {cap.name}
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            {cap.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function CapabilityGrid({
  capabilities,
  accent,
  productName,
  productNumber,
}: CapabilityGridProps) {
  const isBlue = accent === 'blue';
  const accentText = isBlue ? 'text-primary' : 'text-secondary';
  const cardBorderHover = isBlue ? 'hover:border-blue-500/50 hover:shadow-blue-500/15' : 'hover:border-emerald-500/50 hover:shadow-emerald-500/15';
  const iconBg = isBlue ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white';
  const glowAura = isBlue ? 'bg-blue-500/15' : 'bg-emerald-500/15';

  return (
    <section className="bg-surface section-padding relative overflow-hidden">
      <div className="container-main relative z-10">
        <ScrollReveal delay={0.05}>
          <span className={`text-technical ${accentText} inline-block mb-2 font-bold tracking-widest`}>
            PRODUCT {productNumber} / CAPABILITIES
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="text-h2 text-text-primary max-w-[500px] mb-3 font-extrabold tracking-tight">
            Engineered for Operational Scale
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-body text-text-secondary max-readable mb-8 md:mb-12">
            Production-proven capabilities engineered to automate complex workflows seamlessly.
          </p>
        </ScrollReveal>

        {/* Dynamic Colorful Capability Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {capabilities.map((cap, i) => {
            const Icon = getIcon(cap.icon);
            return (
              <ScrollReveal key={cap.name} delay={0.04 * i} className="h-full">
                <div style={{ perspective: "1000px" }} className="h-full">
                  <TiltCard 
                    cap={cap} 
                    Icon={Icon} 
                    cardBorderHover={cardBorderHover} 
                    iconBg={iconBg} 
                    glowAura={glowAura} 
                  />
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
