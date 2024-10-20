'use server'
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";


export const getUser = async() => {
  const accessToken = cookies().get("accessToken")?.value;

   let user = null;

  if(accessToken) {
    user = await jwtDecode(accessToken)
  }

  return await user
}

// export const logoutFromLocalStore = (): Promise<void> => {
//   return new Promise((resolve) => {
//     cookies().delete("accessToken");  // Perform the deletion
//     resolve();  // Immediately resolve the promise
//   });
// };

export const logoutFromLocalStore = async() => {
    cookies().delete("accessToken");
    // cookies().delete("refreshToken");
  };