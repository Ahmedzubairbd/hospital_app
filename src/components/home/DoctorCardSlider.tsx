"use client";

import * as React from "react";
import Image from "next/image";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Skeleton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PlaceIcon from "@mui/icons-material/Place";
import { useI18n } from "@/lib/i18n";

type LocaleText = {
  en: string;
  bn: string;
};

type PublicDoctorProfile = {
  id: string;
  name: LocaleText;
  department: LocaleText;
  specialization: LocaleText;
  visitingHours: LocaleText | null;
  description?: LocaleText | null;
  image: string | null;
  branch: string | null;
  schedule?: string | null;
  availableFrom?: string | null;
  availableTo?: string | null;
  weekdays?: string | null;
};

type DoctorProfile = PublicDoctorProfile & {
  branchLabel: string | null;
};

const DAY_NAMES_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DAY_NAMES_BN = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

const FALLBACK_IMAGE = "/assets/placeholder.svg";

function normalizeDayToken(token: string): number | null {
  const normalized = token.trim().toLowerCase();
  if (!normalized) return null;
  const map: Record<string, number> = {
    sun: 0,
    sunday: 0,
    mon: 1,
    monday: 1,
    tue: 2,
    tues: 2,
    tuesday: 2,
    wed: 3,
    weds: 3,
    wednesday: 3,
    thu: 4,
    thur: 4,
    thurs: 4,
    thursday: 4,
    fri: 5,
    friday: 5,
    sat: 6,
    saturday: 6,
  };
  return map[normalized] ?? null;
}

function addRangeDays(result: Set<number>, start: number, end: number) {
  let current = start;
  result.add(current);
  while (current !== end) {
    current = (current + 1) % 7;
    result.add(current);
  }
}

