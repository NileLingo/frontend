import React, { InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  variant?: 'filled' | 'outlined';
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  fullWidth = false,
  variant = 'filled',
  className = '',
  ...props
}) => {
  const baseInputStyles = 'bg-[#1E1E1E] text-[#F5F5F5] placeholder-[#757575] rounded focus:outline-none focus:ring-1 focus:ring-[#BB86FC] transition-all';
  
  const variantStyles = {
    filled: 'p-3 border-none',
    outlined: 'p-3 border border-[#757575] focus:border-[#BB86FC]'
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  const errorStyles = error ? 'border-[#CF6679] focus:ring-[#CF6679]' : '';
  const rtlStyles = 'rtl:text-right';
  
  const combinedClassName = `${baseInputStyles} ${variantStyles[variant]} ${widthStyle} ${errorStyles} ${rtlStyles} ${className}`;
  
  return (
    <div className={`flex flex-col ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="mb-1 text-[#CCCCCC] rtl:text-right">{label}</label>
      )}
      <input
        className={combinedClassName}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[#CF6679] rtl:text-right">{error}</p>
      )}
    </div>
  );
};

export default TextField;