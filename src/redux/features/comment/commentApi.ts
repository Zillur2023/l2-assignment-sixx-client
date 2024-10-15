
import { baseApi } from "../../api/baseApi";


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      createComment: builder.mutation({
        query: (commentData) => ({
          url: '/comment/create',
          method: 'POST',
          body: commentData,
        }),
        invalidatesTags: ["Comment"]
      }),
      getAllComment: builder.query({
        query: (postId) => ({
          url: `/comment/all-comment/${postId}`,
          method: 'GET',
        }),
        providesTags: ["Comment"]
      }),
    }),
  });
  
  export const { useCreateCommentMutation, useGetAllCommentQuery } = authApi;