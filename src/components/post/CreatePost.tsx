'use client'
import React, { useState } from "react";
import { Button } from "antd";
import CreatePostModal from "./CreatePostModal";

const CreatePost: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button className=" w-full rounded-md" type="default" onClick={() => setIsOpen(true)}>
        Create Post
      </Button>
      <CreatePostModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
};

export default CreatePost;

