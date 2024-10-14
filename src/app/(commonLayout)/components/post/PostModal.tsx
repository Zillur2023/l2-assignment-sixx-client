/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useForm, Controller } from "react-hook-form";
import { useCreatePostMutation } from "../../../redux/features/post/postApi";
import { RootState } from "../../../redux/store";
import { useGetUserQuery } from "../../../redux/features/user/userApi";
import { useAppSelector } from "../../../redux/hooks";

interface CreatePostModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const categories = ["Adventure", "Business Travel", "Exploration"];

const PostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, {
    skip: !user?.email,
  });
  const [createPost] = useCreatePostMutation();
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = data.content; // Set the HTML content
    const plainText = tempElement.textContent || tempElement.innerText || ""; // Get the plain text

    console.log({ content: plainText }); // Log the plain text
    const updatedData = {
      ...data, // Spread the existing data
      title: "zillur",
      author: userData?.data?._id,
      content: plainText, // Override the content with plain text
    };
    console.log({ updatedData });
    const res = await createPost(updatedData).unwrap();
    console.log({ res });
    onOpenChange(false); // Close modal after submission
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create a New Post
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Content with ReactQuill */}
                <div>
                  <label htmlFor="content">Content</label>
                  <Controller
                    name="content"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <ReactQuill
                        {...field}
                        placeholder="Write your post here..."
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                {/* Image Input with Controller */}
                <div>
                  <label htmlFor="image">Attach Image</label>
                  <Controller
                    name="image"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Image URL"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label htmlFor="category">Category</label>
                  <Controller
                    name="category"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <select {...field} className="w-full border">
                        <option value="" disabled>
                          Select a category
                        </option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              {/* <Button color="primary" onPress={handleSubmit(onSubmit)}> */}
              <Button color="primary" onClick={handleSubmit(onSubmit)}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
