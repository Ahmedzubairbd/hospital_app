import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const branches = await prisma.branch.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(branches);
}
