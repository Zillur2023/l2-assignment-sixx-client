/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Upload, Form, Select, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import { useCreatePostMutation, useUpdatePostMutation } from "@/redux/features/post/postApi";
import { UploadFile, UploadProps } from "antd/es/upload";
import { toast } from "sonner";

const { Option } = Select;

interface CreatePostModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  updatePostData?: any | null; // Add initialPostData to hold post info for editing
}

type FormValues = {
  title: string;
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
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });

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
      title: updatePostData?.title || "",
      content: updatePostData?.content || "",
      category: updatePostData?.category || "",
      image: updatePostData?.image || [],
    },
  });

  // Populate form when updating
  useEffect(() => {
    if (updatePostData) {
      setValue("title", updatePostData?.title);
      setValue("content", updatePostData?.content);
      setValue("category", updatePostData?.category);
    }
  }, [updatePostData, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = data.content;
    const plainText = tempElement.textContent || tempElement.innerText || "";
    const formData = new FormData();

    const updatedData: any = {
      ...data,
      _id: updatePostData?._id, // Include the id for update
      author: userData?.data?._id,
      content: plainText,
    };

    const imageFile = fileList[0]?.originFileObj as Blob;
    if (imageFile) formData.append("image", imageFile);
    formData.append("data", JSON.stringify(updatedData));

    const toastId = toast.loading("loading...");
    try {
      const result = updatePostData
        ? await updatePost(formData).unwrap()
        : await createPost(formData).unwrap();

      if (result.success) {
        toast.success(result.message, { id: toastId });
        reset();
        onOpenChange(false); // Close modal
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
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
        {/* Title Field */}
        <Form.Item
          label="Title"
          validateStatus={errors.title ? "error" : ""}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            rules={{
              required: !updatePostData ? "Title is required" : undefined,
            }}
            render={({ field }) => <Input {...field} placeholder="Post title" />}
          />
        </Form.Item>

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
              required: !updatePostData ? "Content is required" : undefined,
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
            rules={{ required: !updatePostData ? "Category is required" : undefined }}
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
