import React from "react";

// Reusable Button Component
export const Button = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 bg-blue-500 text-white rounded-2xl shadow-lg hover:bg-blue-600 transition-all duration-200 ease-in-out ${className}`}
  >
    {children}
  </button>
);

// Reusable Card Component
export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-2xl shadow-xl p-6 w-[400px] ${className}`}
  >
    {children}
  </div>
);

// Card Content Wrapper
export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4">{children}</div>
);

// Reusable Input Component
export const Input = ({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${className}`}
  />
);
