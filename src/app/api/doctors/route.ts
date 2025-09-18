import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

type LocaleText = { en: string; bn: string };

const localeTextSchema = z.object({
  en: z.string(),
  bn: z.string().optional().nullable(),
});

const directoryProfileSchema = z.object({
  name: localeTextSchema,
  department: localeTextSchema,
  specialization: localeTextSchema,
  visitingHours: localeTextSchema.optional().nullable(),
  description: localeTextSchema.optional().nullable(),
  qualifications: z.array(localeTextSchema).optional(),
  workplaces: z.array(localeTextSchema).optional(),
  focusAreas: z.array(localeTextSchema).optional(),
  image: z.string().optional().nullable(),
});

type DirectoryProfileInput = z.infer<typeof directoryProfileSchema>;

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  password: z.string().min(8),
  specialization: z.string().min(1),
  department: z.string().min(1),
  bio: z.string().optional().nullable(),
  schedule: z.string().optional().nullable(),
  sliderPictureUrl: z.string().optional().nullable(),
  branchId: z.string().optional().nullable(),
  visitingHours: z.string().optional().nullable(),
  keywords: z.array(z.string()).optional(),
  availableFrom: z.string().optional().nullable(),
  availableTo: z.string().optional().nullable(),
  weekdays: z.string().optional().nullable(),
  directoryProfile: directoryProfileSchema.optional(),
});

function trimOrNull(value?: string | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function trimOrUndefined(value?: string | null): string | undefined {
  const trimmed = trimOrNull(value);
  return trimmed === null ? undefined : trimmed;
}

function normalizeId(value?: string | null): string | null {
  const trimmed = trimOrNull(value);
  return trimmed ?? null;
}

function normalizeLocaleText(
  value?: z.infer<typeof localeTextSchema> | null,
  fallback?: string | null,
): LocaleText | undefined {
  const fallbackTrimmed = fallback?.trim() ?? "";
  let en = (value?.en ?? "").trim();
  let bn = (value?.bn ?? "").trim();

  if (!en && fallbackTrimmed) {
    en = fallbackTrimmed;
  }
  if (!bn && fallbackTrimmed) {
    bn = fallbackTrimmed;
  }
  if (!en && bn) {
    en = bn;
  }
  if (!bn && en) {
    bn = en;
  }

  if (!en && !bn) {
    return fallbackTrimmed
      ? { en: fallbackTrimmed, bn: fallbackTrimmed }
      : undefined;
  }

  return { en, bn };
}

function normalizeLocaleArray(values?: z.infer<typeof localeTextSchema>[]): LocaleText[] {
  if (!values) return [];
  const normalized: LocaleText[] = [];
  values.forEach((value) => {
    const locale = normalizeLocaleText(value);
    if (locale) normalized.push(locale);
  });
  return normalized;
}

function sanitizeKeywords(values?: string[]): string[] {
  if (!values) return [];
  const seen = new Set<string>();
  const keywords: string[] = [];
  values.forEach((value) => {
    const trimmed = value.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      keywords.push(trimmed);
    }
  });
  return keywords;
}

type DirectoryProfile = {
  name?: LocaleText;
  department?: LocaleText;
  specialization?: LocaleText;
  visitingHours?: LocaleText | null;
  description?: LocaleText | null;
  qualifications?: LocaleText[];
  workplaces?: LocaleText[];
  focusAreas?: LocaleText[];
  image?: string | null;
};

function normalizeDirectoryProfile(
  input: DirectoryProfileInput | undefined,
  fallback: {
    name: string | null | undefined;
    department: string | null | undefined;
    specialization: string | null | undefined;
    visitingHours: string | null | undefined;
    image: string | null | undefined;
  },
): DirectoryProfile | undefined {
  const profileInput = input ?? ({} as DirectoryProfileInput);
  const profile: DirectoryProfile = {};

  const name = normalizeLocaleText(profileInput.name, fallback.name ?? undefined);
  if (name) profile.name = name;

  const department = normalizeLocaleText(
    profileInput.department,
    fallback.department ?? undefined,
  );
  if (department) profile.department = department;

  const specialization = normalizeLocaleText(
    profileInput.specialization,
    fallback.specialization ?? undefined,
  );
  if (specialization) profile.specialization = specialization;

  if (profileInput.visitingHours !== undefined) {
    if (profileInput.visitingHours === null) {
      profile.visitingHours = null;
    } else {
      const visitingHours = normalizeLocaleText(
        profileInput.visitingHours,
        fallback.visitingHours ?? undefined,
      );
      if (visitingHours) profile.visitingHours = visitingHours;
    }
  }

  if (profileInput.description !== undefined) {
    if (profileInput.description === null) {
      profile.description = null;
    } else {
      const description = normalizeLocaleText(profileInput.description);
      if (description) profile.description = description;
    }
  }

  if (profileInput.qualifications !== undefined) {
    const qualifications = normalizeLocaleArray(profileInput.qualifications);
    profile.qualifications = qualifications;
  }

  if (profileInput.workplaces !== undefined) {
    const workplaces = normalizeLocaleArray(profileInput.workplaces);
    profile.workplaces = workplaces;
  }

  if (profileInput.focusAreas !== undefined) {
    const focusAreas = normalizeLocaleArray(profileInput.focusAreas);
    profile.focusAreas = focusAreas;
  }

  if (profileInput.image !== undefined) {
    profile.image = trimOrNull(profileInput.image);
  } else if (fallback.image) {
    profile.image = trimOrNull(fallback.image);
  }

  return Object.keys(profile).length > 0 ? profile : undefined;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const role = String(session?.user?.role || "").toLowerCase();

  if (role !== "admin" && role !== "moderator") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const doctors = await prisma.doctor.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      branch: { select: { name: true, city: true } },
    },
    orderBy: { user: { name: "asc" } },
  });

  return NextResponse.json(doctors);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = String(session?.user?.role || "").toLowerCase();

  if (role !== "admin" && role !== "moderator") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const input = createSchema.parse(body);

    const email = trimOrNull(input.email);
    if (email) {
      const existing = await prisma.user.findUnique({
        where: { email },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 },
        );
      }
    }

    const phone = trimOrNull(input.phone);
    const specialization = input.specialization.trim();
    const department = input.department.trim();
    const schedule = trimOrNull(input.schedule);
    const bio = trimOrNull(input.bio);
    const sliderPictureUrl = trimOrNull(input.sliderPictureUrl);
    const visitingHours = trimOrNull(input.visitingHours);
    const branchId = normalizeId(input.branchId);
    const keywords = sanitizeKeywords(input.keywords);
    const availableFrom = trimOrNull(input.availableFrom);
    const availableTo = trimOrNull(input.availableTo);
    const weekdays = trimOrNull(input.weekdays);

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email: email ?? undefined,
        phone: phone ?? undefined,
        passwordHash,
        role: "DOCTOR",
      },
    });

    const directoryProfile = normalizeDirectoryProfile(input.directoryProfile, {
      name: user.name,
      department,
      specialization,
      visitingHours,
      image: sliderPictureUrl,
    });

    const doctorData: Prisma.DoctorUncheckedCreateInput = {
      userId: user.id,
      specialization,
      department,
      bio,
      schedule,
      sliderPictureUrl,
      branchId,
      visitingHours,
      keywords,
      availableFrom,
      availableTo,
      weekdays,
    };

    if (directoryProfile !== undefined) {
      doctorData.directoryProfile = directoryProfile as Prisma.InputJsonValue;
    }

    const doctor = await prisma.doctor.create({
      data: doctorData,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        branch: { select: { name: true, city: true } },
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
