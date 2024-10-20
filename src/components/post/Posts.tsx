/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Link, useDisclosure, User, Spinner, Tooltip, Select, SelectItem } from "@nextui-org/react"; // Import Spinner
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, VerifiedIcon, Trash2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useGetUserQuery, useUpdateFollowUnfollowMutation } from "@/redux/features/user/userApi";
import { useDeletePostMutation, useGetAllPostQuery, useIsAvailableForVeriedQuery, useUpdateDownvoteMutation, useUpdateUpvoteMutation } from "@/redux/features/post/postApi";
import CommentModal from "../comment/CommentModal";
import UpdatePost from "./UpdatePost";
import { toast } from "sonner";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { allCategoryName } from "./constant";

const Posts = () => {
  const router = useRouter()
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"highestUpvotes" | "lowestUpvotes" | "highestDownvotes" | "lowestDownvotes">("highestUpvotes");
  const { data: IsAvailableForVerified, refetch: IsAvailableForVerifiedRefetch } = useIsAvailableForVeriedQuery(userData?.data?._id, { skip: !userData?.data?._id });
  const { data: postsData, refetch: postsDataRefetch } = useGetAllPostQuery({searchTerm, category: category || undefined, sortBy});
  console.log("{postsData}" ,postsData?.data?.[0]?.upvotes?.name)
  console.log("{postsData}" ,postsData)
  const [updateUpvote] = useUpdateUpvoteMutation();
  const [updateDownvote] = useUpdateDownvoteMutation();
  const [updateFollowUnfollow] = useUpdateFollowUnfollowMutation();
  const [deletePost] = useDeletePostMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [postIdForComment, setPostIdForComment] = useState<string | null>(null);

  // Step 1: Create loading states
  const [loadingUpvote, setLoadingUpvote] = useState<string | null>(null);
  const [loadingDownvote, setLoadingDownvote] = useState<string | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<string | null>(null);

  const handleUpvote = async (postId: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return; // Prevent further execution
    }
    setLoadingUpvote(postId); // Set loading for this post
    const postData = { userId: userData?.data?._id, postId };
    try {
      await updateUpvote(postData).unwrap();
      IsAvailableForVerifiedRefetch();
    }catch(error:any) {
      if(error) {
        toast.error(error?.data?.message)
      }
    }
     finally {
      setLoadingUpvote(null); // Reset loading state
    }
  };

  const handleDownvote = async (postId: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return; // Prevent further execution
    }
    setLoadingDownvote(postId); // Set loading for this post
    const postData = { userId: userData?.data?._id, postId };
    try {
      await updateDownvote(postData).unwrap();
    }catch(error:any) {
      if(error) {
        toast.error(error?.data?.message)
      }
    } finally {
      setLoadingDownvote(null); // Reset loading state
    }
  };

  const handleUpdateFollowUnfollow = async (id: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return; // Prevent further execution
    }
    setLoadingFollow(id); // Set loading for this user
    try {
      const res = await updateFollowUnfollow({ targetId: id, loginUserId: userData?.data?._id }).unwrap();
      console.log(res);
    } finally {
      setLoadingFollow(null); // Reset loading state
    }
  };

  const handleDelete = async (postId: string) => {
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

  const handleDeleteClick = (postId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this post?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(postId),
    });
  };

  const handleCommentClick = (postId: string) => {
    if (!userData?.data?._id) {
      router.push("/login");
      return; // Prevent further execution
    }
    postsDataRefetch();
    setPostIdForComment(postId);
    onOpen();
  };

  useEffect(() => {
    postsDataRefetch();
  }, [category, searchTerm, sortBy]);

  return (
    <div className="mt-6 space-y-6 max-w-full sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] mx-auto">
      <input 
  type="text" 
  placeholder="Search..." 
  value={searchTerm} 
  onChange={(e) => setSearchTerm(e.target.value)} 
  className="border rounded p-2 mb-4"
/>
<select 
  value={sortBy} 
  onChange={(e) => setSortBy(e.target.value as "highestUpvotes" | "lowestUpvotes" | "highestDownvotes" | "lowestDownvotes")} 
  className="border rounded p-2 mb-4"
>
  <option value="">Sort</option>
  <option value="highestUpvotes">Highest Upvotes</option>
  <option value="lowestUpvotes">Lowest Upvotes</option>
  <option value="highestDownvotes">Highest Downvotes</option>
  <option value="lowestDownvotes">Lowest Downvotes</option>
</select>
<select 
        value={category || ''} 
        onChange={(e) => setCategory(e.target.value)} 
        className="border rounded p-2 mb-4"
      >
        <option value="">All Categories</option> 
        {allCategoryName.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
     
      {postsData?.data?.map((post: any) => (
        <div key={post._id} className="bg-white shadow-lg rounded-lg p-6">
          {/* Author Info */}
          <div className="flex items-center justify-between mb-4">
            <User
              name={
                <span className="flex items-center gap-3 text-lg font-semibold">
                  {post?.author?.name}{" "}
                  {post?.author?.isVerified && <VerifiedIcon className="w-5 h-5 text-blue-500 " />}
                </span>
              }
              description={
                <Link href="" size="sm" isExternal>
                  {post?.author?.email}
                </Link>
              }
              avatarProps={{
                src: `${post?.author?.image}`,
              }}
            />
            <div className="flex items-center gap-3">
              {post?.author?._id !== userData?.data?._id && (
                <Button
                  // className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded"
                  onClick={() => handleUpdateFollowUnfollow(post?.author?._id)}
                  disabled={loadingFollow === post?.author?._id} // Disable button if loading
                >
                  {loadingFollow === post?.author?._id ? (
                    <Spinner size="sm" /> // Show spinner when loading
                  ) : userData?.data?.following?.includes(post?.author?._id) ? "Unfollow" : "Follow"}
                </Button>
              )}
              {post?.author?._id === userData?.data?._id && <UpdatePost updatePostData={post} />}
              {post?.author?._id === userData?.data?._id && <Trash2 onClick={() => handleDeleteClick(post?._id)} className="text-red-500 cursor-pointer" />}
            </div>
          </div>

          {/* Post Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h2>

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
             <Tooltip content={<div className="whitespace-pre-wrap">{post?.upvotes.map((upvote: any) => upvote?.name).join('\n')}</div>} placement="bottom">
             {/* <Tooltip content={<div className="whitespace-pre-wrap">{post?.upvotes.name}</div>} placement="bottom"> */}
             <Button
                size="sm"
                onClick={() => handleUpvote(post._id)}
                className="flex items-center space-x-2"
                disabled={loadingUpvote === post._id} // Disable button if loading
              >
                {loadingUpvote === post._id ? (
                  <Spinner size="sm" /> // Show spinner when loading
                ) : (
                  <>
                    <ThumbsUp size={18} />
                    <span>{post.upvotes.length}</span>
                  </>
                )}
              </Button>
             </Tooltip>
             <Tooltip content={<div className="whitespace-pre-wrap">{post?.downvotes.map((downvote: any) => downvote?.name).join('\n')}</div>} placement="bottom">

              <Button
                size="sm"
                onClick={() => handleDownvote(post._id)}
                className="flex items-center space-x-2"
                disabled={loadingDownvote === post._id} // Disable button if loading
              >
                {loadingDownvote === post._id ? (
                  <Spinner size="sm" /> // Show spinner when loading
                ) : (
                  <>
                    <ThumbsDown size={18} />
                    <span>{post.downvotes.length}</span>
                  </>
                )}
              </Button>
               </Tooltip>
            </div>

            <div className="flex items-center space-x-3">

              <Button
                size="sm"
                onClick={() => handleCommentClick(post._id)}
                className="flex items-center space-x-2"
              >
                <MessageCircle size={18} />
                <span>{post.comments?.length}</span>
              </Button>
              <Button size="sm" className="flex items-center space-x-2">
                <Share2 size={18} />
                <span>{post.shares}</span>
              </Button>
            </div> 
          </div>
        </div>
      ))}
        {postIdForComment && (
        <CommentModal
          postId={postIdForComment}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          postsRefetch={postsDataRefetch}
        />
      )}  
</div>
  );
};

export default Posts;
