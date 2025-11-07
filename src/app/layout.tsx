
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider } from "@/providers/theme-provider";
// import AuthStoreProvider from "@/providers/auth-store-provider";
// import { cookies } from "next/headers";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });



// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {

//   const cookiesStore = await cookies();
//   const profile = JSON.parse(
//     cookiesStore.get("user_profile")?.value || "{}"
//   )
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <AuthStoreProvider profile={profile}>
//           <ThemeProvider
//             attribute={"class"}
//             defaultTheme="system"
//             enableSystem
//             disableTransitionOnChange
//           >
//             {children}
//           </ThemeProvider>
//         </AuthStoreProvider>
//       </body>
//     </html>
//   );
// }

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import AuthStoreProvider from "@/providers/auth-store-provider";
import { cookies } from "next/headers";
import ReactQueryProvider from "@/providers/react-query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  // ✅ Safe parse cookie agar tidak error jika kosong / encoded
  let profile = {};
  try {
    const raw = cookieStore.get("user_profile")?.value;
    if (raw) {
      profile = JSON.parse(decodeURIComponent(raw)); // penting!
    }
  } catch (error) {
    console.error("❌ Failed to parse user_profile cookie:", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ pastikan AuthStoreProvider selalu dapat data yang valid */}
        <ReactQueryProvider>
          <AuthStoreProvider profile={profile as any}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthStoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
