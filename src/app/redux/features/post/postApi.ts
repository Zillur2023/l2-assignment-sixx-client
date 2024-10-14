
import { baseApi } from "../../api/baseApi";

export const postApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      createPost: builder.mutation({
        query: (postData) => ({
          url: '/post/create',
          method: 'POST',
          body: postData,
        }),
        invalidatesTags: ["Post"]
      }),
      getAllPost: builder.query({
        query: (id?: string) => ({
          url: id ? `/post/all-post/${id}` : '/post/all-post',
          method: 'GET',
        }),
        providesTags: ["Post"]
      }),
      updateUpvote: builder.mutation({
        query: (postData) => ({
          url: `/post/upvotes` ,
          method: 'PUT',
          body:postData
        }),
        invalidatesTags: ["Post"]
      }),
      updateDownvote: builder.mutation({
        query: (postData) => ({
          url: `/post/downvotes` ,
          method: 'PUT',
          body:postData
        }),
        invalidatesTags: ["Post"]
      }),
      
    }),
  });
  
  export const { useCreatePostMutation, useGetAllPostQuery, useUpdateUpvoteMutation, useUpdateDownvoteMutation } = postApi;