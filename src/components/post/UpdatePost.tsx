"use client";
import React, { useState } from "react";
import { Button } from "antd";
import PostModal from "./PostModal";
import { IPost } from "../constant";

// Define the props type including updatePostData
interface UpdatePostProps {
  updatePostData: IPost;  // Properly typing the updatePostData as IPost
}

const UpdatePost: React.FC<UpdatePostProps> = ({ updatePostData }) => {
    console.log("{updatePostData}--> updatePost", updatePostData)
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button
        className=" w-full rounded-md"
        type="default"
        onClick={() => setIsOpen(true)}
      >
        Edit
      </Button>
      <PostModal isOpen={isOpen} onOpenChange={setIsOpen} updatePostData={updatePostData} />
    </div>
  );
};

export default UpdatePost;
