import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <ToastContainer position="bottom-right"/>
        </AuthProvider>
      </body>
    </html>
  );
}
