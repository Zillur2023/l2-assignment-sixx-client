'use client'

import { useGetUserQuery } from "@/redux/features/user/userApi";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Posts from "../post/Posts";

const CommonLayoutPage = () => {
    const router = useRouter();
    const { user } = useAppSelector((state: RootState) => state.auth);
  
    const { data: userData, isLoading } = useGetUserQuery(user?.email, { skip: !user?.email });
  
    useEffect(() => {
      // If not loading and userData is available
      if (!isLoading) {
        if (userData?.data?.role === "admin") {
          router.push("/admin/user-management");
        } else if (userData?.data?.role === "user") {
          router.push("/profile/news-feed");
        }
      }
    }, [userData, isLoading, router]);
  
    // Render <Posts /> if user is null (not logged in)
    if (user === null) {
      return <Posts />;
    }
  
    // Optionally show a loading state until the redirect logic executes
    return null;
  };
  
  export default CommonLayoutPage;