function parseWeekdays(value?: string | null): Set<number> {
  if (!value) return new Set();
  const normalized = value.trim();
  if (!normalized) return new Set();
  const upper = normalized.toUpperCase();
  if (upper.includes("DAILY") || upper.includes("EVERYDAY")) {
    return new Set([0, 1, 2, 3, 4, 5, 6]);
  }
  if (upper.includes("APPOINTMENT")) {
    return new Set([0, 1, 2, 3, 4, 5, 6]);
  }

  const result = new Set<number>();

  // Handle explicit ranges like "Sat-Thu" or "Mon - Wed".
  const rangeRegex =
    /(sun|mon|tue|tues|wed|thu|thur|thurs|fri|sat|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\s*-\s*(sun|mon|tue|tues|wed|thu|thur|thurs|fri|sat|sunday|monday|tuesday|wednesday|thursday|friday|saturday)/gi;
  let match: RegExpExecArray | null;
  let consumed = normalized;
  while ((match = rangeRegex.exec(normalized))) {
    const start = normalizeDayToken(match[1]);
    const end = normalizeDayToken(match[2]);
    if (start !== null && end !== null) {
      addRangeDays(result, start, end);
      consumed = consumed.replace(match[0], " ");
    }
  }

  const remainingTokens =
    consumed.match(
      /(sun|mon|tue|tues|wed|thu|thur|thurs|fri|sat|sunday|monday|tuesday|wednesday|thursday|friday|saturday)/gi,
    ) ?? [];

  for (const token of remainingTokens) {
    const dayIndex = normalizeDayToken(token);
    if (dayIndex !== null) {
      result.add(dayIndex);
    }
  }

  return result;
}

const BRANCH_MAPPINGS = [
  {
    label: "Kushtia",
    keywords: ["kushtia", "kustia", "kushtia hospital"],
  },
  {
    label: "Jhenaidah",
    keywords: ["jhenaidah", "jhineidah", "jhinaidah", "jhenaida"],
  },
];

function resolveBranchLabel(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  for (const mapping of BRANCH_MAPPINGS) {
    if (mapping.keywords.some((keyword) => normalized.includes(keyword))) {
      return mapping.label;
    }
  }
  return null;
}

function deriveBranchLabel(doctor: PublicDoctorProfile): string | null {
  const branch = resolveBranchLabel(doctor.branch);
  if (branch) return branch;
  const candidate = doctor.availableTo?.trim();
  if (candidate && !/\d/.test(candidate)) {
    return resolveBranchLabel(candidate);
  }
  return null;
}

function deriveTimeWindow(
  from?: string | null,
  to?: string | null,
): string | null {
  const clean = (value?: string | null) => value?.trim() ?? "";
  const fromValue = clean(from);
  const toValue = clean(to);
  const isTimeLike = (value: string) => /\d/.test(value);
  if (fromValue && toValue && isTimeLike(fromValue) && isTimeLike(toValue)) {
    return `${fromValue} – ${toValue}`;
  }
  if (fromValue && isTimeLike(fromValue)) return fromValue;
  if (toValue && isTimeLike(toValue)) return toValue;
  return null;
}

export default function DoctorCardSlider() {
  const { lang } = useI18n();
  const [doctors, setDoctors] = React.useState<DoctorProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = React.useState<string | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = React.useState(0);

  const todayIndex = React.useMemo(() => new Date().getDay(), []);

  React.useEffect(() => {
    let subscribed = true;
    setLoading(true);
    fetch("/api/doctors/public", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load doctors");
        }
        return response.json();
      })
      .then((payload: PublicDoctorProfile[]) => {
        if (!subscribed) return;
        const mapped = payload.map((doctor) => ({
          ...doctor,
          branchLabel: deriveBranchLabel(doctor),
        }));
        setDoctors(mapped);
        setLoading(false);
        if (mapped.length > 0 && !selectedBranch) {
          const branch =
            mapped.find((doc) => parseWeekdays(doc.weekdays).has(todayIndex))
              ?.branchLabel ?? mapped[0].branchLabel;
          setSelectedBranch(branch ?? "all");
        }
      })
      .catch((err: unknown) => {
        if (!subscribed) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
    return () => {
      subscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const branches = React.useMemo(() => {
    const unique = new Set<string>();
    for (const doctor of doctors) {
      if (doctor.branchLabel) {
        unique.add(doctor.branchLabel);
      }
    }
    return Array.from(unique);
  }, [doctors]);

  const resolvedBranch =
    selectedBranch === "all" ? null : (selectedBranch ?? null);

  const visibleDoctors = React.useMemo(() => {
    const branchFiltered = resolvedBranch
      ? doctors.filter((doctor) => doctor.branchLabel === resolvedBranch)
      : doctors;
    return branchFiltered.filter((doctor) => {
      const scheduleDays = parseWeekdays(doctor.weekdays);
      if (scheduleDays.size === 0) return true;
      return scheduleDays.has(todayIndex);
    });
  }, [doctors, resolvedBranch, todayIndex]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [resolvedBranch, todayIndex, visibleDoctors.length]);

  const activeDoctor =
    visibleDoctors.length > 0
      ? visibleDoctors[Math.abs(activeIndex) % visibleDoctors.length]
      : null;

  const dayLabel =
    lang === "bn" ? DAY_NAMES_BN[todayIndex] : DAY_NAMES_EN[todayIndex];
  const todayLabel = lang === "bn" ? `আজ: ${dayLabel}` : `Today: ${dayLabel}`;

  const visitingHours =
    activeDoctor?.visitingHours?.[lang] ?? activeDoctor?.schedule ?? null;
  const timeWindow = deriveTimeWindow(
    activeDoctor?.availableFrom,
    activeDoctor?.availableTo,
  );

  const doctorCount =
    resolvedBranch && !branches.includes(resolvedBranch)
      ? 0
      : visibleDoctors.length;

  return (
    <Paper
      sx={(theme) => ({
        p: { xs: 0.5, md: 0.5 },
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 -24px 60px rgba(0,0,0,0.08)",
        display: "flex",
        overflow: "hidden",
        flexDirection: "column",
        justifyContent: "justify-between",
        gap: 2,
      })}
    >
      <Stack spacing={1} flexGrow={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {branches.length > 0 && (
            <ToggleButtonGroup
              exclusive
              value={resolvedBranch ?? "all"}
              onChange={(_, newBranch) => {
                if (newBranch === null) return;
                setSelectedBranch(newBranch);
              }}
              size="small"
              sx={{
                backgroundColor: "rgba(0,0,0,0.04)",
                ".MuiToggleButtonGroup-firstButton, .MuiToggleButtonGroup-lastButton":
                  {},
                ".MuiToggleButton-root": {
                  textTransform: "none",
                  border: "none",
                  overflow: "hidden",
                  position: "relative",
                  "&.Mui-selected": {
                    color: "primary.contrastText",
                    background:
                      "linear-gradient(135deg, rgba(0,165,143,0.95), rgba(0,124,110,0.95))",
                    boxShadow: "0 10px 24px rgba(0,150,136,0.35)",
                  },
                  "&:not(.Mui-selected)": {
                    color: "text.secondary",
                  },
                },
              }}
            >
              {branches.map((branch) => (
                <ToggleButton key={branch} value={branch}>
                  {branch}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
          <Chip
            label={todayLabel}
            color="success"
            size="small"
            sx={{
              fontWeight: 600,
              background:
                "linear-gradient(120deg, rgba(46,125,50,0.18), rgba(102,187,106,0.18))",
              color: (theme) => theme.palette.success.dark,
            }}
          />
        </Stack>
        {loading ? (
          <Stack spacing={1}>
            <Skeleton
              variant="rectangular"
              height={410}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton variant="text" width="80%" height={36} />
            <Skeleton variant="text" width="60%" height={28} />
            <Skeleton variant="text" width="70%" height={24} />
          </Stack>
        ) : error ? (
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              justifyContent: "center",
              flexGrow: 1,
            }}
          >
            <Typography color="error" variant="body2">
              {lang === "bn"
                ? "ডাক্তারের তথ্য লোড করা যায়নি"
                : "Unable to load doctor profiles."}
            </Typography>
          </Box>
        ) : activeDoctor ? (
          <Stack spacing={0}>
            <Box
              sx={{
                // width: "360px",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                position: "relative",
                backgroundColor: "rgba(0,150,136,0.06)",
              }}
            >
              <Image
                src={activeDoctor.image ?? FALLBACK_IMAGE}
                alt={activeDoctor.name[lang] || activeDoctor.name.en}
                fill
                style={{ objectFit: "cover", position: "absolute" }}
              />
            </Box>
            <Stack spacing={1}>
              <Typography variant="subtitle1" color="primary">
                {activeDoctor.department[lang] || activeDoctor.department.en}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {activeDoctor.name[lang] || activeDoctor.name.en}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 15 }}>
                {activeDoctor.specialization[lang] ||
                  activeDoctor.specialization.en}
              </Typography>
            </Stack>

            <Box
              sx={{
                borderRadius: 0.5,
              }}
            >
              <Stack spacing={1}>
                {visitingHours && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PlaceIcon sx={{ color: "primary.main", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: (theme) => theme.palette.primary.dark,
                      }}
                    >
                      {visitingHours}
                    </Typography>
                  </Stack>
                )}
                {timeWindow && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeFilledIcon
                      sx={{ color: "primary.main", fontSize: 20 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {timeWindow}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Stack>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary" variant="body2">
              {lang === "bn"
                ? "আজ এই শাখায় কোনো ডাক্তারের শিডিউল নেই"
                : "No doctors scheduled for this branch today."}
            </Typography>
          </Box>
        )}
      </Stack>

      <Divider />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1.2}
        sx={{ p: 0 }}
      >
        <Stack direction="row" spacing={1.2}>
          <IconButton
            color="primary"
            onClick={() =>
              setActiveIndex((previous) =>
                previous === 0 ? visibleDoctors.length - 1 : previous - 1,
              )
            }
            disabled={doctorCount <= 1}
            aria-label={lang === "bn" ? "পূর্ববর্তী ডাক্তার" : "Previous doctor"}
            sx={{
              borderRadius: 0.5,
              border: "1px solid rgba(0,150,136,0.2)",
              backgroundColor: "rgba(0,150,136,0.08)",
              "&:disabled": { opacity: 0.4 },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => setActiveIndex((previous) => previous + 1)}
            disabled={doctorCount <= 1}
            aria-label={lang === "bn" ? "পরবর্তী ডাক্তার" : "Next doctor"}
            sx={{
              borderRadius: 0.5,
              border: "1px solid rgba(0,150,136,0.2)",
              backgroundColor: "rgba(0,150,136,0.08)",
              "&:disabled": { opacity: 0.4 },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 400 }}
        >
          {doctorCount > 0
            ? lang === "bn"
              ? `ডাক্তার ${
                  (((activeIndex % doctorCount) + doctorCount) % doctorCount) +
                  1
                } / ${doctorCount}`
              : `Doctor ${
                  (((activeIndex % doctorCount) + doctorCount) % doctorCount) +
                  1
                } of ${doctorCount}`
            : lang === "bn"
              ? "কোনো ডাক্তার নেই"
              : "No doctors"}
        </Typography>
      </Stack>
    </Paper>
  );
}
