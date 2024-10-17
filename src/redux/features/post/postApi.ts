import { baseApi } from "../../api/baseApi";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (postData) => ({
        url: "/post/create",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),
    getAllPost: builder.query({
      query: ({ postId, userId }: { postId?: string; userId?: string }) => {
        let url = '/post/all-post'; // Base URL
        if (postId) {
          // If postId is provided, append it to the URL
          url += `/${postId}`;
        } else if (userId) {
          // If userId is provided, append it to the URL
          url += `/userId/${userId}`;
        }
    
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Post"],
    }),
    updateUpvote: builder.mutation({
      query: (postData) => ({
        url: `/post/upvotes`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),
    updateDownvote: builder.mutation({
      query: (postData) => ({
        url: `/post/downvotes`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation({
      query: (postData) => ({
        url: `/post/update`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/post/delete/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    isAvailableForVeried: builder.query({
      query: (id) => ({
        url: `/post/isAvailable-verified/${id}`,
        method: "GET",
      }),
      providesTags: ["Post"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetAllPostQuery,
  useUpdateUpvoteMutation,
  useUpdateDownvoteMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useIsAvailableForVeriedQuery
} = postApi;
