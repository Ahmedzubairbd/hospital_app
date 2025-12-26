"use client";

import * as React from "react";
import Image from "next/image";
import {
  Autocomplete,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n, type Lang } from "@/lib/i18n";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
type LocaleText = {
  en: string;
  bn: string;
};

type DoctorProfile = {
  id: string;
  name: LocaleText;
  department: LocaleText;
  specialization: LocaleText;
  qualifications: LocaleText[];
  workplaces: LocaleText[];
  visitingHours: LocaleText;
  description: LocaleText | null;
  image: string | null;
  focusAreas: LocaleText[];
  keywords: string[];
  branch: string | null;
  schedule: string | null;
  availableFrom: string | null;
  availableTo: string | null;
  weekdays: string | null;
};

type FilterOption = {
  id: string;
  label: LocaleText;
};

const uniqueOptions = (options: FilterOption[]) => {
  const map = new Map<string, FilterOption>();
  options.forEach((opt) => {
    if (!map.has(opt.id)) map.set(opt.id, opt);
  });
  return Array.from(map.values());
};

const getText = (value: LocaleText, lang: Lang) => value[lang] ?? value.en;

const buildSearchHaystack = (profile: DoctorProfile) => {
  const parts = [
    profile.name.en,
    profile.name.bn,
    profile.department.en,
    profile.department.bn,
    profile.specialization.en,
    profile.specialization.bn,
    profile.visitingHours.en,
    profile.visitingHours.bn,
    profile.description?.en ?? "",
    profile.description?.bn ?? "",
    ...profile.qualifications.flatMap((q) => [q.en, q.bn]),
    ...profile.workplaces.flatMap((w) => [w.en, w.bn]),
    ...(profile.focusAreas?.flatMap((f) => [f.en, f.bn]) ?? []),
    ...profile.keywords,
    profile.branch ?? "",
    profile.schedule ?? "",
    profile.availableFrom ?? "",
    profile.availableTo ?? "",
    profile.weekdays ?? "",
  ];
  return parts.join("|").replace(/\s+/g, " ").toLowerCase();
};

