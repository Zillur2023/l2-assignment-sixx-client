/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import Image from 'next/image'; // Import Next.js image component for optimization
import { Button } from '@nextui-org/react'; // Import only NextUI Button
import { ThumbsUp, ThumbsDown , MessageCircle, Share2 } from 'lucide-react'; // Import Lucide-react icons
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useGetUserQuery } from '@/redux/features/user/userApi';
import { useUpdateDownvoteMutation, useUpdateUpvoteMutation } from '@/redux/features/post/postApi';
// import { RootState } from '../../../redux/store';
// import { useGetUserQuery } from '../../../redux/features/user/userApi';
// import { useAppSelector } from "../../../redux/hooks";
// import { useUpdateDownvoteMutation, useUpdateUpvoteMutation } from '../../../redux/features/post/postApi';


interface CommentPostProps {
  postsData:any; // New prop to trigger post data refetch
}

const CommentPost = ({ postsData }: CommentPostProps) => {
  console.log("{postsData} --commentPost",postsData)
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });

  // const { data: postsData, refetch } = useGetAllPostQuery('');

  const [updateUpvote] = useUpdateUpvoteMutation();
  const [updateDownvote] = useUpdateDownvoteMutation();


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

  return (
    <div className="mt-6">
      {postsData?.data?.map((post:any) => (
        <div key={post.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <p className="mb-4">{post.content}</p>

          {post.image && (
            <div className="relative w-full h-64 mb-4">
              <Image
                src={post.image}
                alt="Post"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )}

          <div className="flex justify-between text-gray-500">
            <Button size="sm" onClick={() => handleUpvote(post?._id)} className="flex items-center space-x-2">
              <ThumbsUp size={18} />
              <span>{post.upvotes.length}</span>
            </Button>
            <Button size="sm" onClick={() => handleDownvote(post?._id)} className="flex items-center space-x-2">
              <ThumbsDown size={18} />
              <span>{post.downvotes.length}</span>
            </Button>
            <Button size="sm" className="flex items-center space-x-2">
              <MessageCircle size={18} />
              <span>{post?.comments?.length}</span>
            </Button>
            <Button size="sm" className="flex items-center space-x-2">
              <Share2 size={18} />
              <span>{post.shares}</span>
            </Button>
          </div>
        </div>
      ))}

  
    </div>
  );
};

export default CommentPost


