"use client";
import React, { useState } from "react";
import { Button } from "antd";
import PostModal from "./PostModal";

const CreatePost: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button
        className=" w-full rounded-md"
        type="default"
        onClick={() => setIsOpen(true)}
      >
        Create Post
      </Button>
      <PostModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
};

export default CreatePost;
