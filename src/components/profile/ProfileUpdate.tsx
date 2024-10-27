/* eslint-disable @next/next/no-img-element */
"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FieldValues, FormProvider, SubmitHandler, useForm  } from "react-hook-form";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { useGetUserQuery, useUpdateProfileMutation } from "@/redux/features/user/userApi";
import { RootState } from "@/redux/store";
import CustomInput from "../form/CustomInput";
import CustomModal from "../modal/CustomModal";



const UpdateProfileModal = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });
  const [updateProfile] = useUpdateProfileMutation();
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]);
  

  const methods = useForm();

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    if (userData) {
      setValue("name", userData.data.name);
      // setValue("image", userData.data.image);
    }
  }, [userData, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();
    formData.append("image", imageFiles?.[0])

    const updateData = {
      ...data,
      _id: userData?.data?._id,
    };
    formData.append("data", JSON.stringify(updateData));
    const toastId = toast.loading("loading...")

    const result = await updateProfile(formData).unwrap();
    if (result.success) {
      toast.success(result.message, {id: toastId});
    } else {
      toast.warning(result?.message, {id: toastId});
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
    <CustomModal
      openButtonText="Edit Profile"
      actionButtonText= "Update"
      title="Update Profile"
       buttonVariant="bordered"
       buttonClassName='rounded-md border hover:border-blue-500 py-0 w-full'
      onUpdate={handleSubmit(onSubmit)}
    >
       <FormProvider {...methods}>
       <form onSubmit={handleSubmit(onSubmit)}>
        
       
        <div className="py-3">
          <CustomInput label="Name" name="name" size="sm" />
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
             </form>
                  </FormProvider>

    </CustomModal>
  );
};

export default UpdateProfileModal;
