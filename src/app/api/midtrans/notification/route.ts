import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📩 Midtrans Notification:", body);

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
      console.error("❌ Invalid signature");
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

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
    }

    // Update status order di database
    if (orderStatus) {
      const { data, error } = await supabase
        .from("orders")
        .update({
          status: orderStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("order_id", orderId)
        .select();

      if (error) {
        console.error("❌ Error updating order:", error);
        return NextResponse.json(
          { message: "Failed to update order", error: error.message },
          { status: 500 }
        );
      }

      console.log(`✅ Order ${orderId} updated to ${orderStatus}`, data);
    }

    return NextResponse.json({
      message: "OK",
      order_id: orderId,
      status: orderStatus,
    });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
