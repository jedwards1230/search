export default function CheckboxField({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="flex w-full items-center justify-between gap-2">
            <div>{label}:</div>
            <input
                type="checkbox"
                className="cursor-pointer bg-inherit"
                checked={checked}
                onChange={onChange}
            />
        </div>
    );
}
