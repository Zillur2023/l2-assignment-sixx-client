"use client";

import { Input } from "@nextui-org/input";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";

interface CustomInputProps {
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "password";
  size?: "sm" | "md" | "lg";
}

export default function CustomInput({
  name,
  label,
  required = false,
  type = "text",
  size = "md",
}: CustomInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { register, formState: { errors } } = useFormContext();

  const inputType = type === "password" && isPasswordVisible ? "text" : type;
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <div>
      <Input
        {...register(name)}
        label={label}
        required={required}
        size={size}
        type={inputType}
        errorMessage={errors[name]?.message as string}
        isInvalid={Boolean(errors[name])}
        endContent={
          type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
              className="focus:outline-none"
            >
              {isPasswordVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          )
        }
      />
    </div>
  );
}
