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
import { ThemeProvider } from "@/components/theme-provider";

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
        <html lang="en" suppressHydrationWarning>
          <body className={`${inter.className} antialiased`}>
            <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            >
            <Toaster toastOptions={{success:{style:{background:"white",color:"black"}},error: {style:{background:"white",color:"black"}}}}/>
            {children}
            </ThemeProvider>
          </body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
