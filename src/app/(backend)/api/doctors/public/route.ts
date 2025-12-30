import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type LocaleText = { en: string; bn: string };

type DirectoryProfileJson = {
  name?: LocaleText;
  department?: LocaleText;
  specialization?: LocaleText;
  visitingHours?: LocaleText;
  description?: LocaleText;
  qualifications?: LocaleText[];
  workplaces?: LocaleText[];
  focusAreas?: LocaleText[];
  image?: string | null;
} | null;

function ensureLocaleText(
  value?: LocaleText | null,
  fallback?: string | null,
): LocaleText {
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

  return { en, bn };
}

function ensureLocaleArray(values?: LocaleText[] | null): LocaleText[] {
  if (!values) return [];
  return values
    .map((value) => ensureLocaleText(value))
    .filter((value) => value.en.length > 0 || value.bn.length > 0);
}

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: { select: { name: true } },
      branch: { select: { name: true } },
    },
    where: { user: { role: "DOCTOR" } },
    orderBy: { user: { name: "asc" } },
  });

  const payload = doctors.map((doctor) => {
    const profile = doctor.directoryProfile as DirectoryProfileJson;
    const name = ensureLocaleText(profile?.name, doctor.user.name);
    const department = ensureLocaleText(profile?.department, doctor.department);
    const specialization = ensureLocaleText(
      profile?.specialization,
      doctor.specialization,
    );
    const visitingHours = ensureLocaleText(
      profile?.visitingHours,
      doctor.visitingHours ?? doctor.schedule ?? "",
    );
    const descriptionRaw = profile?.description
      ? ensureLocaleText(profile.description)
      : null;
    const qualifications = ensureLocaleArray(profile?.qualifications);
    const workplaces = ensureLocaleArray(profile?.workplaces);
    const focusAreas = ensureLocaleArray(profile?.focusAreas);
    const keywords = Array.isArray(doctor.keywords)
      ? doctor.keywords.filter((value) => value && value.trim().length > 0)
      : [];
    const availableFrom = doctor.availableFrom?.trim() ?? null;
    const availableTo = doctor.availableTo?.trim() ?? null;
    const weekdays = doctor.weekdays?.trim() ?? null;

    return {
      id: doctor.id,
      name,
      department,
      specialization,
      qualifications,
      workplaces,
      visitingHours,
      description: descriptionRaw,
      image: profile?.image ?? doctor.sliderPictureUrl ?? null,
      focusAreas,
      keywords,
      branch: doctor.branch?.name ?? null,
      schedule: doctor.schedule,
      availableFrom,
      availableTo,
      weekdays,
    };
  });

  return NextResponse.json(payload);
}
