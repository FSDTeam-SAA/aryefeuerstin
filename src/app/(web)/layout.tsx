
import Header from "@/components/web/header ";
import "../globals.css";
import Footer from "@/components/web/footer";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div>
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}
