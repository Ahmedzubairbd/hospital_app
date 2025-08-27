"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { lang } = useI18n();

  // Bangla copy (as requested)
  const bnBlocks = [
    "✅ অত্যাধুনিক ল্যাবে সর্বাধুনিক প্রযুক্তির বিশ্বসেরা ব্র্যান্ডের মেশিনে পরীক্ষা-নীরিক্ষা",
    "✅ বিভিন্ন প্রযুক্তির মধ্যে নির্বাচন করুন। যেখানে চার্জন চালানোর জন্য উন্মোচন করা হয়েছে।",
    "✅ আমাদের সেবাসমূহের মধ্যে রয়েছে রক্ত, মূত্র, এক্স-রে, আলট্রাসনোগ্রাম, ইসিজি, ইইজি, ইএমজি, প্যাথলজি, হরমোন টেস্ট এবং আরও অনেক কিছু।",
    "কুষ্টিয়া ও ঝিনাইদহের অন্যতম বিশ্বস্ত ও আধুনিক ডায়াগনস্টিক সেন্টার হিসেবে, আমরা সঠিক রোগ নির্ণয় ও নির্ভরযোগ্য স্বাস্থ্যসেবা প্রদানের অঙ্গীকার নিয়ে কাজ করে যাচ্ছি। আমাদের প্রতিষ্ঠানে রয়েছে আধুনিক প্রযুক্তি সম্পন্ন ল্যাব, অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক এবং উন্নত স্বাস্থ্যসেবা, যা রোগ নির্ণয় ও চিকিৎসার ক্ষেত্রে সর্বোচ্চ নির্ভুলতা নিশ্চিত করে। আমরা বিশ্বাস করি, সঠিক পরীক্ষা মানেই সঠিক চিকিৎসার প্রথম ধাপ, তাই আমরা আপনাকে সর্বোত্তম সেবা দিতে প্রতিশ্রুতিবদ্ধ।",
  ];

  const enBlocks = [
    "✅ World-class analyzers in a modern lab for accurate diagnostics.",
    "✅ Choose across modalities — imaging, pathology, cardiology — all under one roof.",
    "✅ Blood, urine, X-ray, ultrasound, ECG, EEG, EMG, pathology, hormone tests and more.",
    "As a trusted and modern diagnostic center in Kushtia & Jhenaidah, we are committed to precise diagnosis and reliable care with expert physicians and advanced labs. Great treatment starts with great testing.",
  ];

  const bullets = lang === "bn" ? bnBlocks : enBlocks;

  return (
    <Box>
      {/* Hero */}
      <Grid container spacing={3} alignItems="center">
        <Grid size={{ xs: 12, md: 7 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="primary"
                sx={{ fontWeight: 800, letterSpacing: 2 }}
              >
                <LocalHospitalIcon
                  fontSize="small"
                  style={{ verticalAlign: "middle", marginRight: 6 }}
                />
                Amin Diagnostics
              </Typography>
              <Typography
                variant="h3"
                gutterBottom
                sx={{ fontWeight: 900, lineHeight: 1.1 }}
              >
                {lang === "bn"
                  ? "আমাদের ল্যাবে স্বাস্থ্যসেবা"
                  : "Our Lab Provides Health Care"}
              </Typography>
              <Typography color="text.secondary" paragraph>
                {lang === "bn"
                  ? "আমাদের ল্যাবে স্বাস্থ্যসেবা"
                  : "Our Lab Provides Health Care"}
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ mt: 1, flexWrap: "wrap" }}
              >
                <Button
                  component={Link}
                  href="/find-doctor"
                  size="large"
                  variant="contained"
                  startIcon={<LocalHospitalIcon />}
                >
                  {lang === "bn" ? "ডাক্তার খুঁজুন" : "Find a Doctor"}
                </Button>
                <Button
                  component={Link}
                  href="/medical-test-prices"
                  size="large"
                  variant="outlined"
                >
                  {lang === "bn" ? "মেডিকেল টেস্টের দাম" : "Medical Test Prices"}
                </Button>
              </Stack>
            </Stack>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Paper sx={{ p: 3, backdropFilter: "blur(6px)" }}>
              <Typography variant="h6" gutterBottom>
                {lang === "bn" ? "আমাদের সেবাসমূহের মধ্যে রয়েছে" : "Our Services"}
              </Typography>
              <Stack spacing={1.2}>
                {bullets.slice(0, 3).map((line, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    spacing={1.2}
                    alignItems="flex-start"
                  >
                    <CheckCircleIcon color="primary" fontSize="small" />
                    <Typography sx={{ mt: "2px" }}>
                      {line.replace(/^✅\s?/, "")}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Long paragraph block */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography sx={{ whiteSpace: "pre-line" }}>{bullets[3]}</Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}
