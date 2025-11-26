import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Received Midtrans notification:", body);

    // Inisialisasi Supabase dengan service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verifikasi signature dari Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;

    const hash = crypto
      .createHash("sha512")
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest("hex");

    if (hash !== body.signature_key) {
      console.error("Invalid signature");
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    // Cek status transaksi dari Midtrans
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    let orderStatus = "";

    // Mapping status Midtrans ke status order
    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        orderStatus = "settled";
      }
    } else if (transactionStatus === "settlement") {
      orderStatus = "settled";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      orderStatus = "canceled";
    } else if (transactionStatus === "pending") {
      orderStatus = "process"; // Tetap process jika masih pending
    }

    // Update status order di database jika ada perubahan status
    if (orderStatus && orderStatus !== "process") {
      // Fetch order untuk cek apakah ada
      const { data: existingOrder, error: fetchError } = await supabase
        .from("orders")
        .select("id, status, order_id")
        .eq("order_id", orderId)
        .single();

      if (fetchError) {
        console.error("❌ Error fetching order:", fetchError);
        return NextResponse.json(
          { message: "Order not found", error: fetchError.message },
          { status: 404 }
        );
      }

      console.log("📦 Found order:", existingOrder);

      // Update status order menggunakan order_id (text) bukan id (integer)
      const { data: updatedOrder, error: updateError } = await supabase
        .from("orders")
        .update({
          status: orderStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("order_id", orderId)
        .select();

      if (updateError) {
        console.error("❌ Error updating order:", updateError);
        return NextResponse.json(
          { message: "Failed to update order", error: updateError.message },
          { status: 500 }
        );
      }

      console.log(
        `✅ Order ${orderId} updated from "${existingOrder.status}" to "${orderStatus}"`,
        updatedOrder
      );
    }

    return NextResponse.json({
      message: "Notification processed successfully",
      order_id: orderId,
      status: orderStatus,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
