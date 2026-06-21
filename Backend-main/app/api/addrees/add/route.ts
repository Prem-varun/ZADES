import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/generated/prisma";

const client = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await auth();
  const data = await request.json();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await client.user.findUnique({
    where: { email: session.user.email },
    include: {
      customer: true
    }
  });

  if (!user?.customer?.id) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const newAddress = await client.address.create({
    data: {
      cid: user.customer.id,
      name:data.address.name,
      address: data.address.address,
      pincode: data.address.pincode,
      city: data.address.city,
      state: data.address.state,
    },
  });

  return NextResponse.json({ success: true, address: newAddress });
}
