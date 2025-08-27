import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const docs = await prisma.doctor.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      branch: { select: { name: true, city: true } },
    },
    orderBy: [{ specialization: "asc" }],
    take: 200,
  });
  return NextResponse.json(docs);
}
