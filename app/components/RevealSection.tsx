// components/RevealSection.tsx
'use client';
import { motion } from 'framer-motion';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

interface RevealSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function RevealSection({ children, delay = 0, className = '' }: RevealSectionProps) {
  const { reduceMotion } = useDeviceCapability();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}