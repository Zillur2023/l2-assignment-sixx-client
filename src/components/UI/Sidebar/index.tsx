"use client";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import Image from "next/image";
import { SidebarOptions } from "./SidebarOptions";
import { adminLinks, userLinks } from "./constant";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import CreatePost from "@/components/post/CreatePost";
import UpdateProfile from "@/components/profile/UpdateProfile";

// import { SidebarOptions } from "./SidebarOptions";
// import { adminLinks, userLinks } from "./constants";

// import { useUser } from "@/src/context/user.provider";

const Sidebar = () => {
  // const { user } = useUser();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, {
    skip: !user?.email,
  });

  return (
    <div>
      <div className="rounded-xl bg-default-100 p-2">
        <div className="h-[330px] w-full rounded-md">
          <Image
            alt="profile"
            className="w-full h-full object-cover rounded-md"
            height={330}
            src={userData?.data?.image as string}
            width={330}
          />
        </div>
        <div className="my-3">
          <h1 className="text-2xl font-semibold">{userData?.data?.name}</h1>
          <p className="break-words text-sm">{userData?.data?.email}</p>
          <p className="break-words text-sm">{userData?.data?.bio}</p>
        </div>
        {/* <Button
          as={Link}
          className="mt-2 w-full rounded-md"
          href={"/profile/create-post"}
        >
          Create a post
        </Button> */}
        <div> <CreatePost/> </div>
        <div className=" my-3"> <UpdateProfile/> </div>
       
        
      </div>
      <div className="mt-3 space-y-2 rounded-xl bg-default-100 p-2">
        <SidebarOptions
          links={user?.role === "user" ? userLinks : adminLinks}
        />
      </div>
    </div>
  );
};

export default Sidebar;