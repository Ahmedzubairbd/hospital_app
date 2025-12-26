"use client";

import * as React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import { useI18n } from "@/lib/i18n";

// JSX

type Localized = {
  bn: string;
  en: string;
};

const medicalTags: Localized[] = [
  { bn: "অর্থোপেডিক", en: "Orthopedic" },
  { bn: "ফিজিওথেরাপি", en: "Fitness Therapy" },
  { bn: "ডিজিটাল এক্স-রে", en: "Digital X-Ray" },
  { bn: "কালার ডপলার ইকো", en: "Color Doppler Eco" },
  { bn: "অ্যাম্বুলেন্স কলার ডায়াল", en: "Ambulance Caller Dial" },
  { bn: "ডিজিটাল অপারেশন", en: "Digital Operation" },
  { bn: "বায়োকেমিক্যাল", en: "Biochemical" },
  { bn: "হেমাটোলজি", en: "Hematology" },
  { bn: "মোলোকুলার", en: "Molecular Diagnostics" },
  { bn: "ইউরোলজি", en: "Urology" },
  { bn: "মাইক্রোবায়োলজি", en: "Microbiology" },
  { bn: "হোমিওপ্যাথি", en: "Homeopathy" },
  { bn: "দ্রুত কল চার্জ", en: "Emergency Call Service" },
  { bn: "ক্যান্সার ক্লিনিক", en: "Cancer Clinic" },
  { bn: "স্কিন বায়োপসি", en: "Skin Biopsy" },
  { bn: "ডেন্ট স্ক্যালার", en: "Dental Scaling" },
  { bn: "সিটি স্ক্যান", en: "CT Scan" },
  { bn: "এমআরআই/ইইজি", en: "MRI/EEG" },
  { bn: "FNAC/হিস্টোপ্যাথলজি", en: "FNAC/Histopathology" },
  { bn: "অন্যান্য অ্যামেনিটিস", en: "Other Amenities" },
];

export default function AdvanceMedicalTest() {
  const { lang } = useI18n();
  const t = React.useCallback(
    (value: Localized) => (lang === "bn" ? value.bn : value.en),
    [lang],
  );
  return (
    <Box
      component="section"
      justifyContent="center"
      sx={{
        alignItems: "center",
        textAlign: "justify",
      }}
    >
      {/* Banner Heading */}
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 400,
          fontSize: { xs: 28, md: 38, lg: 42 },
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        {lang === "bn" ? "উন্নত প্রযুক্তির মেডিকেল টেস্ট" : "Advanced Diagnostics"}
      </Typography>

      <br />
      <br />
      {/* Section Start */}
      <Box sx={{ display: "flex", alignSelf: "center" }}>
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={1}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {medicalTags.map((tag) => (
            <Chip
              key={tag.bn}
              label={t(tag)}
              color="primary"
              variant="filled"
              sx={{
                fontWeight: 200,
                fontSize: 20,
                borderRadius: 0,
                justifySelf: "center",
                backgroundColor: "theme.primary",
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
