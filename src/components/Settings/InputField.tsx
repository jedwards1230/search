export default function InputField({
    label,
    type,
    value,
    placeholder,
    onChange,
}: {
    label: string;
    type: string;
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-center">
            <div>{label}:</div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onFocus={(e) => {
                    e.target.type = 'text';
                    e.target.selectionStart = e.target.selectionEnd =
                        e.target.value.length;
                }}
                onBlur={(e) => (e.target.type = 'password')}
                className="rounded border border-neutral-500 bg-inherit p-2 focus:outline-none md:text-right"
            />
        </div>
    );
}
