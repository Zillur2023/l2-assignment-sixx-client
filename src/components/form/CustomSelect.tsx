import { IInput } from "@/type";
import { Select, SelectItem } from "@nextui-org/select";
import { useFormContext } from "react-hook-form";

// import { IInput } from "@/src/types";

interface IProps extends IInput {
  options: {
    uid: string;
    name: string;
  }[];
}

export default function CustomSelect({
  options,
  name,
  label,
  variant = "bordered",
  disabled,
}: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Select
      {...register(name)}
      className="min-w-full sm:min-w-[225px]"
      isDisabled={disabled}
      label={label}
      variant={variant}
    >
      {options.map((option) => (
        <SelectItem key={option.uid}>{option.name}</SelectItem>
      ))}
    </Select>
  );
}
