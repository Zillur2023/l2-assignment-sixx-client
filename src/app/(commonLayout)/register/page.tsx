"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input, Button, Upload, UploadFile, UploadProps } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RcFile } from "antd/es/upload";
// import {useCreateUserMutation} from "../../redux/features/user/userApi"
import { useCreateUserMutation } from "@/app/redux/features/user/userApi";


type FormValues = {
  name: string;
  email: string;
  password: string;
  image?: UploadFile[];
};
const RegisterPage: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: [],

    },
  });
  const router = useRouter();
  const [createUser] = useCreateUserMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log({data})
    const formData = new FormData();

      const imageFile = fileList[0].originFileObj as Blob;
      // console.log({imageFile})

      formData.append("image", imageFile);
      formData.append("data", JSON.stringify(data))
    console.log({ formData });
    const result = await createUser(formData).unwrap();
    if (result.success) {
      toast.success(result.message);
      reset()
      router.push("/login");
    } else {
      toast.warning(result?.message);
      router.push("/login");
    }
  };

  const goToLogin = () => {
    router.push("/login");
  };

  const uploadProps: UploadProps = {
    listType: "picture",
    beforeUpload(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = document.createElement("img");
          img.src = reader.result as string;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = "red";
            ctx.textBaseline = "middle";
            ctx.font = "33px Arial";
            canvas.toBlob((result) => resolve(result as Blob));
          };
        };
      });
    },
    onChange(info) {
      if (info.fileList) {
        setFileList(info.fileList);
      }
    },
    customRequest: ({ file, onSuccess }) => {
      setFileList([{ ...(file as RcFile), status: "done" }]);
      onSuccess?.(file);
    },
  };

  return (
    <div className="flex items-center justify-center m-10 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input
                  id="name"
                  {...field}
                  placeholder="Enter your name"
                  status={errors.name ? "error" : ""}
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field }) => (
                <Input
                  id="email"
                  {...field}
                  placeholder="Enter your email"
                  status={errors.email ? "error" : ""}
                />
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <Input.Password
                  id="password"
                  {...field}
                  placeholder="Enter your password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  status={errors.password ? "error" : ""}
                />
              )}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
            {/* Upload Image */}
        <div
        >
           <label
              htmlFor="Upload Image"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Image
            </label>
          
          <Controller
            name="image"
            control={control}
            rules={{ required: "Image is required" }}
            render={({ field }) => (
              <>
                  <Upload
                    {...uploadProps}
                    fileList={fileList}
                    onChange={(info) => {
                      setFileList(info.fileList);
                      field.onChange(info.fileList);
                    }}
                    onRemove={(file) => {
                      const updatedFileList = fileList.filter((f) => f.uid !== file.uid);
                      setFileList(updatedFileList);
                      field.onChange(updatedFileList);
                    }}
                  >
                    <Button type="primary" icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                  {errors.image && <p className="mt-1 text-sm text-red-600">Image is required</p>}
                </>
              
            )}
          />
        </div>

          {/* Register Button */}
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            size="large"
          >
            Register
          </Button>
        </form>

        {/* Redirect to Login */}
        <Button
          type="link"
          onClick={goToLogin}
          className="w-full text-center mt-4"
        >
          If you have an account? Login
        </Button>
      </div>
    </div>
  );
};

export default RegisterPage;
