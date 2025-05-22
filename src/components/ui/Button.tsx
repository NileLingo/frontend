import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-full font-medium transition-all duration-200 focus:outline-none';
  
  const variantStyles = {
    primary: 'bg-[#BB86FC] text-[#121212] hover:bg-opacity-90',
    secondary: 'bg-[#1E1E1E] text-[#F5F5F5] hover:bg-[#2A2A2A]',
    outline: 'bg-transparent border border-[#BB86FC] text-[#BB86FC] hover:bg-[#BB86FC] hover:bg-opacity-10',
    text: 'bg-transparent text-[#BB86FC] hover:underline'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`;
  
  return (
    <button 
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;