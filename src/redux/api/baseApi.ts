import {
  fetchBaseQuery,
  createApi,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
// import { RootState } from "../store";
// import config from "../../config";

const baseQuery = fetchBaseQuery({
  // baseUrl: `${config.server_url}/api`,
  baseUrl: `http://localhost:5000/api/v1`,
  // baseUrl: `https://l2-assignment-six-server.vercel.app/api/v1`,
  
  
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    console.log({token})
    
    if (token) {
      headers.set("authorization", `${token}`);
    }
    
    return headers;
  },
});


// const baseQueryWithRefreshToken: BaseQueryFn<
//   FetchArgs,
//   BaseQueryApi,
//   DefinitionType
// > = async (args, api, extraOptions): Promise<any> => {
//   let result:any = await baseQuery(args, api, extraOptions);

//   // if (result?.error?.data?.err?.statusCode === 401) {
//   // if (result?.error?.status === 404) {
//   //   toast.error('User not found')
//   // }
//   // if (result?.error?.status === 403) {
//   //   toast.error('Password not match')
//   // }

//   if (result?.error?.status === 401) {
//     //* Send Refresh

//     const res = await fetch(`${config.server_url}/api/auth/refresh-token`, {
//       method: "POST",
//       credentials: "include",
//     });

//     const data = await res.json();

//     if (data?.data?.accessToken) {
//       const user = (api.getState() as RootState).auth.user;

//       api.dispatch(
//         setUser({
//           user,
//           token: data.data.accessToken,
//         })
//       );

//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       api.dispatch(logout());
//     }
//   }

//   return result;
// };

export const baseApi = createApi({
  reducerPath: "baseApi",
  // tagTypes: ["User","Service", "Slot","Booking","Review"],
  tagTypes: ["User", "Post", "Comment"],
  // baseQuery: baseQueryWithRefreshToken,
  baseQuery,
  endpoints: () => ({}),
});