const BRANCH_MAPPINGS = [
  { label: "Kushtia", keywords: ["kushtia"] },
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

export default function FindDoctorPage() {
  const { lang } = useI18n();
  const [profiles, setProfiles] = React.useState<DoctorProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] =
    React.useState<FilterOption | null>(null);
  const [selectedSpecializations, setSelectedSpecializations] = React.useState<
    FilterOption[]
  >([]);
  const [selectedFocusAreas, setSelectedFocusAreas] = React.useState<
    FilterOption[]
  >([]);
  const [expandedCards, setExpandedCards] = React.useState<
    Record<string, boolean>
  >({});
  const [isPending, startTransition] = React.useTransition();
  const deferredQuery = React.useDeferredValue(query);
  const busy = loading || isPending;

  React.useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(null);

    fetch("/api/doctors/public", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to load doctors");
        }
        const data = await res.json();
        if (!active) return;
        startTransition(() => setProfiles(Array.isArray(data) ? data : []));
      })
      .catch((err: unknown) => {
        if (
          !active ||
          (err instanceof DOMException && err.name === "AbortError")
        ) {
          return;
        }
        setError("Failed to load doctors. Please try again.");
        setProfiles([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const departmentOptions = React.useMemo(
    () =>
      uniqueOptions(
        profiles.map((doc) => ({
          id: doc.department.en,
          label: doc.department,
        }))
      ),
    [profiles]
  );

  const specializationOptions = React.useMemo(
    () =>
      uniqueOptions(
        profiles.map((doc) => ({
          id: doc.specialization.en,
          label: doc.specialization,
        }))
      ),
    [profiles]
  );

  const focusAreaOptions = React.useMemo(() => {
    const opts: FilterOption[] = [];
    profiles.forEach((doc) => {
      doc.focusAreas.forEach((area) => {
        opts.push({ id: area.en, label: area });
      });
    });
    return uniqueOptions(opts);
  }, [profiles]);

  const profileHaystack = React.useMemo(() => {
    const map = new Map<string, string>();
    profiles.forEach((profile) => {
      map.set(profile.id, buildSearchHaystack(profile));
    });
    return map;
  }, [profiles]);

  React.useEffect(() => {
    if (
      selectedDepartment &&
      !departmentOptions.some((opt) => opt.id === selectedDepartment.id)
    ) {
      setSelectedDepartment(null);
    }
  }, [departmentOptions, selectedDepartment]);

  React.useEffect(() => {
    setSelectedSpecializations((prev) => {
      const allowed = new Set(specializationOptions.map((opt) => opt.id));
      const next = prev.filter((item) => allowed.has(item.id));
      return next.length === prev.length ? prev : next;
    });
  }, [specializationOptions]);

  React.useEffect(() => {
    setSelectedFocusAreas((prev) => {
      const allowed = new Set(focusAreaOptions.map((opt) => opt.id));
      const next = prev.filter((item) => allowed.has(item.id));
      return next.length === prev.length ? prev : next;
    });
  }, [focusAreaOptions]);

  const filteredProfiles = React.useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    const terms = normalized ? normalized.split(/\s+/).filter(Boolean) : [];

    return profiles.filter((profile) => {
      if (selectedDepartment && profile.department.en !== selectedDepartment.id)
        return false;

      if (
        selectedSpecializations.length > 0 &&
        !selectedSpecializations.some(
          (item) => item.id === profile.specialization.en
        )
      )
        return false;

      if (selectedFocusAreas.length > 0) {
        const focusIds = profile.focusAreas.map((item) => item.en);
        const hasMatch = selectedFocusAreas.some((item) =>
          focusIds.includes(item.id)
        );
        if (!hasMatch) return false;
      }

      if (terms.length === 0) return true;

      const haystack = profileHaystack.get(profile.id);
      if (!haystack) return false;

      return terms.every((term) => haystack.includes(term));
    });
  }, [
    profiles,
    deferredQuery,
    profileHaystack,
    selectedDepartment,
    selectedSpecializations,
    selectedFocusAreas,
  ]);

  const toggleCardExpansion = React.useCallback((id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const heading = lang === "bn" ? "ডাক্তার খুঁজুন" : "Find a Doctor";
  const subheading =
    lang === "bn"
      ? "আমাদের বিশেষজ্ঞ প্যানেলের তথ্য, ছবি ও সাক্ষাৎ সময় দেখে আপনার প্রয়োজনীয় চিকিৎসক নির্বাচন করুন।"
      : "Browse our specialist panel, view availability, and pick the right doctor for your needs.";

  const searchPlaceholder =
    lang === "bn"
      ? "নাম, বিভাগ, বিশেষজ্ঞতা বা সেবার মাধ্যমে খুঁজুন..."
      : "Search by name, department, specialty, or service...";

  const departmentLabel = lang === "bn" ? "বিভাগ" : "Department";
  const specializationLabel = lang === "bn" ? "বিশেষজ্ঞতা" : "Specialty";
  const focusAreaLabel = lang === "bn" ? "সেবা ক্ষেত্র" : "Focus Area";

  const resultLabel = busy
    ? lang === "bn"
      ? "চিকিৎসকদের তথ্য লোড হচ্ছে..."
      : "Loading doctors..."
    : lang === "bn"
    ? `${filteredProfiles.length} জন চিকিৎসক পাওয়া গেছে`
    : `${filteredProfiles.length} doctors available`;

  return (
    <Box sx={{ py: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        {heading}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {subheading}
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          flexWrap: "wrap",
          alignItems: "stretch",
          mb: { xs: 3, md: 3 },
        }}
      >
        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          fullWidth
          size="small"
          placeholder={searchPlaceholder}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: { xs: "100%", md: 280 } }}
        />
        <br />
        <Autocomplete
          options={departmentOptions}
          value={selectedDepartment}
          onChange={(_, value) => setSelectedDepartment(value)}
          getOptionLabel={(option) => getText(option.label, lang)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          clearOnEscape
          sx={{ minWidth: { xs: "100%", md: 220 } }}
          renderInput={(params) => (
            <TextField {...params} size="small" label={departmentLabel} />
          )}
        />

        <Autocomplete
          multiple
          disableCloseOnSelect
          options={specializationOptions}
          value={selectedSpecializations}
          onChange={(_, value) => setSelectedSpecializations(value)}
          getOptionLabel={(option) => getText(option.label, lang)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          sx={{ minWidth: { xs: "100%", md: 240 } }}
          renderInput={(params) => (
            <TextField {...params} size="small" label={specializationLabel} />
          )}
        />

        <Autocomplete
          multiple
          disableCloseOnSelect
          options={focusAreaOptions}
          value={selectedFocusAreas}
          onChange={(_, value) => setSelectedFocusAreas(value)}
          getOptionLabel={(option) => getText(option.label, lang)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          sx={{ minWidth: { xs: "100%", md: 240 } }}
          renderInput={(params) => (
            <TextField {...params} size="small" label={focusAreaLabel} />
          )}
        />
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {resultLabel}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {busy ? (
          <Grid size={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 6,
                gap: 2,
              }}
            >
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                {lang === "bn" ? "দয়া করে অপেক্ষা করুন..." : "Please wait..."}
              </Typography>
            </Box>
          </Grid>
        ) : (
          <>
            <AnimatePresence>
              {filteredProfiles.map((profile, index) => {
                const isExpanded = expandedCards[profile.id] ?? false;
                const descriptionText = profile.description
                  ? getText(profile.description, lang)
                  : null;
                const summaryWorkplaces = profile.workplaces.slice(0, 1);
                const extraWorkplaces = profile.workplaces.slice(
                  summaryWorkplaces.length
                );
                const branchLabel =
                  resolveBranchLabel(profile.branch) ??
                  resolveBranchLabel(profile.availableTo);
                const hasExpandableContent =
                  profile.qualifications.length > 0 ||
                  extraWorkplaces.length > 0 ||
                  profile.focusAreas.length > 0 ||
                  Boolean(descriptionText);

                return (
                  <Grid key={profile.id} size={{ xs: 12, md: 6, lg: 4 }}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, delay: index * 0.03 }}
                    >
                      <Card
                        sx={(theme) => {
                          const isDark = theme.palette.mode === "dark";
                          const borderColor = alpha(
                            theme.palette.primary.main,
                            isDark ? 0.4 : 0.25
                          );
                          return {
                            height: "100%",
                            minHeight: { xs: 460, md: 520 },
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 5,
                            overflow: "hidden",
                            position: "relative",
                            border: `1px solid ${borderColor}`,
                            background: isDark
                              ? "linear-gradient(180deg, rgba(8, 14, 16, 0.98) 0%, rgba(6, 10, 12, 0.94) 100%)"
                              : "linear-gradient(180deg, rgba(235, 252, 248, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)",
                            boxShadow: isDark
                              ? "0 22px 50px rgba(0, 0, 0, 0.55)"
                              : "0 18px 40px rgba(0, 105, 92, 0.14)",
                            backdropFilter: "blur(10px)",
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-6px)",
                              boxShadow: isDark
                                ? "0 28px 70px rgba(0, 0, 0, 0.6)"
                                : "0 22px 50px rgba(0, 105, 92, 0.18)",
                            },
                            "&:hover img": {
                              transform: profile.image ? "scale(1.05)" : "none",
                            },
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              inset: 0,
                              borderRadius: "inherit",
                              pointerEvents: "none",
                              boxShadow: `inset 0 0 0 1px ${alpha(
                                theme.palette.primary.main,
                                isDark ? 0.28 : 0.18
                              )}`,
                              opacity: 0.8,
                            },
                          };
                        }}
                      >
                        <Box
                          sx={(theme) => {
                            const isDark = theme.palette.mode === "dark";
                            return {
                              position: "relative",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              pt: { xs: 3, md: 3.5 },
                              pb: { xs: 1.5, md: 2 },
                              background: isDark
                                ? "linear-gradient(180deg, rgba(0, 191, 165, 0.08), rgba(0, 0, 0, 0))"
                                : "linear-gradient(180deg, rgba(0, 150, 136, 0.08), rgba(255, 255, 255, 0))",
                            };
                          }}
                        >
                          <Box
                            sx={(theme) => {
                              const isDark = theme.palette.mode === "dark";
                              return {
                                width: { xs: 170, md: 200 },
                                aspectRatio: "1 / 1",
                                borderRadius: "50%",
                                position: "relative",
                                overflow: "hidden",
                                display: "grid",
                                placeItems: "center",
                                border: `1px solid ${alpha(
                                  theme.palette.primary.main,
                                  isDark ? 0.45 : 0.22
                                )}`,
                                backgroundColor: isDark
                                  ? "rgba(0, 0, 0, 0.5)"
                                  : "rgba(255, 255, 255, 0.92)",
                                boxShadow: isDark
                                  ? "0 12px 28px rgba(0, 0, 0, 0.45)"
                                  : "0 12px 28px rgba(0, 105, 92, 0.16)",
                              };
                            }}
                          >
                            {profile.image ? (
                              <Image
                                src={profile.image}
                                alt={getText(profile.name, lang)}
                                fill
                                quality={80}
                                sizes="(max-width: 600px) 60vw, (max-width: 1200px) 40vw, 220px"
                                style={{
                                  objectFit: "cover",
                                  transition: "transform 0.6s ease",
                                  transformOrigin: "center",
                                }}
                              />
                            ) : (
                              <Image
                                src="/assets/icons/components/ic_avatar.svg"
                                alt="Doctor avatar placeholder"
                                width={128}
                                height={128}
                                quality={80}
                                style={{
                                  opacity: 0.7,
                                  width: "55%",
                                  height: "auto",
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.2,
                            textAlign: "center",
                            alignItems: "center",
                            px: { xs: 2.5, md: 3 },
                            pb: { xs: 2.5, md: 3 },
                          }}
                        >
                          <Box
                            sx={{
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1.2,
                              alignItems: "center",
                            }}
                          >
                            <Box sx={{ textAlign: "center" }}>
                              <Typography
                                variant="h6"
                                sx={{ lineHeight: 1.3, fontWeight: 700 }}
                              >
                                {getText(profile.name, lang)}
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                              >
                                {getText(profile.specialization, lang)}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {getText(profile.department, lang)}
                              </Typography>
                            </Box>

                            {summaryWorkplaces.length > 0 && (
                              <Stack spacing={0.5} alignItems="center">
                                {summaryWorkplaces.map((place) => (
                                  <Typography
                                    key={`${profile.id}-${place.en}-summary`}
                                    variant="body2"
                                    sx={{ textAlign: "center" }}
                                  >
                                    {getText(place, lang)}
                                  </Typography>
                                ))}
                                {extraWorkplaces.length > 0 && !isExpanded && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {lang === "bn"
                                      ? `${extraWorkplaces.length}টি অতিরিক্ত চেম্বার সম্পর্কে জানতে প্রসারিত করুন`
                                      : `+${extraWorkplaces.length} more locations`}
                                  </Typography>
                                )}
                              </Stack>
                            )}

                            <Stack spacing={0.25} alignItems="center">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 500, textAlign: "center" }}
                              >
                                {getText(profile.visitingHours, lang)}
                              </Typography>
                              {profile.availableFrom && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ textAlign: "center" }}
                                >
                                  {lang === "bn"
                                    ? `সময়: ${profile.availableFrom}`
                                    : `Time: ${profile.availableFrom}`}
                                </Typography>
                              )}
                              {profile.weekdays && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ textAlign: "center" }}
                                >
                                  {lang === "bn"
                                    ? `সপ্তাহের দিন: ${profile.weekdays}`
                                    : `Weekdays: ${profile.weekdays}`}
                                </Typography>
                              )}
                              {branchLabel && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ textAlign: "center" }}
                                >
                                  {lang === "bn"
                                    ? `শাখা: ${branchLabel}`
                                    : `Branch: ${branchLabel}`}
                                </Typography>
                              )}
                            </Stack>

                            {hasExpandableContent && (
                              <Collapse
                                in={isExpanded}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Stack
                                  spacing={1.2}
                                  sx={{ mt: 1, alignItems: "center" }}
                                >
                                  {extraWorkplaces.length > 0 && (
                                    <Stack spacing={0.5} alignItems="center">
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600 }}
                                      >
                                        {lang === "bn"
                                          ? "অতিরিক্ত চেম্বার"
                                          : "Additional Chambers"}
                                      </Typography>
                                      {extraWorkplaces.map((place) => (
                                        <Typography
                                          key={`${profile.id}-${place.en}-extra`}
                                          variant="body2"
                                          sx={{ textAlign: "center" }}
                                        >
                                          {getText(place, lang)}
                                        </Typography>
                                      ))}
                                    </Stack>
                                  )}

                                  {descriptionText && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ textAlign: "center" }}
                                    >
                                      {descriptionText}
                                    </Typography>
                                  )}

                                  {profile.focusAreas.length > 0 && (
                                    <Stack spacing={0.75} alignItems="center">
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600 }}
                                      >
                                        {lang === "bn"
                                          ? "বিশেষ আগ্রহের ক্ষেত্র"
                                          : "Focus Areas"}
                                      </Typography>
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        flexWrap="wrap"
                                        useFlexGap
                                        justifyContent="center"
                                      >
                                        {profile.focusAreas.map((area) => (
                                          <Chip
                                            key={`${profile.id}-${area.en}`}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            label={getText(area, lang)}
                                          />
                                        ))}
                                      </Stack>
                                    </Stack>
                                  )}

                                  {profile.qualifications.length > 0 && (
                                    <Stack spacing={0.75} alignItems="center">
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600 }}
                                      >
                                        {lang === "bn"
                                          ? "শিক্ষা ও যোগ্যতা"
                                          : "Education & Qualifications"}
                                      </Typography>
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        flexWrap="wrap"
                                        useFlexGap
                                        justifyContent="center"
                                      >
                                        {profile.qualifications.map((qual) => (
                                          <Chip
                                            key={`${profile.id}-${qual.en}`}
                                            size="small"
                                            label={getText(qual, lang)}
                                            sx={{ mt: 0.5 }}
                                          />
                                        ))}
                                      </Stack>
                                    </Stack>
                                  )}
                                </Stack>
                              </Collapse>
                            )}
                          </Box>

                          {hasExpandableContent && (
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => toggleCardExpansion(profile.id)}
                              endIcon={
                                <KeyboardArrowDownIcon
                                  sx={{
                                    transition: "transform 0.2s ease",
                                    transform: isExpanded
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  }}
                                />
                              }
                              sx={{ alignSelf: "center", mt: 0.5 }}
                            >
                              {isExpanded
                                ? lang === "bn"
                                  ? "সংক্ষিপ্ত করুন"
                                  : "Show less"
                                : lang === "bn"
                                ? "সম্পূর্ণ প্রোফাইল"
                                : "View full profile"}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </AnimatePresence>

            {!error && filteredProfiles.length === 0 && (
              <Grid size={12}>
                <Box
                  sx={{
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 4,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {lang === "bn"
                      ? "কোনো চিকিৎসক পাওয়া যায়নি"
                      : "No doctors found"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {lang === "bn"
                      ? "অন্যান্য কী-ওয়ার্ড বা ফিল্টার ব্যবহার করে পুনরায় চেষ্টা করুন।"
                      : "Try adjusting your filters or search terms and try again."}
                  </Typography>
                </Box>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
}
