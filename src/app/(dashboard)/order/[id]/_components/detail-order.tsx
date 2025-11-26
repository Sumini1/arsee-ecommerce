// "use client";

// import DataTable from "@/components/common/data-table";
// import { Button } from "@/components/ui/button";
// import { HEADER_TABLE_DETAIL_ORDER } from "@/constants/order-constant";
// import useDataTable from "@/hooks/use-data-table";
// import { cn, convertIDR } from "@/lib/utils";
// import { useQuery } from "@tanstack/react-query";
// import Image from "next/image";
// import Link from "next/link";
// import { startTransition, useActionState, useEffect, useMemo } from "react";
// import { toast } from "sonner";
// import Summary from "./summary";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { EllipsisVertical } from "lucide-react";
// import { updateStatusOrderitem } from "../../actions";
// import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
// import { useAuthStore } from "@/stores/auth-store";
// import { createClientSupabase } from "../../../../../lib/default";

// export default function DetailOrder({ id }: { id: string }) {
//   const supabase = createClientSupabase();
//   const { currentPage, currentLimit, handleChangePage, handleChangeLimit } =
//     useDataTable();

//   const profile = useAuthStore((state) => state.profile);

//   const { data: order } = useQuery({
//     queryKey: ["order", id],
//     queryFn: async () => {
//       const result = await supabase
//         .from("orders")
//         .select("id, customer_name, status, payment_token, tables (name, id)")
//         .eq("order_id", id)
//         .single();

//       if (result.error)
//         toast.error("Get Order data failed", {
//           description: result.error.message,
//         });

//       return result.data;
//     },
//     enabled: !!id,
//   });

//   useEffect(() => {
//     if (!order?.id) return;

//     const channel = supabase
//       .channel("change-order")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "orders_menus",
//           filter: `order_id=eq.${order?.id}`,
//         },
//         () => {
//           refetchOrderMenu();
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [order?.id]);

//   const {
//     data: orderMenu,
//     isLoading: isLoadingOrderMenu,
//     refetch: refetchOrderMenu,
//   } = useQuery({
//     queryKey: ["orders_menu", order?.id, currentPage, currentLimit],
//     queryFn: async () => {
//       const result = await supabase
//         .from("orders_menus")
//         .select("*, menus (id, name, image_url, price)", { count: "exact" })
//         .eq("order_id", order?.id)
//         .order("status");

//       if (result.error)
//         toast.error("Get order menu data failed", {
//           description: result.error.message,
//         });

//       return result;
//     },
//     enabled: !!order?.id,
//   });

//   const [updateStatusOrderState, updateStatusOrderAction] = useActionState(
//     updateStatusOrderitem,
//     INITIAL_STATE_ACTION
//   );

//   const handleUpdateStatusOrder = async (data: {
//     id: string;
//     status: string;
//   }) => {
//     const formData = new FormData();
//     Object.entries(data).forEach(([Key, value]) => {
//       formData.append(Key, value);
//     });

//     startTransition(() => {
//       updateStatusOrderAction(formData);
//     });
//   };

//   useEffect(() => {
//     if (updateStatusOrderState?.status === "error") {
//       toast.error("Update Status Order Failed", {
//         description: updateStatusOrderState.errors?._form?.[0],
//       });
//     }

//     if (updateStatusOrderState?.status === "success") {
//       toast.success("Update Status Order Success");
//       refetchOrderMenu();
//     }
//   }, [updateStatusOrderState]);

