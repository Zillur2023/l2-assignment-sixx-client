'use server'
import { cookies } from "next/headers";


export const logoutFromLocalStore = () => {
    cookies().delete("accessToken");
    cookies().delete("refreshToken");
  };