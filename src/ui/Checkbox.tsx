import * as React from "react";
import { useId } from "react";

type CheckboxProps = {
  label: string;
  checked?: boolean; // controlled (optional)
  defaultChecked?: boolean; // uncontrolled default
  onChange?: (next: boolean) => void;
  className?: string;
};

export default function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
}: CheckboxProps) {
  const id = useId();
  const isControlled = typeof checked === "boolean";
  const [internal, setInternal] = React.useState<boolean>(
    defaultChecked ?? false,
  );
  const isChecked = isControlled ? (checked as boolean) : internal;

  const handleChange = (next: boolean) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <label
      htmlFor={id}
      className="group inline-flex w-full items-center gap-2 rounded-md p-2 cursor-pointer select-none"
    >
      {/* Real checkbox (accessible) */}
      <input
        id={id}
        type="checkbox"
        className="sr-only peer"
        checked={isChecked}
        onChange={(e) => handleChange(e.target.checked)}
      />

      {/* Custom checkbox UI */}
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors duration-150 ${
          isChecked
            ? "bg-amber-400 border-amber-400"
            : "bg-white border-slate-300"
        }`}
        aria-hidden
      >
        {isChecked && (
          <svg
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 10l3 3 7-7" />
          </svg>
        )}
      </span>

      {/* Label text */}
      <span className="min-w-0 flex-1 text-xs font-medium tracking-wide text-stone-800">
        {label}
      </span>
    </label>
  );
}
