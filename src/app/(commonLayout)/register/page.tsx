/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCreateUserMutation } from "@/redux/features/user/userApi";
import { FieldValues, SubmitHandler } from "react-hook-form";
import CustomForm from "@/components/form/CustomForm";
import CustomInput from "@/components/form/CustomInput";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import registerValidationSchema from "@/schemas/register.schema";

const RegisterPage: React.FC = () => {

  const router = useRouter();
  const [createUser] = useCreateUserMutation();
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]);


  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();
    formData.append("data",JSON.stringify(data))
    formData.append("image", imageFiles?.[0])
 
    const toastId = toast.loading("loading..")

   try {
    const res = await createUser(formData).unwrap();
    console.log({res})
    if (res) {
      toast.success(res?.message, {id: toastId});
      router.push("/login");
    } 
   } catch (error:any) {
     toast.error(error?.data?.message, {id: toastId})
   }
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    setImageFiles((prev) => [...prev, file]);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center">
    <h3 className="my-2 text-xl font-bold">Register</h3>
    <div className="w-[35%]">
      <CustomForm
        //! Only for development
        defaultValues={{
          name: "zillur Rahman",
          email: "zillur@gmail.com",
          password: "1234",
        }}
        resolver={zodResolver(registerValidationSchema)}
        onSubmit={onSubmit}
      >
        <div className="py-3">
          <CustomInput label="Name" name="name" size="sm" />
        </div>
        <div className="py-3">
          <CustomInput label="Email" name="email" size="sm" />
        </div>
        <div className="py-3">
          <CustomInput
            label="Password"
            name="password"
            size="sm"
            type="password"
          />
        </div>
        <div className="py-3">
        <label
                  className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-default-200 text-default-500 shadow-sm transition-all duration-100 hover:border-default-400"
                  htmlFor="image"
                >
                  Upload image
                </label>
                <input
                  multiple
                  className="hidden"
                  id="image"
                  type="file"
                  onChange={(e) => handleImageChange(e)}
                />
        </div>
        {imagePreviews.length > 0 && (
              <div className="flex gap-5 my-5 flex-wrap">
                  <div
                    className="relative size-48 rounded-xl border-2 border-dashed border-default-300 p-2"
                  >
                    <img
                      alt="item"
                      className="h-full w-full object-cover object-center rounded-md"
                      src={imagePreviews?.[0]}
                    />
                  </div>
              
              </div>
            )}

        <Button
          className="my-3 w-full rounded-md bg-default-900 text-default"
          size="lg"
          type="submit"
        >
          Register
        </Button>
      </CustomForm>
      <div className="text-center">
        Already have an account ? <Link href={"/login"} className="text-blue-500 hover:text-blue-700">Login</Link>
      </div>
    </div>
  </div>
  );
};

export default RegisterPage;
