/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react";
import {  FieldValues, SubmitHandler } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import Link from "next/link";
import CustomForm from "@/components/form/CustomForm";
import CustomInput from "@/components/form/CustomInput";
import { Button } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import loginValidationSchema from "@/schemas/login.schema"; 


const LoginPage: React.FC = () => {
  
  const router = useRouter()
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  // Get the location state or default to the home page
  // const from = (location.state as { from: string })?.from || "/";

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    const toastId = toast.loading("Logging in...")

  try {
    const res = await login(formData).unwrap()
    if(res) {
     const { token } = res.data;
           const user:any = jwtDecode(token);
           dispatch(setUser({ user, token }));
          router.push("/")
     toast.success(res?.message, {id: toastId})
    }
    
  } catch (error:any) {
    toast.error(error?.data?.message,{id: toastId})
  }
  };
  

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center">
    <h3 className="my-2 text-xl font-bold">Login</h3>
    <div className="w-[35%]">
      <CustomForm
        //! Only for development
        defaultValues={{
          email: "zillur@gmail.com",
          password: "1234",
        }}
        resolver={zodResolver(loginValidationSchema)}
        onSubmit={onSubmit}
      >
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

        <Button
          className="my-3 w-full rounded-md bg-default-900 text-default"
          size="lg"
          type="submit"
        >
          Login
        </Button>
      </CustomForm>
      <div className="text-center">
        Not have an account ? <Link href={"/register"} className="text-blue-500 hover:text-blue-700">Register</Link>
      </div>
    </div>
  </div>
  );
};

export default LoginPage;
