"use client";

import React from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import PostModal from "./PostModal";

const CreatePost: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button color="primary" onPress={onOpen}>
        Create Post
      </Button>
      <PostModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default CreatePost;
