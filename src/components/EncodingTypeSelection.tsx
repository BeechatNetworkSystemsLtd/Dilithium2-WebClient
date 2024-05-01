interface FileInputProps {
    className?: string;
    handleData?: (event: React.FormEvent<HTMLSelectElement>) => void;
}

const encodingTypes = [
    {
        label: "Hex",
        value: "hex",
    },
    {
        label: "UTF-8",
        value: "utf8",
    },
];

const EncodingTypeSelection: React.FC<FileInputProps> = ({ className, handleData }) => {
    return (
        <div className={`flex gap-4 pr-4 ${className}`}>
            <label>Encoding Type: </label>
            <select onChange={handleData}>
                {encodingTypes.map(({ label, value }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default EncodingTypeSelection;
