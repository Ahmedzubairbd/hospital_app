"use client";

import React from "react";
import { Box, Typography, Grid, Stack } from "@mui/material";
import { useI18n } from "@/lib/i18n";
import PackageCard from "./HealthPackageCard";

type Localized = {
  bn: string;
  en: string;
};

type HealthPackage = {
  title: Localized;
  subtitle: Localized;
  tests: Localized[];
  price: {
    old: Localized;
    new: Localized;
  };
  image: string;
};

const healthPackages: HealthPackage[] = [
  {
    title: { bn: "জেনারেল হেলথ চেকআপ", en: "General Health Checkup" },
    subtitle: { bn: "(প্যাকেজ - ১)", en: "(Package - 1)" },
    tests: [
      {
        bn: "১. কমপ্লিট ব্লাড কাউন্ট (CBC)",
        en: "1. Complete Blood Count (CBC)",
      },
      {
        bn: "২. র‍্যান্ডম ব্লাড সুগার (RBS)",
        en: "2. Random Blood Sugar (RBS)",
      },
      { bn: "৩. লিপিড প্রোফাইল (ফাস্টিং)", en: "3. Lipid Profile (Fasting)" },
      { bn: "৪. সিরাম ক্রিয়েটিনিন", en: "4. Serum Creatinine" },
      { bn: "৫. HbsAg", en: "5. HbsAg" },
      { bn: "৬. ইউরিন R/M/E", en: "6. Urine R/M/E" },
      { bn: "৭. ECG", en: "7. ECG" },
      { bn: "৮. এক্স-রে চেস্ট P/A ভিউ", en: "8. X-ray Chest P/A View" },
      { bn: "৯. USG অব হোল অ্যাবডোমেন", en: "9. USG of Whole Abdomen" },
    ],
    price: {
      old: { bn: "৳ ৪,৭০০", en: "৳ 4,700" },
      new: { bn: "৳ ৩,৫০০", en: "৳ 3,500" },
    },
    image:
      "https://as2.ftcdn.net/jpg/02/21/80/63/1000_F_221806314_QvIJHIs5D157pSuLm840Tgid26jJ3lpK.jpg",
  },
  {
    title: { bn: "বেসিক হেলথ চেকআপ", en: "Basic Health Checkup" },
    subtitle: { bn: "(প্যাকেজ - ২)", en: "(Package - 2)" },
    tests: [
      {
        bn: "১. কমপ্লিট ব্লাড কাউন্ট (CBC)",
        en: "1. Complete Blood Count (CBC)",
      },
      {
        bn: "২. র‍্যান্ডম ব্লাড সুগার (RBS)",
        en: "2. Random Blood Sugar (RBS)",
      },
      { bn: "৩. লিপিড প্রোফাইল (ফাস্টিং)", en: "3. Lipid Profile (Fasting)" },
      { bn: "৪. সিরাম ক্রিয়েটিনিন", en: "4. Serum Creatinine" },
      { bn: "৫. HbsAg", en: "5. HbsAg" },
      { bn: "৬. ইউরিন R/M/E", en: "6. Urine R/M/E" },
      { bn: "৭. ECG", en: "7. ECG" },
      { bn: "৮. এক্স-রে চেস্ট P/A ভিউ", en: "8. X-ray Chest P/A View" },
      { bn: "৯. USG অব হোল অ্যাবডোমেন", en: "9. USG of Whole Abdomen" },
      { bn: "১০. লিভার ফাংশন টেস্ট", en: "10. Liver Function Test" },
      { bn: "১১. সিরাম ইউরিক অ্যাসিড", en: "11. Serum Uric Acid" },
    ],
    price: {
      old: { bn: "৳ ৬,০৫০", en: "৳ 6,050" },
      new: { bn: "৳ ৪,৪০০", en: "৳ 4,400" },
    },
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop",
  },
  {
    title: { bn: "এক্সিকিউটিভ হেলথ প্যাকেজ", en: "Executive Health Package" },
    subtitle: { bn: "(প্যাকেজ - ৩)", en: "(Package - 3)" },
    tests: [
      {
        bn: "১. কমপ্লিট ব্লাড কাউন্ট (CBC)",
        en: "1. Complete Blood Count (CBC)",
      },
      {
        bn: "২. র‍্যান্ডম ব্লাড সুগার (RBS)",
        en: "2. Random Blood Sugar (RBS)",
      },
      { bn: "৩. লিপিড প্রোফাইল (ফাস্টিং)", en: "3. Lipid Profile (Fasting)" },
      { bn: "৪. সিরাম ক্রিয়েটিনিন", en: "4. Serum Creatinine" },
      { bn: "৫. HbsAg", en: "5. HbsAg" },
      { bn: "৬. ইউরিন R/M/E", en: "6. Urine R/M/E" },
      { bn: "৭. ECG", en: "7. ECG" },
      { bn: "৮. এক্স-রে চেস্ট P/A ভিউ", en: "8. X-ray Chest P/A View" },
      { bn: "৯. USG অব হোল অ্যাবডোমেন", en: "9. USG of Whole Abdomen" },
      { bn: "১০. লিভার ফাংশন টেস্ট", en: "10. Liver Function Test" },
    ],
    price: {
      old: { bn: "৳ ১২,৪৪০", en: "৳ 12,440" },
      new: { bn: "৳ ৯,২০০", en: "৳ 9,200" },
    },
    image:
      "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: { bn: "মহিলা হেলথ চেকআপ", en: "Women's Health Checkup" },
    subtitle: { bn: "(প্যাকেজ - ৪)", en: "(Package - 4)" },
    tests: [
      {
        bn: "১. কমপ্লিট ব্লাড কাউন্ট (CBC)",
        en: "1. Complete Blood Count (CBC)",
      },
      { bn: "২. TSH", en: "2. TSH" },
      { bn: "৩. ইউরিন R/M/E", en: "3. Urine R/M/E" },
      { bn: "৪. S. Ferritin", en: "4. S. Ferritin" },
      { bn: "৫. Pap's Smear", en: "5. Pap's Smear" },
      { bn: "৬. ECG", en: "6. ECG" },
      { bn: "৭. এক্স-রে চেস্ট P/A ভিউ", en: "7. X-ray Chest P/A View" },
      { bn: "৮. USG অব হোল অ্যাবডোমেন", en: "8. USG of Whole Abdomen" },
      { bn: "৯. CA-125", en: "9. CA-125" },
      { bn: "১০. CA 15-3", en: "10. CA 15-3" },
    ],
    price: {
      old: { bn: "৳ ৭,৮৩০", en: "৳ 7,830" },
      new: { bn: "৳ ৫,০০০", en: "৳ 5,000" },
    },
    image:
      "https://thehospitalatmaayo.com/wp-content/uploads/2022/02/elderly-female-smiling-with-doctor-visiting-senior-patient-woman-hospital-ward.jpg",
  },
  {
    title: { bn: "কার্ডিয়াক হেলথ চেকআপ", en: "Cardiac Health Checkup" },
    subtitle: { bn: "(প্যাকেজ - ৫)", en: "(Package - 5)" },
    tests: [
      {
        bn: "১. কমপ্লিট ব্লাড কাউন্ট (CBC)",
        en: "1. Complete Blood Count (CBC)",
      },
      {
        bn: "২. র‍্যান্ডম ব্লাড সুগার (RBS)",
        en: "2. Random Blood Sugar (RBS)",
      },
      { bn: "৩. লিপিড প্রোফাইল (ফাস্টিং)", en: "3. Lipid Profile (Fasting)" },
      { bn: "৪. সিরাম ক্রিয়েটিনিন", en: "4. Serum Creatinine" },
      { bn: "৫. Troponin I", en: "5. Troponin I" },
      { bn: "৬. ECG", en: "6. ECG" },
      { bn: "৭. Echo Cardiogram", en: "7. Echo Cardiogram" },
      { bn: "৮. এক্স-রে চেস্ট P/A ভিউ", en: "8. X-ray Chest P/A View" },
      { bn: "৯. USG অব হোল অ্যাবডোমেন", en: "9. USG of Whole Abdomen" },
      { bn: "১০. Exercise Stress Test", en: "10. Exercise Stress Test" },
    ],
    price: {
      old: { bn: "৳ ১০,৫০০", en: "৳ 10,500" },
      new: { bn: "৳ ৭,৯০০", en: "৳ 7,900" },
    },
    image:
      "https://heartexpertsfl.com/wp-content/uploads/2024/12/cropped-doctor-checking-up-heartbeat-senior-patient_1098-20679.jpg",
  },
];

export default function HealthPackages() {
  const { lang } = useI18n();

  const t = (value: Localized) => (lang === "bn" ? value.bn : value.en);

  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={4} sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 500,
            fontSize: { xs: 28, md: 38, lg: 42 },
          }}
        >
          {lang === "bn" ? "হেলথ প্যাকেজ" : "Health Packages"}
        </Typography>
      </Stack>

      {/* First Row: 3 Cards */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
        {healthPackages.slice(0, 3).map((pkg, i) => (
          <Grid
            key={`${t(pkg.title)}-${i}}`}
            sx={{
              xs: 12,
              sm: 6,
              md: 4,
              key: i,
            }}
          >
            <PackageCard pkg={pkg} lang={lang} t={t} />
          </Grid>
        ))}
      </Grid>

      {/* Second Row: 2 Cards */}
      <Grid container spacing={4} justifyContent="center">
        {healthPackages.slice(3, 5).map((pkg, i) => (
          <Grid
            key={`${t(pkg.title)}-${i + 3}}`}
            sx={{
              xs: 12,
              sm: 6,
              md: 4,
              key: i + 3,
            }}
          >
            <PackageCard pkg={pkg} lang={lang} t={t} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
