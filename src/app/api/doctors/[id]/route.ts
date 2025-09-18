import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/db";

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

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  specialization: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const role = String(session?.user?.role || "").toLowerCase();
  if (role !== "admin" && role !== "moderator") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const input = patchSchema.parse(body);
    const { id } = await params;

    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        branch: { select: { name: true, city: true } },
      },
    });

    if (!existingDoctor) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const email = trimOrNull(input.email);
    if (input.email !== undefined && email && email !== existingDoctor.user.email) {
      const emailOwner = await prisma.user.findUnique({
        where: { email },
      });
      if (emailOwner && emailOwner.id !== existingDoctor.userId) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 },
        );
      }
    }

    const phone = trimOrNull(input.phone);
    const specialization = input.specialization?.trim();
    const department = input.department?.trim();
    const schedule = input.schedule !== undefined ? trimOrNull(input.schedule) : undefined;
    const bio = input.bio !== undefined ? trimOrNull(input.bio) : undefined;
    const sliderPictureUrl =
      input.sliderPictureUrl !== undefined
        ? trimOrNull(input.sliderPictureUrl)
        : undefined;
    const branchId = input.branchId !== undefined ? normalizeId(input.branchId) : undefined;
    const visitingHours =
      input.visitingHours !== undefined ? trimOrNull(input.visitingHours) : undefined;
    const keywords =
      input.keywords !== undefined ? sanitizeKeywords(input.keywords) : undefined;
    const availableFrom =
      input.availableFrom !== undefined ? trimOrNull(input.availableFrom) : undefined;
    const availableTo =
      input.availableTo !== undefined ? trimOrNull(input.availableTo) : undefined;
    const weekdays = input.weekdays !== undefined ? trimOrNull(input.weekdays) : undefined;

    const userUpdateData: Prisma.UserUpdateInput = {};
    if (input.name !== undefined) userUpdateData.name = input.name.trim();
    if (input.email !== undefined) userUpdateData.email = email ?? null;
    if (input.phone !== undefined) userUpdateData.phone = phone ?? null;

    const doctorUpdateData: Prisma.DoctorUpdateInput = {};
    if (specialization !== undefined)
      doctorUpdateData.specialization = specialization;
    if (department !== undefined) doctorUpdateData.department = department;
    if (bio !== undefined) doctorUpdateData.bio = bio;
    if (schedule !== undefined) doctorUpdateData.schedule = schedule;
    if (sliderPictureUrl !== undefined)
      doctorUpdateData.sliderPictureUrl = sliderPictureUrl;
    if (branchId !== undefined) {
      doctorUpdateData.branch = branchId
        ? { connect: { id: branchId } }
        : { disconnect: true };
    }
    if (visitingHours !== undefined) doctorUpdateData.visitingHours = visitingHours;
    if (keywords !== undefined) doctorUpdateData.keywords = keywords;
    if (availableFrom !== undefined) doctorUpdateData.availableFrom = availableFrom;
    if (availableTo !== undefined) doctorUpdateData.availableTo = availableTo;
    if (weekdays !== undefined) doctorUpdateData.weekdays = weekdays;

    const fallbackProfileImage = trimOrNull(
      sliderPictureUrl ??
        (existingDoctor.directoryProfile as DirectoryProfile | null)?.image ??
        existingDoctor.sliderPictureUrl ??
        null,
    );

    if (input.directoryProfile !== undefined) {
      const directoryProfile = normalizeDirectoryProfile(input.directoryProfile, {
        name: input.name ?? existingDoctor.user.name,
        department: department ?? existingDoctor.department,
        specialization: specialization ?? existingDoctor.specialization,
        visitingHours: visitingHours ?? existingDoctor.visitingHours,
        image: fallbackProfileImage,
      });

      doctorUpdateData.directoryProfile = directoryProfile
        ? (directoryProfile as Prisma.InputJsonValue)
        : Prisma.JsonNull;
    } else if (sliderPictureUrl !== undefined && existingDoctor.directoryProfile) {
      const profile = {
        ...(existingDoctor.directoryProfile as DirectoryProfile),
      };
      doctorUpdateData.directoryProfile = {
        ...profile,
        image: fallbackProfileImage,
      } as Prisma.InputJsonValue;
    }

    const [, updatedDoctor] = await prisma.$transaction([
      prisma.user.update({
        where: { id: existingDoctor.userId },
        data: userUpdateData,
      }),
      prisma.doctor.update({
        where: { id },
        data: doctorUpdateData,
        include: {
          user: { select: { name: true, email: true, phone: true } },
          branch: { select: { name: true, city: true } },
        },
      }),
    ]);

    return NextResponse.json(updatedDoctor);
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const role = String(session?.user?.role || "").toLowerCase();
  if (role !== "admin" && role !== "moderator") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params; // This is doctor ID

    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: doctor.userId } });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot delete doctor with existing appointments. Please reassign or delete them first.",
        },
        { status: 409 },
      );
    }
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
