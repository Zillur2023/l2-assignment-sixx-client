"use client"
import { usePathname } from "next/navigation";
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
} from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { logoutFromRedux } from "@/redux/features/auth/authSlice";
import { useGetUserQuery } from "@/redux/features/user/userApi";
import { logoutFromLocalStore } from "@/services/AuthSerivce";
// import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
// import { RootState } from "@/app/redux/store";
// import { logout } from "@/app/redux/features/auth/authSlice";
// { href: "/profile", label: "Profile" },

export const adminRoutes = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Home", href: "/" },
  { label: "Post", href: "/post" },
];

export const userRoutes = [
  { label: "profile", href: "/profile" },
];

export const publicRoutes = [
  { label: "Home", href: "/" },
  { label: "Posts", href: "/posts" },
  { label: "Features", href: "/features" },
  { label: "Register", href: "/register" },
  { label: "Login", href: "/login" },
];

export default function NavBar() {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: userData } = useGetUserQuery(user?.email, { skip: !user?.email });
  console.log('navbarUser',user)
  const routes = !user ? publicRoutes : user?.role === "admin" ? adminRoutes : userRoutes;
  const dispatch = useAppDispatch()
  const pathname = usePathname(); // Get the current route's pathname
//   const user = { role: "admin" }; 
  // const user = undefined;

  const handleLogout  = () => {
    dispatch(logoutFromRedux())
    logoutFromLocalStore()
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
              <Link onClick={() =>handleLogout()} href="/" >Logout</Link>
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
