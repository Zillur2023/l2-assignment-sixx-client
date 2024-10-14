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
} from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { RootState } from "@/app/redux/store";
import { logout } from "@/app/redux/features/auth/authSlice";

export const adminRoutes = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Home", path: "/" },
  { name: "Post", path: "/post" },
];

export const userRoutes = [
  { name: "Home", path: "/" },
  { name: "Post", path: "/post" },
];

export const publicRoutes = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "Register", path: "/register" },
  { name: "Login", path: "/login" },
];



export default function NavBar() {
  const { user } = useAppSelector((state: RootState) => state.auth);
  console.log('navbarUser',user)
  const routes = !user ? publicRoutes : user?.role === "admin" ? adminRoutes : userRoutes;
  const dispatch = useAppDispatch()
  const pathname = usePathname(); // Get the current route's pathname
//   const user = { role: "admin" }; 
  // const user = undefined;



  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {routes.map((route) => (
          <NavbarItem
            key={route.path}
            isActive={pathname === route.path} // Use pathname to check if the route is active
          >
            <Link href={route.path}>{route.name}</Link>
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
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
     
    </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="profile"><Link href="/profile">Profile</Link></DropdownItem>
              <DropdownItem  key="logout" className="text-danger" color="danger">
              <Link onClick={() => dispatch(logout())} href="/">Logout</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </Navbar>
  );
}