//   const filteredData = useMemo(() => {
//     return (orderMenu?.data || []).map((item, index) => {
//       return [
//         currentLimit * (currentPage - 1) + index + 1,
//         <div className="flex items-center gap-2">
//           <Image
//             src={item.menus.image_url}
//             alt={item.menus.name}
//             width={40}
//             height={40}
//             className="rounded"
//           />
//           <div className="flex flex-col">
//             {item.menus.name} x {item.quantity}
//             <span className="text-xs text-muted-foreground">
//               {item.notes || "No Notes"}
//             </span>
//           </div>
//         </div>,
//         <div>{convertIDR(item.menus.price * item.quantity)}</div>,
//         <div
//           className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
//             "bg-gray-500": item.status === "pending",
//             "bg-yellow-500": item.status === "process",
//             "bg-blue-500": item.status === "ready",
//             "bg-green-500": item.status === "served",
//           })}
//         >
//           {item.status}
//         </div>,
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               className={cn(
//                 "data-[state=open]:bg-muted text-muted-foreground flex size-8",
//                 { hidden: item.status === "served" }
//               )}
//               size="icon"
//             >
//               <EllipsisVertical />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-40">
//             {["pending", "process", "ready"].map((status, index) => {
//               const nextStatus = ["process", "ready", "served"][index];
//               return (
//                 item.status === status && (
//                   <DropdownMenuItem
//                     key={status}
//                     onClick={() =>
//                       handleUpdateStatusOrder({
//                         id: item.id,
//                         status: nextStatus,
//                       })
//                     }
//                     className="capitalize"
//                   >
//                     {nextStatus}
//                   </DropdownMenuItem>
//                 )
//               );
//             })}
//           </DropdownMenuContent>
//         </DropdownMenu>,
//       ];
//     });
//   }, [orderMenu?.data]);

//   const totalPages = useMemo(() => {
//     return orderMenu && orderMenu.count !== null
//       ? Math.ceil(orderMenu.count / currentLimit)
//       : 0;
//   }, [orderMenu]);

//   return (
//     <div className="w-full space-y-4">
//       <div className="flex items-center justify-between gap-4 w-full">
//         <h1 className="text-2xl font-bold">Detail Order</h1>
//         {profile.role !== "service" && (
//           <Link href={`/order/${id}/add`}>
//             <Button className="bg-pink-500 text-white">Add Order Item</Button>
//           </Link>
//         )}
//       </div>
//       <div className="flex flex-col lg:flex-row gap-4 w-full">
//         <div className="lg:w-2/3">
//           <DataTable
//             header={HEADER_TABLE_DETAIL_ORDER}
//             data={filteredData}
//             isLoading={isLoadingOrderMenu}
//             totalPages={totalPages}
//             currentPage={currentPage}
//             currentLimit={currentLimit}
//             onChangePage={handleChangePage}
//             onChangeLimit={handleChangeLimit}
//           />
//         </div>
//         <div className="lg:w-1/3">
//           {order && (
//             <Summary order={order} orderMenu={orderMenu?.data} id={id} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { HEADER_TABLE_DETAIL_ORDER } from "@/constants/order-constant";
import useDataTable from "@/hooks/use-data-table";
import { cn, convertIDR } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import Summary from "./summary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { updateStatusOrderitem } from "../../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { useAuthStore } from "@/stores/auth-store";
import { createClientSupabase } from "../../../../../lib/default";

export default function DetailOrder({ id }: { id: string }) {
  const supabase = createClientSupabase();
  const { currentPage, currentLimit, handleChangePage, handleChangeLimit } =
    useDataTable();

  const profile = useAuthStore((state) => state.profile);

  const { data: order, refetch: refetchOrder } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const result = await supabase
        .from("orders")
        .select("id, customer_name, status, payment_token, tables (name, id)")
        .eq("order_id", id)
        .single();

      if (result.error)
        toast.error("Get Order data failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!id,
  });

  // Realtime subscription untuk orders (status payment)
  useEffect(() => {
    if (!order?.id) return;

    const orderChannel = supabase
      .channel("order-status-change")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order?.id}`,
        },
        (payload) => {
          console.log("Order status changed:", payload);
          refetchOrder();
          
          // Show toast notification when status changes
          if (payload.new.status === "settled") {
            toast.success("Payment Confirmed!", {
              description: "Order has been settled successfully",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, [order?.id, supabase, refetchOrder]);

  // Realtime subscription untuk orders_menus
  useEffect(() => {
    if (!order?.id) return;

    const menuChannel = supabase
      .channel("change-order-menu")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders_menus",
          filter: `order_id=eq.${order?.id}`,
        },
        (payload) => {
          console.log("Order menu changed:", payload);
          refetchOrderMenu();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(menuChannel);
    };
  }, [order?.id, supabase]);

  const {
    data: orderMenu,
    isLoading: isLoadingOrderMenu,
    refetch: refetchOrderMenu,
  } = useQuery({
    queryKey: ["orders_menu", order?.id, currentPage, currentLimit],
    queryFn: async () => {
      const result = await supabase
        .from("orders_menus")
        .select("*, menus (id, name, image_url, price)", { count: "exact" })
        .eq("order_id", order?.id)
        .order("status");

      if (result.error)
        toast.error("Get order menu data failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!order?.id,
  });

  const [updateStatusOrderState, updateStatusOrderAction] = useActionState(
    updateStatusOrderitem,
    INITIAL_STATE_ACTION
  );

  const handleUpdateStatusOrder = async (data: {
    id: string;
    status: string;
  }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      updateStatusOrderAction(formData);
    });
  };

  useEffect(() => {
    if (updateStatusOrderState?.status === "error") {
      toast.error("Update Status Order Failed", {
        description: updateStatusOrderState.errors?._form?.[0],
      });
    }

    if (updateStatusOrderState?.status === "success") {
      toast.success("Update Status Order Success");
      refetchOrderMenu();
    }
  }, [updateStatusOrderState, refetchOrderMenu]);

  const filteredData = useMemo(() => {
    return (orderMenu?.data || []).map((item, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div key={item.id} className="flex items-center gap-2">
          <Image
            src={item.menus.image_url}
            alt={item.menus.name}
            width={40}
            height={40}
            className="rounded"
          />
          <div className="flex flex-col">
            {item.menus.name} x {item.quantity}
            <span className="text-xs text-muted-foreground">
              {item.notes || "No Notes"}
            </span>
          </div>
        </div>,
        <div key={`price-${item.id}`}>
          {convertIDR(item.menus.price * item.quantity)}
        </div>,
        <div
          key={`status-${item.id}`}
          className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
            "bg-gray-500": item.status === "pending",
            "bg-yellow-500": item.status === "process",
            "bg-blue-500": item.status === "ready",
            "bg-green-500": item.status === "served",
          })}
        >
          {item.status}
        </div>,
        <DropdownMenu key={`action-${item.id}`}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "data-[state=open]:bg-muted text-muted-foreground flex size-8",
                { hidden: item.status === "served" || order?.status === "settled" }
              )}
              size="icon"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {["pending", "process", "ready"].map((status, index) => {
              const nextStatus = ["process", "ready", "served"][index];
              return (
                item.status === status && (
                  <DropdownMenuItem
                    key={status}
                    onClick={() =>
                      handleUpdateStatusOrder({
                        id: item.id,
                        status: nextStatus,
                      })
                    }
                    className="capitalize"
                  >
                    Mark as {nextStatus}
                  </DropdownMenuItem>
                )
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>,
      ];
    });
  }, [orderMenu?.data, currentPage, currentLimit, order?.status]);

  const totalPages = useMemo(() => {
    return orderMenu && orderMenu.count !== null
      ? Math.ceil(orderMenu.count / currentLimit)
      : 0;
  }, [orderMenu, currentLimit]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4 w-full">
        <h1 className="text-2xl font-bold">Detail Order</h1>
        {profile.role !== "service" && order?.status !== "settled" && (
          <Link href={`/order/${id}/add`}>
            <Button className="bg-pink-500 text-white hover:bg-pink-600">
              Add Order Item
            </Button>
          </Link>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="lg:w-2/3">
          <DataTable
            header={HEADER_TABLE_DETAIL_ORDER}
            data={filteredData}
            isLoading={isLoadingOrderMenu}
            totalPages={totalPages}
            currentPage={currentPage}
            currentLimit={currentLimit}
            onChangePage={handleChangePage}
            onChangeLimit={handleChangeLimit}
          />
        </div>
        <div className="lg:w-1/3">
          {order && (
            <Summary
              order={order}
              orderMenu={orderMenu?.data}
              id={id}
              onStatusChange={refetchOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}