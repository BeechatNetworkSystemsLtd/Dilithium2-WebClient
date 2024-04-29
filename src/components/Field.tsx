import React from "react";

interface FieldProps {
    label: string;
    description?: string;
    name: string;
    value?: string;
    rows?: number;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    actions?: React.ReactChild;
    onChange?: (val: string) => void;
}

const Field: React.FC<FieldProps> = ({ label, description, name, value, disabled, readOnly, rows = 4, placeholder = "", onChange, actions }) => {
    return (
        <div className="flex flex-col w-full gap-2">
            <div className="relative">
                <div className="flex items-end gap-4">
                    <label htmlFor={name} className="text-xl">
                        {label}
                    </label>
                    <span className="text-sm text-gray-500">{description}</span>
                </div>
                {actions}
            </div>
            <textarea
                id={name}
                name={name}
                rows={rows}
                placeholder={placeholder}
                className="w-full p-2 rounded-md outline-gray-200"
                value={value}
                disabled={disabled}
                readOnly={readOnly}
                onChange={({ target: { value } }) => onChange?.(value)}
            />
        </div>
    );
};

export default Field;
