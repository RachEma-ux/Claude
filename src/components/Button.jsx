import { cn } from '@/lib/utils';

export const Button = ({
  children,
  onClick,
  disabled = false,
  variant = 'default',
  className = '',
  style,
  title
}) => {
  const baseClass = "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const variantClass = variant === 'ghost'
    ? "hover:bg-gray-700 text-gray-400"
    : variant === 'minimal-ghost'
    ? "hover:bg-gray-800 text-gray-400"
    : "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClass, variantClass, className)}
      style={style}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
};
