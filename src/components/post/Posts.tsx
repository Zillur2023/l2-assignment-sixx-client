/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Image from "next/image";
import { Button, Tooltip } from "@nextui-org/react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  VerifiedIcon,
  Trash2,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  useGetUserQuery,
  useUpdateFollowUnfollowMutation,
} from "@/redux/features/user/userApi";
import {
  useDeletePostMutation,
  useGetAllPostQuery,
  useUpdateDownvoteMutation,
  useUpdateUpvoteMutation,
} from "@/redux/features/post/postApi";
import CommentModal from "../comment/CommentModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { allCategoryName } from "./constant";
import Author from "../shared/Author";
import PostUpdate from "./PostUpdate";
import CustomModal from "../modal/CustomModal";
import LoadingButton from "../shared/LoadingButton";

interface PostsProps {
  postId?: string;
  commentModal?: boolean;
}

const Posts: React.FC<PostsProps> = ({ postId, commentModal = true }) => {
  const router = useRouter();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, {
    skip: !user?.email,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "highestUpvotes" | "lowestUpvotes" | "highestDownvotes" | "lowestDownvotes"
  >("highestUpvotes");
  const queryPost = postId
    ? { postId }
    : {
        searchTerm,
        category: category || undefined,
        sortBy,
      };
  const { data: postsData } = useGetAllPostQuery(queryPost);
  const [updateUpvote] = useUpdateUpvoteMutation();
  const [updateDownvote] = useUpdateDownvoteMutation();
  const [updateFollowUnfollow] = useUpdateFollowUnfollowMutation();
  const [deletePost] = useDeletePostMutation();

  const handleUpvote = async (postId: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }
    const postData = { userId: userData?.data?._id, postId };
    try {
      await updateUpvote(postData).unwrap();
    } catch (error: any) {
      if (error) {
        toast.error(error?.data?.message);
      }
    } finally {
    }
  };

  const handleDownvote = async (postId: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }
    const postData = { userId: userData?.data?._id, postId };
    try {
      await updateDownvote(postData).unwrap();
    } catch (error: any) {
      if (error) {
        toast.error(error?.data?.message);
      }
    } finally {
    }
  };

  const handleUpdateFollowUnfollow = async (id: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return;
    }
    try {
      const res = await updateFollowUnfollow({
        targetId: id,
        loginUserId: userData?.data?._id,
      }).unwrap();
    } finally {
    }
  };

  const handleDeleteClick = async (postId: string) => {
    const toastId = toast.loading("loading...");
    try {
      const res = await deletePost(postId).unwrap();
      if (res) {
        toast.success(res?.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  return (
    <div className="mt-6 space-y-6 max-w-full sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] mx-auto">
      {!postId && (
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 mb-4"
          />
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | "highestUpvotes"
                  | "lowestUpvotes"
                  | "highestDownvotes"
                  | "lowestDownvotes"
              )
            }
            className="border rounded p-2 mb-4"
          >
            <option value="">Sort</option>
            <option value="highestUpvotes">Highest Upvotes</option>
            <option value="lowestUpvotes">Lowest Upvotes</option>
            <option value="highestDownvotes">Highest Downvotes</option>
            <option value="lowestDownvotes">Lowest Downvotes</option>
          </select>
          <select
            value={category || ""}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded p-2 mb-4"
          >
            <option value="">All Categories</option>
            {allCategoryName.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {postsData?.data?.map((post: any) => (
        <div key={post._id} className="bg-white shadow-lg rounded-lg p-6">
          {/* Author Info */}
          <div className="flex items-center justify-between mb-4">
            <Author author={post?.author} nameClass="text-lg font-semibold" />
            <div className="flex items-center gap-3">
              {post?.author?._id !== userData?.data?._id && (
                <LoadingButton
                  onClick={() => handleUpdateFollowUnfollow(post?.author?._id)}
                  buttonId="followOrUnfollow"
                >
                  {userData?.data?.following?.includes(post?.author?._id)
                    ? "Unfollow"
                    : "Follow"}
                </LoadingButton>
              )}
              {post?.author?._id === userData?.data?._id && (
                <PostUpdate updatePostData={post} />
              )}
              {post?.author?._id === userData?.data?._id && (
                <CustomModal
                  title=""
                  openButton={
                    <Trash2 className="text-red-500 cursor-pointer" />
                  }
                  actionButtonText="Delete"
                  onUpdate={() => handleDeleteClick(post?._id)}
                >
                  <Author
                    author={post?.author}
                    nameClass="text-lg font-semibold"
                  />
                  <p className=" text-center ">
                    <strong>Category:</strong> {post?.category}
                  </p>
                  <p className=" text-center ">
                    <strong>Title:</strong> {post?.title} .
                  </p>
                </CustomModal>
              )}
            </div>
          </div>

          {/* Post Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {post.title}
          </h2>

          {/* Post Image */}
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

          {/* Post Content */}
          <p className="mb-6 text-gray-700">{post.content}</p>

          {/* Post Interactions */}
          <div className="flex justify-between items-center text-gray-500">
            <div className="flex items-center space-x-3">
              {/* <Tooltip content={post?.upvotes?.[index+1]?.name}> */}
              <Tooltip
                content={
                  <div className="whitespace-pre-wrap">
                    {post?.upvotes
                      .map((upvote: any) => upvote?.name)
                      .join("\n")}
                  </div>
                }
                placement="bottom"
              >
                <LoadingButton
                  onClick={() => handleUpvote(post._id)}
                  buttonId="upvote"
                >
                  <ThumbsUp size={18} />
                  <span>{post.upvotes.length}</span>
                </LoadingButton>
              </Tooltip>
              <Tooltip
                content={
                  <div className="whitespace-pre-wrap">
                    {post?.downvotes
                      .map((downvote: any) => downvote?.name)
                      .join("\n")}
                  </div>
                }
                placement="bottom"
              >
                <LoadingButton
                  onClick={() => handleDownvote(post._id)}
                  buttonId="downvote"
                >
                  <ThumbsDown size={18} />
                  <span>{post.downvotes.length}</span>
                </LoadingButton>
              </Tooltip>
            </div>

            <div className="flex items-center space-x-3">
              {commentModal ? (
                <CommentModal
                  postId={post?._id}
                  openButton={
                    <button className="flex items-center space-x-2 hover:bg-gray-300 py-1 px-2 rounded-md">
                      <MessageCircle size={18} />
                      <span>{post.comments?.length}</span>
                    </button>
                  }
                />
              ) : (
                <button className="flex items-center space-x-2 hover:bg-gray-300 py-1 px-2 rounded-md">
                  <MessageCircle size={18} />
                  <span>{post.comments?.length}</span>
                </button>
              )}
              <Button
                size="sm"
                className="flex items-center space-x-2 bg-transparent hover:bg-gray-300 "
              >
                <Share2 size={18} />
                <span>{post.shares}</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
