import React from "react";

// ✅ Button Component
export function Button({ children, onClick, className, variant = "primary" }) {
  const baseStyle = "px-4 py-2 rounded transition-all";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

// ✅ Card Component
export function Card({ children, className }) {
  return <div className={`border p-4 rounded-lg shadow-lg ${className}`}>{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}

// ✅ Dialog Components
export function Dialog({ open, onOpenChange, children }) {
  return open ? (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-4 rounded-lg relative">{children}</div>
      <button className="absolute top-2 right-2 text-gray-500" onClick={() => onOpenChange(false)}>✖</button>
    </div>
  ) : null;
}

export function DialogContent({ children }) {
  return <div className="p-4">{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="text-lg font-semibold">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

// ✅ DialogDescription Component
export function DialogDescription({ children }) {
  return <div className="text-sm text-gray-600">{children}</div>;
}

export function DialogFooter({ children }) {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>;
}

// ✅ Input Component
export function Input({ type, name, value, onChange, placeholder }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border p-2 rounded w-full"
    />
  );
}

// ✅ Label Component
export function Label({ children }) {
  return <label className="font-medium">{children}</label>;
}

// ✅ Select Component
export function Select({ name, value, onChange, children, placeholder, disabled = false, className = "" }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`border p-2 rounded w-full ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"} ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
}

// ✅ Checkbox Component
export function Checkbox({ name, checked, onChange, label }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500" />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}

// ✅ Pagination Component
export function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

// ✅ Table Component
export function Table({ children }) {
  return (
    <table className="min-w-full bg-white border border-gray-200">
      {children}
    </table>
  );
}

// ✅ Table Head Component
export function TableHead({ children }) {
  return (
    <thead className="bg-gray-100">
      <tr>{children}</tr>
    </thead>
  );
}

// ✅ Table Body Component
export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

// ✅ Table Row Component
export function TableRow({ children }) {
  return <tr className="hover:bg-gray-50">{children}</tr>;
}

// ✅ Table Header Cell Component
export function TableHeaderCell({ children }) {
  return (
    <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
      {children}
    </th>
  );
}

// ✅ Table Cell Component
export function TableCell({ children }) {
  return (
    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
      {children}
    </td>
  );
}