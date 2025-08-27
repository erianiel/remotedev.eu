type SearchBarProps = {
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: () => void;
};

function SearchBar({
  value,
  placeholder,
  className,
  onChange,
}: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      className={`bg-stone-50 p-1 border-1 border-stone-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 ${className}`}
      onChange={onChange}
    />
  );
}

export default SearchBar;
