/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from "react";
import { Modal, Button, Upload, Form, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useGetUserQuery } from "@/redux/features/user/userApi";
// import { useCreatePostMutation, useUpdatePostMutation } from "@/redux/features/post/postApi";
import { useCreatePostMutation, useUpdatePostMutation } from "@/redux/features/post/postApi";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import { toast } from "sonner";

const { Option } = Select;

interface CreatePostModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  updatePostData?: any | null; // Add initialPostData to hold post info for editing
}

type FormValues = {
  content: string;
  category: string;
  image?: UploadFile[];
};

const categories = ["Adventure", "Business Travel", "Exploration"];

const PostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onOpenChange,
  updatePostData, // Receive post data for updating
}) => {
  console.log("{updatePostData}---->POST MODAL", updatePostData)
  console.log(typeof(updatePostData))
  console.log("{updatePostData}---->POST MODAL ID", updatePostData?.content)
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, {
    skip: !user?.email,
  });
  console.log({user})

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      content: updatePostData?.content || "",
      category: updatePostData?.category || "",
      image: updatePostData?.image || [],
    },
  });

  // Populate form when updating
  useEffect(() => {
    if (updatePostData) {
      setValue("content", updatePostData?.content);
      setValue("category", updatePostData?.category);
      // setFileList(updatePostData.image || []);
    }
  }, [updatePostData, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = data.content;
    const plainText = tempElement.textContent || tempElement.innerText || "";
    const formData = new FormData();

    let updatedData: any;

    // Conditionally set updatedData based on updatePostData
    if (updatePostData) {
      updatedData = {
        ...data,
        updatePostData,
        _id: updatePostData?._id,  // Include the id for update
        author: userData?.data?._id,
        content: plainText,
      };
    } else {
      updatedData = {
        ...data,
        author: userData?.data?._id,  // No id for create
        content: plainText,
      };
    }
    console.log({updatedData})

    const imageFile = fileList[0]?.originFileObj as Blob;
    formData.append("image", imageFile);
    formData.append("data", JSON.stringify(updatedData));
    const toastId = toast.loading("loading...")

    // Check if we're updating or creating
    const result = updatePostData
      ? await updatePost(formData).unwrap()
      : await createPost(formData).unwrap();

    if (result.success) {
      toast.success(result.message, {id: toastId});
      reset();
      onOpenChange(false); // Close modal
    } else {
      toast.warning(result.message, {id: toastId});
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
      title={updatePostData ? "Update Post" : "Create a New Post"} // Change title
      visible={isOpen}
      onCancel={() => onOpenChange(false)}
      footer={[
        <Button key="cancel" onClick={() => onOpenChange(false)}>
          Close
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit(onSubmit)}>
          {updatePostData ? "Update" : "Submit"} {/* Change button text */}
        </Button>,
      ]}
    >
      <Form layout="vertical">
        {/* Content with ReactQuill */}
        <Form.Item
          label="Content"
          validateStatus={errors.content ? "error" : ""}
          help={errors.content?.message}
        >
          <Controller
            name="content"
            control={control}
            rules={{
              required: "Content is required",
              validate: (value) => {
                const tempElement = document.createElement("div");
                tempElement.innerHTML = value;
                const plainText =
                  tempElement.textContent || tempElement.innerText || "";
                return (
                  plainText.trim().length > 0 || "Content cannot be empty."
                );
              },
            }}
            render={({ field }) => (
              <ReactQuill {...field} placeholder="Write your post here..." />
            )}
          />
        </Form.Item>

        {/* Category Selection */}
        <Form.Item
          label="Category"
          validateStatus={errors.category ? "error" : ""}
          help={errors.category?.message}
        >
          <Controller
            name="category"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <Select {...field} placeholder="Select a category">
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item
          label="Upload Image"
          validateStatus={errors.image ? "error" : ""}
          help={errors.image?.message}
        >
          <Controller
            name="image"
            control={control}
            rules={{ required: "Image is required" }}
            render={({ field }) => (
              <Upload
                {...uploadProps}
                fileList={fileList}
                onChange={(info) => {
                  setFileList(info.fileList);
                  field.onChange(info.fileList);
                }}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PostModal;
