
import Header from "@/components/web/header ";
import "../globals.css";



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
      </div>
    </div>
  );
}
