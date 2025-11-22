// import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
// import { Toaster } from "@/components/ui/sonner";
// import { ShoppingBag } from "lucide-react";
// import { ReactNode } from "react";


// type AuthLayoutProps = {
//   children: ReactNode;
// };

// export default function AuthLayouut({ children }: AuthLayoutProps) {
//   return (
//     <div className="relative bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
//       <div className="absolute top-4 right-4">
//         <DarkmodeToggle />
//       </div>
//       <div className="flex w-full max-w-sm flex-col gap-6">
//         <div className="flex items-center gap-2 self-center rounded-medium">
//           <div className=" flex items-center p-2 justify-center gap-2">
//             <ShoppingBag className="text-pink-500 " />
//           </div>
//           <h1>Arsee Wear</h1>
//         </div>
//         {children}
//         <Toaster />
//       </div>
//     </div>
//   );
// }


import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <DarkmodeToggle  />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
    </div>
  );
}