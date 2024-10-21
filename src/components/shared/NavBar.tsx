/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { usePathname, useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Spinner,
} from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { logoutFromRedux } from "@/redux/features/auth/authSlice";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import { getUser, logoutFromLocalStore } from "@/services/AuthSerivce";
import { useState } from "react";
import { toast } from "sonner";

export const adminRoutes = [
  { href: "/admin/user-management", label: "User management" },
  { href: "/admin/post-management", label: "Post management" },
  { href: "/admin/news-feed", label: "News feed" },
  { href: "/admin/about-us", label: "About us" },
  { href: "/admin/contact-us", label: "Contact us" },
];

export const userRoutes = [
  { href: "/profile/news-feed", label: "News feed" },
  { href: "/profile/about-us", label: "About us" },
  { href: "/profile/contact-us", label: "Contact us" },
];

export const publicRoutes = [
  {href: "/", label: "News Feed" },
  { href: "/register", label: "Register" },
  {href: "/login", label: "Login" },
];

// export default function  NavBar() {
const NavBar = () => {
  const router = useRouter()
  const { user } = useAppSelector((state: RootState) => state.auth);
  // const user = await getUser()
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });
  const routes = user === null ? publicRoutes : user?.role === "admin" ? adminRoutes : userRoutes;
  const dispatch = useAppDispatch()
  const pathname = usePathname(); // Get the current route's pathname
  const [isLoadingLogout, setIsLoadingLogout] = useState(false)
//   const user = { role: "admin" }; 
  // const user = undefined;

  const logout = async() => {
    dispatch(logoutFromRedux())
    await logoutFromLocalStore();
  }
  

  const handleLogout  = async() => {
   
    setIsLoadingLogout(true)
    try {
      // Force the cookie deletion and proceed only if successful
      logout()
      dispatch(logoutFromRedux());
      await logoutFromLocalStore();
      router.push("/")
      // Dispatch the Redux logout action
    } catch (error) {
      toast.error("Error logout try again");
      // Handle any potential errors during logout
    } finally {
      setIsLoadingLogout(false);
    }

  }

  return (
    <Navbar disableAnimation isBordered>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarBrand>
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {routes.map((route) => (
          <NavbarItem
            key={route.href}
            isActive={pathname === route.href} // Use pathname to check if the route is active
          >
            <Link href={route.href}>{route.label}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        {!user ? (
          <>
            {/* <NavbarItem isActive={pathname === "/login"}>
              <Link href="/login">Login</Link>
            </NavbarItem> */}
            <NavbarItem>
              <Button as="a" href="/login" color="primary" variant="flat">
                Login
              </Button>
            </NavbarItem>
          </>
        ) : (
            <Dropdown>
            <DropdownTrigger>
            <div className="flex gap-3 items-center">
      <Avatar src={userData?.data?.image} />
     
    </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="profile"><Link href="/profile">Profile</Link></DropdownItem>
           
              <DropdownItem  key="logout" className="text-danger" color="danger">
              { isLoadingLogout === true  ?
            <Spinner size="sm" /> :
            // <Link onClick={() =>handleLogout()} href="/" >Logout</Link>
            <div onClick={handleLogout}>Logout</div>
            }
              {/* <Link onClick={() =>handleLogout()} href="/" >Logout</Link> */}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
      <NavbarMenu>
      {routes.map((route) => (
            <NavbarMenuItem
              key={route.href}
              isActive={pathname === route.href} // Use pathname to check if the route is active
            >
              <Link href={route.href}>{route.label}</Link>
            </NavbarMenuItem>
          ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default NavBar;
