/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button, useDisclosure } from "@nextui-org/react";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react";
import { RootState } from "../../../redux/store";
import { useGetUserQuery } from "../../../redux/features/user/userApi";
import { useAppSelector } from "../../../redux/hooks";
import {
  useGetAllPostQuery,
  useUpdateDownvoteMutation,
  useUpdateUpvoteMutation,
} from "../../../redux/features/post/postApi";
import { useEffect, useState } from "react";
import CommentModal from "../comment/CommentModal";

const Posts = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });
  const { data: postsData, refetch } = useGetAllPostQuery("");
  const [updateUpvote] = useUpdateUpvoteMutation();
  const [updateDownvote] = useUpdateDownvoteMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [postIdForComment, setPostIdForComment] = useState<string | null>(null);

  const handleUpvote = async (postId: string) => {
    const postData = { userId: userData?.data?._id, postId };
    const upvote = await updateUpvote(postData).unwrap();
    console.log({ upvote });
  };

  const handleDownvote = async (postId: string) => {
    const postData = { userId: userData?.data?._id, postId };
    const downvote = await updateDownvote(postData).unwrap();
    console.log({ downvote });
  };

  const handleCommentClick = (postId: string) => {
    refetch();
    setPostIdForComment(postId);
    onOpen();
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="mt-6">
      {postsData?.data?.map((post:any) => (
        <div key={post._id} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="relative w-10 h-10 mr-4">
              <Image
                src={post?.author?.image || "/default-avatar.png"}
                alt={`${post?.author?.name} profile`}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{post?.auth?.name}</h3>
              {/* <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p> */}
            </div>
          </div>

          <p className="mb-4 text-gray-700">{post.content}</p>

          {post.image && (
            <div className="relative w-full h-64 mb-4">
              <Image
                src={post.image}
                alt="Post image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )}

          <div className="flex justify-between items-center text-gray-500">
            <Button
              size="sm"
              onClick={() => handleUpvote(post._id)}
              className="flex items-center space-x-2"
            >
              <ThumbsUp size={18} />
              <span>{post.upvotes.length}</span>
            </Button>

            <Button
              size="sm"
              onClick={() => handleDownvote(post._id)}
              className="flex items-center space-x-2"
            >
              <ThumbsDown size={18} />
              <span>{post.downvotes.length}</span>
            </Button>

            <Button
              size="sm"
              onClick={() => handleCommentClick(post._id)}
              className="flex items-center space-x-2"
            >
              <MessageCircle size={18} />
              <span>{post.comments?.length}</span>
            </Button>
            
            
            <Button
              size="sm" className="flex items-center space-x-2">
              <Share2 size={18} />
              <span>{post.shares}</span>
            </Button>
          </div>
        </div>
      ))}

      {postIdForComment && (
        <CommentModal
          postId={postIdForComment}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          postsRefetch={refetch}
        />
      )}
    </div>
  );
};

export default Posts;
