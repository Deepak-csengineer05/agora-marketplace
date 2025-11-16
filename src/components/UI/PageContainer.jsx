import React from 'react';

export default function PageContainer({ children, title, className = '' }) {
  return (
    <main className={`max-w-4xl mx-auto px-6 py-12 ${className}`}>
      {title && (
        <h1 className="text-3xl font-extrabold mb-6 bg-brand-gradient bg-clip-text text-transparent">
          {title}
        </h1>
      )}
      {children}
    </main>
  );
}
