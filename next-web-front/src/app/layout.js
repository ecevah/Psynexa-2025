import { Urbanist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/providers";
import Aos from "@/services/aos";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

export const metadata = {
  title: "Psynexa",
  description: "Psynexa - Mental Health Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');
        </style>
      </head>
      <body className={`${urbanist.variable} antialiased`}>
        <Aos>
          <Providers>{children}</Providers>
        </Aos>
      </body>
    </html>
  );
}
