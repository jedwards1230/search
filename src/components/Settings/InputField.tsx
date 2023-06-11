export default function InputField({
    label,
    type,
    value,
    placeholder,
    onChange,
    Link,
}: {
    label: string;
    type: 'text' | 'oneTimeCode';
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    Link?: () => JSX.Element;
}) {
    return (
        <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center justify-between md:flex-col md:items-start md:justify-center">
                <div>{label}:</div>
                {Link && (
                    <div className="text-sm leading-tight tracking-tight text-blue-500 underline">
                        <Link />
                    </div>
                )}
            </div>
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
                autoComplete="off"
                onBlur={(e) => (e.target.type = type)}
                className="rounded border border-neutral-500 bg-inherit p-2 focus:outline-none md:text-right"
            />
        </div>
    );
}
