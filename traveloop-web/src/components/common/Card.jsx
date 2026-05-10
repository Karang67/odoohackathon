import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = false,
  glass = false,
  gradient = false,
  padding = 'p-6',
  onClick,
  ...props
}) {
  const base = `rounded-2xl border transition-all duration-300 ${padding}`;
  const variants = glass
    ? 'glass-card shadow-glass'
    : gradient
    ? 'bg-gradient-card border-primary/10 shadow-card'
    : 'bg-white dark:bg-surface-dark-card border-gray-100 dark:border-surface-dark-border shadow-card';
  const hoverClass = hover ? 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer' : '';

  return (
    <motion.div
      layout
      className={`${base} ${variants} ${hoverClass} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
