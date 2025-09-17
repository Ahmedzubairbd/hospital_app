"use client";

import * as React from "react";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { AnimatePresence, motion } from "framer-motion";
import {
  doctorProfiles,
  type DoctorProfile,
  type LocaleText,
} from "@/data/doctorProfiles";
import { useI18n, type Lang } from "@/lib/i18n";

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
  ];
  return parts
    .join("|")
    .replace(/\s+/g, " ")
    .toLowerCase();
};

const profileHaystack = new Map<string, string>();

doctorProfiles.forEach((profile) => {
  profileHaystack.set(profile.id, buildSearchHaystack(profile));
});

export default function FindDoctorPage() {
  const { lang } = useI18n();
  const [query, setQuery] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState<
    FilterOption | null
  >(null);
  const [selectedSpecializations, setSelectedSpecializations] = React.useState<
    FilterOption[]
  >([]);
  const [selectedFocusAreas, setSelectedFocusAreas] = React.useState<
    FilterOption[]
  >([]);

  const departmentOptions = React.useMemo(
    () =>
      uniqueOptions(
        doctorProfiles.map((doc) => ({
          id: doc.department.en,
          label: doc.department,
        })),
      ),
    [],
  );

  const specializationOptions = React.useMemo(
    () =>
      uniqueOptions(
        doctorProfiles.map((doc) => ({
          id: doc.specialization.en,
          label: doc.specialization,
        })),
      ),
    [],
  );

  const focusAreaOptions = React.useMemo(() => {
    const opts: FilterOption[] = [];
    doctorProfiles.forEach((doc) => {
      doc.focusAreas?.forEach((area) => {
        opts.push({ id: area.en, label: area });
      });
    });
    return uniqueOptions(opts);
  }, []);

  const filteredProfiles = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const terms = normalized ? normalized.split(/\s+/).filter(Boolean) : [];

    return doctorProfiles.filter((profile) => {
      if (selectedDepartment && profile.department.en !== selectedDepartment.id)
        return false;

      if (
        selectedSpecializations.length > 0 &&
        !selectedSpecializations.some((item) => item.id === profile.specialization.en)
      )
        return false;

      if (selectedFocusAreas.length > 0) {
        const focusIds = (profile.focusAreas ?? []).map((item) => item.en);
        const hasMatch = selectedFocusAreas.some((item) =>
          focusIds.includes(item.id),
        );
        if (!hasMatch) return false;
      }

      if (terms.length === 0) return true;

      const haystack = profileHaystack.get(profile.id);
      if (!haystack) return false;

      return terms.every((term) => haystack.includes(term));
    });
  }, [query, selectedDepartment, selectedSpecializations, selectedFocusAreas]);

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
          mb: 3,
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
        {lang === "bn"
          ? `${filteredProfiles.length} জন চিকিৎসক পাওয়া গেছে`
          : `${filteredProfiles.length} doctors available`}
      </Typography>

      <Grid container spacing={2}>
        <AnimatePresence>
          {filteredProfiles.map((profile, index) => (
            <Grid key={profile.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <motion.div
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "none",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      aspectRatio: "4 / 3",
                      backgroundColor: "action.hover",
                    }}
                  >
                    <Box
                      component="img"
                      src={profile.image}
                      alt={profile.name.en}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.6s ease",
                        transformOrigin: "center",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box>
                      <Typography variant="h6" sx={{ lineHeight: 1.3 }}>
                        {getText(profile.name, lang)}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      >
                        {getText(profile.specialization, lang)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getText(profile.department, lang)}
                      </Typography>
                    </Box>

                    {profile.qualifications.length > 0 && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {profile.qualifications.map((qual) => (
                          <Chip
                            key={`${profile.id}-${qual.en}`}
                            size="small"
                            label={getText(qual, lang)}
                            sx={{ mt: 0.5 }}
                          />
                        ))}
                      </Stack>
                    )}

                    {profile.workplaces.length > 0 && (
                      <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                        {profile.workplaces.map((place) => (
                          <Typography key={`${profile.id}-${place.en}`} variant="body2">
                            {getText(place, lang)}
                          </Typography>
                        ))}
                      </Stack>
                    )}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, fontWeight: 500 }}
                    >
                      {getText(profile.visitingHours, lang)}
                    </Typography>

                    {profile.description && (
                      <Typography variant="body2" color="text.secondary">
                        {getText(profile.description, lang)}
                      </Typography>
                    )}

                    {profile.focusAreas && profile.focusAreas.length > 0 && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: "auto" }}>
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
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>

        {filteredProfiles.length === 0 && (
          <Grid size={12}>
            <Box
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {lang === "bn" ? "কোনো চিকিৎসক পাওয়া যায়নি" : "No doctors found"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lang === "bn"
                  ? "অন্যান্য কী-ওয়ার্ড বা ফিল্টার ব্যবহার করে পুনরায় চেষ্টা করুন।"
                  : "Try adjusting your filters or search terms and try again."}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
