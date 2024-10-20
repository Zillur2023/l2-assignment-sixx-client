/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  User,
  Link,
  Tooltip,
  Spinner
} from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { Avatar } from '@nextui-org/react';
// import { useAppSelector } from '../../../redux/hooks';
// import { RootState } from '../../../redux/store';
// import { useGetUserQuery } from '../../../redux/features/user/userApi';
// import { useCreateCommentMutation, useGetAllCommentQuery } from '../../../redux/features/comment/commentApi';
// import { useGetAllPostQuery } from '../../../redux/features/post/postApi';

import CommentPost from './CommentPost';
import { Trash2, VerifiedIcon, X } from 'lucide-react'; // Import the X icon for the close button
import { useAppSelector } from '@/redux/hooks';
import { useGetUserQuery } from '@/redux/features/user/userApi';
import { useGetAllPostQuery } from '@/redux/features/post/postApi';
import { useCreateCommentMutation, useDeleteCommentMutation, useGetAllCommentQuery } from '@/redux/features/comment/commentApi';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';

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
  const { data: postsData, refetch } = useGetAllPostQuery({postId});
  console.log('commentModal postData',postId)
  console.log('commentModal postData',postsData)
  const [deleteComment] = useDeleteCommentMutation()
  const { control, handleSubmit, reset, watch } = useForm();
  const [createComment] = useCreateCommentMutation();
  const { data: allCommentData } = useGetAllCommentQuery(postId);
  const [commentLoading, setCommentLoading] = useState(false); // Loading state for the comment button



  const commentText = watch('commentText'); // Watch the comment input field

  const onSubmit = async (data: any) => {
    setCommentLoading(true); // Set loading to true when submission starts
    const updatedData = {
      ...data,
      userId: userData?.data?._id,
      postId,
    };
    try {
      await createComment(updatedData).unwrap();
      reset();
      refetch(); // Refetch the posts
      postsRefetch();
    } catch (error:any) {
      toast.error(error?.data?.message); // Show error if submission fails
    } finally {
      setCommentLoading(false); // Set loading to false after submission completes
    }
  };

  const handleDeleteComment = async(commentId: string) => {
    const toastId = toast.loading('loading...')
    try {
      const res = await deleteComment(commentId).unwrap()

    if(res) {
      refetch(); // Refetch the posts
      postsRefetch();
      toast.success(res?.message, {id: toastId})
    }
    } catch (error:any) {
      toast.error(error?.data?.message, {id: toastId})
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="flex flex-col justify-between h-full relative" // Added relative position to modal
    >
      <ModalContent>
    
          <ModalHeader className="sticky top-0 bg-white z-10 p-4 shadow-md">
          <div className="flex items-center space-x-3">
          <User
              name={
                <span className="flex items-center gap-3 text-lg font-semibold">
                  {postsData?.data?.[0]?.author?.name}{" "}
                  {postsData?.data?.[0]?.author?.isVerified && <VerifiedIcon className="w-5 h-5 text-blue-500 " />}
                </span>
              }
              description={
                <Link href="" size="sm" isExternal>
                  {postsData?.data?.[0]?.author?.email}
                </Link>
              }
              avatarProps={{
                src: `${postsData?.data?.[0]?.author?.image}`,
              }}
            />
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
            {allCommentData?.data?.map((comment:any) => (
              <div key={comment?._id} className="flex items-start space-x-2">
                <Tooltip content={comment?.userId?.email}>
                <Avatar src={comment?.userId?.image} alt="Commenter" />
                </Tooltip>
                <div className="bg-gray-100 p-2 rounded-lg">
                 <div className='flex gap-3 '>
                 <p><strong>{comment?.userId?.name}</strong></p>
                 <Trash2 onClick={() => handleDeleteComment(comment?._id)} className="text-red-500 cursor-pointer size-4" />
                 </div>
                  {/* {comment?.author?._id == userData?.data?._id &&  <Trash2 onClick={() => handleDeleteComment(comment?._id)} className="text-red-500 cursor-pointer" />} */}

                  <p>{comment?.commentText}</p>
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
              color={commentText ? 'secondary' : 'default'} // Use default color when disabled
              className={!commentText ? 'bg-gray-300' : ''} // Apply custom styling when disabled
              disabled={!commentText} // Disable if no comment text
            >
              {commentLoading ? (
                <Spinner /> // Show spinner when loading
              ) : (
                'Comment'
              )}
            </Button>
          </form>
        </ModalFooter>
     
      </ModalContent>
    </Modal>
  );
};

export default CommentModal;
