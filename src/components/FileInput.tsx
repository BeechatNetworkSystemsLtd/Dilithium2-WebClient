const readJsonFile = (file: Blob) =>
    new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
            if (event.target) {
                resolve(JSON.parse(event.target.result as string));
            }
        };

        fileReader.onerror = (error) => reject(error);
        fileReader.readAsText(file);
    });

interface FileInputProps {
    className?: string;
    handleData?: (val: string) => void;
}

const FileInput: React.FC<FileInputProps> = ({ className, handleData }) => {
    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            handleData?.(JSON.stringify(await readJsonFile(event.target.files[0])));
        }
    };

    return <input className={className} type="file" accept=".json,application/json" onChange={onChange} />;
};

export default FileInput;
