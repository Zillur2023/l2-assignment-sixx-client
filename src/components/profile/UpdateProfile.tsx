"use client";
import React, { useState } from "react";
import { Button } from "antd";
import UpdateProfileModal from "./UpdateProfileModal";

const UpdateProfile: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Button to open the Update Profile modal */}
      <Button
        type="default"
        className="w-full rounded-md"
        onClick={() => setIsOpen(true)}
      >
        Edit Profile
      </Button>
      {/* Pass the state to the modal component */}
      <UpdateProfileModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
};

export default UpdateProfile;
