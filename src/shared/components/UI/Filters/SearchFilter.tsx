import Input from "@/shared/components/UI/Input/Input";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchFilter: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Search",
}) => {
  return (
    <div className="w-64">
      <Input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};




export default SearchFilter;