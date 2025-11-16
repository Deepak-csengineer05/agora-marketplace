import React from 'react';

export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-full focus:outline-none transition-transform';
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-8 py-3 text-lg'
  };

  const variants = {
    primary: 'bg-agoraTeal text-black hover:scale-105',
    accent: 'bg-agoraPink text-black hover:scale-105',
    ghost: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100',
    success: 'bg-green-400 text-black hover:scale-105'
  };

  const cls = `${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`;

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
