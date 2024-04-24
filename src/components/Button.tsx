import React from 'react';

interface FieldProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Field: React.FC<FieldProps> = ({ label, disabled, onClick }) => {
  return (
    <div className='flex w-full'>
      <button
        className='w-full py-1 text-xl text-white transition-all duration-300 bg-gray-500 rounded-md hover:bg-gray-600 active:scale-105 disabled:opacity-30'
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </button>
    </div>
  );
};

export default Field;
