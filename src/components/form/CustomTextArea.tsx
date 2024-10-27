import { IInput } from "@/type";
import { useFormContext, useWatch } from "react-hook-form";

// import { IInput } from "@/src/types";
import ReactQuill from "react-quill";

interface IProps extends IInput {
  type?: string;
}

export default function CustomTextarea({
  name,
  label,
  variant = "bordered",
}: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const currentValue = useWatch({ name });

  return (
 
    <ReactQuill {...register(name)}  />
  );
}
