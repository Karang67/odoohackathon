import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon: Icon,
    iconRight,
    type = 'text',
    className = '',
    containerClassName = '',
    required,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full py-3 rounded-xl border text-sm transition-all duration-200
            bg-white dark:bg-surface-dark-card
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2
            ${Icon ? 'pl-10' : 'pl-4'}
            ${isPassword || iconRight ? 'pr-10' : 'pr-4'}
            ${error
              ? 'border-red-300 dark:border-red-500/50 focus:ring-red-300/50 focus:border-red-400'
              : 'border-gray-200 dark:border-surface-dark-border focus:ring-primary/40 focus:border-primary/50 hover:border-gray-300 dark:hover:border-white/20'
            }
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {iconRight && !isPassword && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {iconRight}
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400">
          <AlertCircle size={13} />
          <p className="text-xs">{error}</p>
        </div>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}
    </div>
  );
});

export default Input;
