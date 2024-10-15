/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, useDisclosure } from "@nextui-org/react";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import { useGetAllPostQuery, useUpdateDownvoteMutation, useUpdateUpvoteMutation } from "@/redux/features/post/postApi";
import CommentModal from "../comment/CommentModal";
// import CommentModal from "../comment/CommentModal";
// import { RootState } from "../../../redux/store";
// import { useGetUserQuery } from "../../../redux/features/user/userApi";
// import { useAppSelector } from "../../../redux/hooks";


const Posts = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });
  console.log("{userData}",userData?.data?._id)
  const { data: postsData, refetch } = useGetAllPostQuery("");
  console.log({postsData})
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
    <div className="mt-6  max-w-full sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] ">
      {postsData?.data?.map((post:any) => (
        <div key={post._id} className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
  {/* Author Info */}
  <div className="flex items-center">
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
      <h3 className="font-semibold text-sm flex items-center">
        {post?.author?.name}
        {post?.author?.isVerified && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="blue"
            className="w-4 h-4 ml-1"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm4.707 8.707-5.5 5.5a1 1 0 0 1-1.414 0l-2.5-2.5a1 1 0 0 1 1.414-1.414l2.086 2.086 4.793-4.793a1 1 0 1 1 1.414 1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </h3>
      {/* Optionally, you can uncomment and format the date */}
      {/* <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p> */}
    </div>
  </div>

  {/* Follow/Unfollow Button */}
  <div>
    {post?.author?.isFollowed ? (
      <button
        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-3 rounded"
        // onClick={() => handleUnfollow(post?.author?.id)}
      >
        Unfollow
      </button>
    ) : (
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded"
        // onClick={() => handleFollow(post?.author?.id)}
      >
        Follow
      </button>
    )}
  </div>
</div>
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
          <p className="mb-4 text-gray-700">{post.content}</p>
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
