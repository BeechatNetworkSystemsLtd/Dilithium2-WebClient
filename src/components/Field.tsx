import React from 'react';

interface FieldProps {
  label: string;
  name: string;
  value?: string;
  rows?: number;
  placeholder?: string;
}

const Field: React.FC<FieldProps> = ({
  label,
  name,
  value = '',
  rows = 4,
  placeholder = '',
}) => {
  return (
    <div className='flex flex-col w-full gap-2'>
      <label htmlFor={name} className='text-xl'>
        {label}
        {value}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className='w-full p-2 rounded-md outline-gray-200'
      />
    </div>
  );
};

export default Field;
