import type { Metadata } from "next";
import Footer from "./components/shared/Footer";
import NavBar from "./components/shared/NavBar";


export const metadata: Metadata = {
  title: "My App",
  description: "Social medial app",
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