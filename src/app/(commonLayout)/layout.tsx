import type { Metadata } from "next";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";


export const metadata: Metadata = {
  title: "Apollo Gears",
  description: "Next Level Riding Sharing Service",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar/>
      {children}
      <Footer/>
    </div>
  );
}