import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/generated/prisma";
export async function GET(){
    const session = await auth();
    const client = new PrismaClient();
    if(session?.user?.email)
    {
        const l=await client.address.findMany({
            where:{
                customer:{
                    user:{
                        email:session.user.email
                    }
                }
            }
        });
        return NextResponse.json({"data":l})
    }
    console.log(session);
    return NextResponse.json({"success":400})
}