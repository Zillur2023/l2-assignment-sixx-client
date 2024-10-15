/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button
} from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { Avatar } from '@nextui-org/react';
// import { useAppSelector } from '../../../redux/hooks';
// import { RootState } from '../../../redux/store';
// import { useGetUserQuery } from '../../../redux/features/user/userApi';
// import { useCreateCommentMutation, useGetAllCommentQuery } from '../../../redux/features/comment/commentApi';
// import { useGetAllPostQuery } from '../../../redux/features/post/postApi';

import CommentPost from './CommentPost';
import { X } from 'lucide-react'; // Import the X icon for the close button
import { useAppSelector } from '@/redux/hooks';
import { useGetUserQuery } from '@/redux/features/user/userApi';
import { useGetAllPostQuery } from '@/redux/features/post/postApi';
import { useCreateCommentMutation, useGetAllCommentQuery } from '@/redux/features/comment/commentApi';
import { RootState } from '@/redux/store';

interface CommentModalProps {
  postId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  postsRefetch: () => void; // New prop to trigger post data refetch
}

const CommentModal: React.FC<CommentModalProps> = ({
  postId,
  isOpen,
  onOpenChange,
  postsRefetch
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });
  const { data: postsData, refetch } = useGetAllPostQuery(postId);
  const { control, handleSubmit, reset, watch } = useForm();
  const [createComment] = useCreateCommentMutation();
  const { data: allCommentData } = useGetAllCommentQuery(postId);


  const commentText = watch('commentText'); // Watch the comment input field

  const onSubmit = async (data: any) => {
    const updatedData = {
      ...data,
      userId: userData?.data?._id,
      postId,
    };
    await createComment(updatedData).unwrap();
    reset();
    refetch(); // Refetch the posts
    postsRefetch();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="flex flex-col justify-between h-full relative" // Added relative position to modal
    >
      <ModalContent>
    
          <ModalHeader className="sticky top-0 bg-white z-10 p-4 shadow-md">
          <div className="flex items-center space-x-3">
            <Avatar src={userData?.data?.avatar} alt="User Avatar" />
            <p>{userData?.data?.name}</p>
          </div>
            {/* Close Icon */}
            <div
            className="absolute right-4 top-4 cursor-pointer z-20"
            onClick={() => onOpenChange(false)} // Close the modal
          >
            <X size={24} />
          </div>
        </ModalHeader>

        {/* Modal body for showing post and comments */}
        <ModalBody className="flex-1 overflow-y-auto px-4">
          {/* Post content */}
          <div className="mb-4">
            <CommentPost postsData={postsData} />
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            {allCommentData?.data?.map((item:any) => (
              <div key={item?._id} className="flex items-start space-x-2">
                <Avatar src="/path/to/commenter-avatar.jpg" alt="Commenter" />
                <div className="bg-gray-100 p-2 rounded-lg">
                  <p><strong>{item?.userId?.name}</strong></p>
                  <p>{item?.commentText}</p>
                </div>
              </div>
            ))}
          </div>
        </ModalBody>

        {/* Sticky Footer with input to add comment */}
        <ModalFooter className="sticky bottom-0 bg-white z-10 p-4 shadow-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center w-full space-x-2"
          >
            <Controller
              name="commentText"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  fullWidth
                  placeholder="Write a comment..."
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Button
              // auto
              type="submit"
              color={commentText ? 'primary' : 'default'} // Use default color when disabled
              className={!commentText ? 'bg-gray-300' : ''} // Apply custom styling when disabled
              disabled={!commentText} // Disable if no comment text
            >
              Comment
            </Button>
          </form>
        </ModalFooter>
     
      </ModalContent>
    </Modal>
  );
};

export default CommentModal;
