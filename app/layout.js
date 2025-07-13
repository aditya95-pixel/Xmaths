import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Xmaths",
  description: "AI Math solver",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <html lang="en">
          <body className={`${inter.className} antialiased`}>
            <Toaster toastOptions={{success:{style:{background:"white",color:"black"}},error: {style:{background:"white",color:"black"}}}}/>
            {children}
          </body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
