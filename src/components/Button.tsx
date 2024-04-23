import React from 'react';

interface FieldProps {
  label: string;
  onClick?: () => void;
}

const Field: React.FC<FieldProps> = ({ label, onClick }) => {
  return (
    <div className='flex w-full'>
      <button
        className='w-full py-1 text-xl text-white transition-all duration-300 bg-gray-500 rounded-md hover:bg-gray-600 active:scale-105'
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default Field;
