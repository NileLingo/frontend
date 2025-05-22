import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-[#1E1E1E] text-[#F5F5F5] placeholder-[#757575] rounded p-3 focus:outline-none focus:ring-1 focus:ring-[#BB86FC] transition-all resize-none';
  const widthStyle = fullWidth ? 'w-full' : '';
  const errorStyles = error ? 'border-[#CF6679] focus:ring-[#CF6679]' : '';
  
  const combinedClassName = `${baseStyles} ${widthStyle} ${errorStyles} ${className}`;
  
  return (
    <div className={`flex flex-col ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="mb-1 text-[#CCCCCC]">{label}</label>
      )}
      <textarea
        className={combinedClassName}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[#CF6679]">{error}</p>
      )}
    </div>
  );
};

export default TextArea;