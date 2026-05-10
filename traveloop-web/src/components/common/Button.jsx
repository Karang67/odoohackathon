import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    iconRight,
    className = '',
    disabled,
    ...props
  },
  ref
) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-primary text-white shadow-primary hover:shadow-primary-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-primary/50',
    secondary: 'bg-white dark:bg-surface-dark-card text-primary border border-primary/20 hover:bg-primary/5 hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98] focus:ring-primary/30',
    ghost: 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/5 focus:ring-primary/20',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:ring-red-400',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-primary focus:ring-white/30',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:scale-[1.02] focus:ring-emerald-400',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs rounded-lg',
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-base rounded-2xl',
  };

  return (
    <motion.button
      ref={ref}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'xs' ? 13 : size === 'sm' ? 15 : size === 'lg' ? 19 : 16} />
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="ml-1">{iconRight}</span>
      )}
    </motion.button>
  );
});

export default Button;
