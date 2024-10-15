"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input, Button, Upload, UploadFile, UploadProps, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { RcFile } from "antd/es/upload";
import { useGetUserQuery, useUpdateProfileMutation } from "@/redux/features/user/userApi";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

type FormValues = {
  name: string;
  bio: string;
  image?: UploadFile[];
};

const UpdateProfile: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, {
    skip: !user?.email,
  });
  const [updateProfile] = useUpdateProfileMutation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      bio: "",
      image: [],
    },
  });

  // Pre-fill the form when the user data is fetched
  useEffect(() => {
    if (userData) {
      setValue("name", userData.name || "");
      setValue("bio", userData.bio || "");
      // If the user has an image, set it in the fileList
      if (userData.image) {
        setFileList([{ uid: "-1", name: "profile-image", status: "done", url: userData.image }]);
      }
    }
  }, [userData, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = new FormData();

    if (fileList.length > 0) {
      const imageFile = fileList[0].originFileObj as Blob;
      formData.append("image", imageFile);
    }

    formData.append("data", JSON.stringify(data));

    try {
      const result = await updateProfile(formData).unwrap();
      if (result.success) {
        toast.success(result.message);
        reset();
        setIsModalVisible(false); // Close the modal after success
      } else {
        toast.warning(result?.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
    }
  };

  const uploadProps: UploadProps = {
    listType: "picture",
    beforeUpload(file) {
      return false; // Prevent automatic upload
    },
    onChange(info) {
      setFileList(info.fileList);
    },
    customRequest: ({ file, onSuccess }) => {
      setFileList([{ ...(file as RcFile), status: "done" }]);
      onSuccess?.(file);
    },
  };

  // Function to open the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to close the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex items-center justify-center m-10 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Profile</h2>

        {/* Button to open the Update Profile modal */}
        <Button type="primary" onClick={showModal} className="w-full" size="large">
          Update Profile
        </Button>

        {/* Modal for updating profile */}
        <Modal
          title="Update Profile"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          centered
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

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <Controller
                name="bio"
                control={control}
                rules={{ required: "Bio is required" }}
                render={({ field }) => (
                  <Input
                    id="bio"
                    {...field}
                    placeholder="Enter your bio"
                    status={errors.bio ? "error" : ""}
                  />
                )}
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            {/* Upload Image */}
            <div>
              <label htmlFor="upload-image" className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
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
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="primary" htmlType="submit" className="w-full" size="large">
              Save Changes
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default UpdateProfile;
