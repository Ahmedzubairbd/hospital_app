import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = String(
    ((session?.user as any)?.role as string | undefined) || "",
  ).toLowerCase();
  if (role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const totalPatients = await prisma.patient.count();
    const totalDoctors = await prisma.doctor.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const appointmentsToday = await prisma.appointment.count({
      where: {
        scheduledAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: {
          select: {
            department: true,
          },
        },
      },
      take: 200,
      orderBy: {
        scheduledAt: "desc",
      },
    });

    const appointmentsByDept = appointments.reduce(
      (acc, appointment) => {
        const dept = appointment.doctor.department || "Unknown";
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        scheduledAt: {
          gte: new Date(),
        },
      },
      include: {
        patient: {
          include: {
            user: { select: { name: true } },
          },
        },
        doctor: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 5,
    });

    const doctors = await prisma.doctor.findMany({
      include: {
        user: { select: { name: true } },
        _count: {
          select: { appointments: true },
        },
      },
      take: 5,
      orderBy: {
        appointments: {
          _count: "desc",
        },
      },
    });

    return NextResponse.json({
      totalPatients,
      totalDoctors,
      appointmentsToday,
      appointmentsByDept: Object.entries(appointmentsByDept).map(
        ([name, value]) => ({ name, appointments: value }),
      ),
      appointmentsByStatus: appointmentsByStatus.map((item) => ({
        name: item.status,
        value: item._count.status,
      })),
      upcomingAppointments,
      topDoctors: doctors,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
