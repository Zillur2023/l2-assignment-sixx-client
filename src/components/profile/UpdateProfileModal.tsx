"use client";
import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Upload, UploadFile, UploadProps } from "antd";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { useGetUserQuery, useUpdateProfileMutation } from "@/redux/features/user/userApi";
import { RootState } from "@/redux/store";


type FormValues = {
  name?: string;
  boi?: string;
  image?: UploadFile[];
};

type UpdateProfileModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ isOpen, onOpenChange }) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });
  const [updateProfile] = useUpdateProfileMutation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      boi: "",
      image: [],
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        name: userData?.data?.name || "",  // Prepopulate with userData name
        // boi: userData?.data?.boi || "",    // Prepopulate with userData boi (bio)
        image: [],                  // Keep image empty for user to upload new one
      });
    }
  }, [userData, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = new FormData();
    if (fileList.length > 0) {
      const imageFile = fileList[0].originFileObj as Blob;
      formData.append("image", imageFile);
    }
    const updateData = {
      ...data,
      _id: userData?.data?._id,
    };
    formData.append("data", JSON.stringify(updateData));
    const toastId = toast.loading("loading...")

    const result = await updateProfile(formData).unwrap();
    if (result.success) {
      toast.success(result.message, {id: toastId});
      reset();
      onOpenChange(false);  // Close the modal on success
    } else {
      toast.warning(result?.message, {id: toastId});
    }
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
            canvas.toBlob((result) => resolve(result as Blob));
          };
        };
      });
    },
    onChange(info) {
      setFileList(info.fileList);
    },
    customRequest: ({ file, onSuccess }) => {
      setFileList([{ ...(file as UploadFile), status: "done" }]);
      onSuccess?.(file);
    },
  };

  return (
    <Modal
      title="Update Profile"
      visible={isOpen}
      onCancel={() => onOpenChange(false)}
      footer={[
        <Button key="cancel" onClick={() => onOpenChange(false)}>
          Close
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit(onSubmit)}>
          Submit
        </Button>,
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter your name" />
            )}
          />
        </div>

        {/* Bio */}
        {/* <div>
          <label htmlFor="boi" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <Controller
            name="boi"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter your bio" />
            )}
          />
        </div> */}

        {/* Upload Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <>
                <Upload {...uploadProps} fileList={fileList} onChange={(info) => {
                  setFileList(info.fileList);
                  field.onChange(info.fileList);
                }}>
                  <Button className=" w-full" type="default" icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </>
            )}
          />
        </div>

        {/* Submit Button */}
        {/* <Button type="primary" htmlType="submit" className="w-full">
          Update Profile
        </Button> */}
      </form>
    </Modal>
  );
};

export default UpdateProfileModal;
