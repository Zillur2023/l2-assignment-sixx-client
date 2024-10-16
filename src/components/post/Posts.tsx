/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Link, useDisclosure, User } from "@nextui-org/react";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, VerifiedIcon, Trash2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useGetUserQuery, useUpdateFollowUnfollowMutation } from "@/redux/features/user/userApi";
import { useDeletePostMutation, useGetAllPostQuery, useUpdateDownvoteMutation, useUpdateUpvoteMutation } from "@/redux/features/post/postApi";
import CommentModal from "../comment/CommentModal";
// import { IPost } from "../constant";
import UpdatePost from "./UpdatePost";
import { toast } from "sonner";
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
  const [updateFollowUnfollow] = useUpdateFollowUnfollowMutation()
  const [deletePost] = useDeletePostMutation()
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

  const  handleUpdateFollowUnfollow = async(id:string) => {
   const res =  await updateFollowUnfollow({targetId:id, loginUserId: userData?.data?._id}).unwrap()
   console.log(res)

  }

  const handleDeletePost = async(postId:string) => {
    const toastId = toast.loading("loading...")
     try {
      const res = await deletePost(postId).unwrap()

     if(res){
      toast.success(res?.message, {id: toastId})
     }
     } catch (error:any) {
       toast.error(error?.data?.message, {id: toastId})
     }
  }

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="mt-6  max-w-full sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] ">
      {postsData?.data?.map((post:any) => (
        <div key={post._id} className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
  {/* Author Info */}
  <User   
      name={(
        <span className="flex items-center gap-3"> {post?.author?.name} {post?.author?.isVerified && <VerifiedIcon className="w-5 h-5 text-blue-500 " />} </span>
      )}
      description={(
        // <Link href="https://twitter.com/jrgarciadev" size="sm" isExternal>
        <Link href="" size="sm" isExternal>
          {post?.author?.email}
        </Link>
      )}
      avatarProps={{
        // src: "https://avatars.githubusercontent.com/u/30373425?v=4"
        src: `${post?.author?.image}`
      }}
    />
  {/* Follow/Unfollow Button */}
  <div>
 <div className="flex gap-2">
   {/* Only show the button if the logged-in user is not the post author */}
   {post?.author?._id !== userData?.data?._id && (
    <button
      className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-3 rounded"
      onClick={() => handleUpdateFollowUnfollow(post?.author?._id)}
    >
      {/* Check if the logged-in user is following the post's author */}
      {userData?.data?.following?.includes(post?.author?._id) ? 'Unfollow' : 'Follow'}
    </button>
  )}
  <UpdatePost updatePostData={post} />
  <Trash2 onClick={() => handleDeletePost(post?._id)} />
 </div>
</div>
</div>
<p className="mb-4 text-gray-700">{post.title}</p>
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
