'use client'
import React, { useState } from "react";
import { Modal, Button, Upload, Form, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import { useCreatePostMutation } from "@/redux/features/post/postApi";
import { RcFile, UploadFile } from "antd/es/upload";
import { toast } from "sonner";

const { Option } = Select;

type FormValues = {
  content: string;
  category: string;
  image?: UploadFile[];
};

interface CreatePostModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const categories = ["Adventure", "Business Travel", "Exploration"];

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, {
    skip: !user?.email,
  });
  const [createPost] = useCreatePostMutation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = data.content;
    const plainText = tempElement.textContent || tempElement.innerText || "";

    const updatedData = {
      ...data,
      title: "zillur",
      author: userData?.data?._id,
      content: plainText,
    };
    const formData = new FormData();

    const imageFile = fileList[0]?.originFileObj as Blob;

    formData.append("image", imageFile);
    formData.append("data", JSON.stringify(updatedData));

    const result = await createPost(formData).unwrap();
    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      toast.warning(result?.message);
    }
  };

  const uploadProps = {
    listType: "picture",
    beforeUpload(file: RcFile) {
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
    onChange(info: any) {
      setFileList(info.fileList);
    },
    customRequest: ({ file, onSuccess }: any) => {
      setFileList([{ ...(file as RcFile), status: "done" }]);
      onSuccess?.(file);
    },
  };

  return (
    <Modal
      title="Create a New Post"
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
      <Form layout="vertical">
        {/* Content with ReactQuill */}
        <Form.Item label="Content" validateStatus={errors.content ? "error" : ""} help={errors.content?.message}>
          <Controller
            name="content"
            control={control}
            defaultValue=""
            rules={{
              required: "Content is required",
              validate: (value) => {
                const tempElement = document.createElement("div");
                tempElement.innerHTML = value;
                const plainText =
                  tempElement.textContent || tempElement.innerText || "";
                return plainText.trim().length > 0 || "Content cannot be empty.";
              },
            }}
            render={({ field }) => (
              <>
                <ReactQuill
                  {...field}
                  placeholder="Write your post here..."
                  onChange={field.onChange}
                />
              </>
            )}
          />
        </Form.Item>

        {/* Category Selection */}
        <Form.Item label="Category" validateStatus={errors.category ? "error" : ""} help={errors.category?.message}>
          <Controller
            name="category"
            control={control}
            defaultValue=""
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
        <Form.Item label="Upload Image" validateStatus={errors.image ? "error" : ""} help={errors.image?.message}>
          <Controller
            name="image"
            control={control}
            rules={{ required: "Image is required" }}
            render={({ field }) => (
              <Upload
              className=" w-full"
                {...uploadProps}
                fileList={fileList}
                onChange={(info) => {
                  setFileList(info.fileList);
                  field.onChange(info.fileList);
                }}
                onRemove={(file) => {
                  const updatedFileList = fileList.filter(
                    (f) => f.uid !== file.uid
                  );
                  setFileList(updatedFileList);
                  field.onChange(updatedFileList);
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

export default CreatePostModal;
