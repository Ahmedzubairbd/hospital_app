"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import Bullet from "@/components/common/Bullet"


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
      {/* === Services / Offerings === */}
      <Box sx={{ mt: { xs: 4, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
    <Stack spacing={1} sx={{ mb: 2 }}>
      <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
        {lang === "bn" ? "AMIN DIAGNOSTICS" : "AMIN DIAGNOSTICS"}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
        {lang === "bn" ? "আমাদের সেবাসমূহ" : "Our Services"}
      </Typography>
      <Typography color="text.secondary">
        {lang === "bn"
          ? "আমিন ডায়াগনস্টিক এ আমরা আধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসকদের সহায়তায় নিম্নলিখিত সেবা প্রদান করি:"
          : "At Amin Diagnostics, we combine modern technology and expert physicians to offer the following services:"}
      </Typography>
    </Stack>
  </motion.div>

  {/* Cards Row */}
  <Grid container spacing={3}>
    {/* Card 1 — Diagnostic Services */}
    <Grid size={{ xs: 12, md: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        whileHover={{ y: -4 }}
      >
        <Paper sx={{ p: 2.25, overflow: "hidden" }}>
          <Box
            component="img"
            src="/assets/doc_1.JPG"
            alt="Diagnostic Lab"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 1.5,
              mb: 1.5,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            {lang === "bn" ? "ডায়াগনস্টিক সেবা" : "Diagnostic Services"}
          </Typography>
          <Stack spacing={1}>
            <Bullet>
              {lang === "bn"
                ? "অত্যাধুনিক ল্যাবে বিশ্বসেরা ব্র্যান্ডের মেশিনে পরীক্ষা-নীরিক্ষা"
                : "State-of-the-art analyzers from top global brands"}
            </Bullet>
            <Bullet>
              {lang === "bn"
                ? "FNAC, হিস্টোপ্যাথলজি ও যাবতীয় ক্যান্সার স্ক্রিনিং"
                : "FNAC, histopathology & comprehensive cancer screening"}
            </Bullet>
            <Bullet>
              {lang === "bn"
                ? "স্ব স্ব বিভাগে বিশেষজ্ঞ চিকিৎসকের পরামর্শ"
                : "Consultations with specialists in respective departments"}
            </Bullet>
          </Stack>
        </Paper>
      </motion.div>
    </Grid>

    {/* Card 2 — Health Check Packages */}
    <Grid size={{ xs: 12, md: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        whileHover={{ y: -4 }}
      >
        <Paper sx={{ p: 2.25, overflow: "hidden" }}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1600&auto=format&fit=crop"
            alt="Health Check Packages"
            sx={{
              width: "100%",
              height:"100%",
              objectFit: "cover",
              borderRadius: 1.5,
              mb: 1.5,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            {lang === "bn" ? "স্বাস্থ্য পরীক্ষা প্যাকেজ" : "Health Check Packages"}
          </Typography>
          <Stack spacing={1}>
            <Bullet>
              {lang === "bn"
                ? "হোম/অফিস স্যাম্পল কালেকশন সুবিধা"
                : "Home/office sample collection available"}
            </Bullet>
            <Bullet>
              {lang === "bn"
                ? "ইমেজিং ও বিশেষ পরীক্ষা: আল্ট্রাসাউন্ড, ডিজিটাল এক্স-রে, সিটি স্ক্যান"
                : "Imaging & specials: Ultrasound, Digital X-ray, CT scan"}
            </Bullet>
            <Bullet>
              {lang === "bn"
                ? "কার্ডিয়াক ইমেজিং, ইসিজি, ইটিটি, ইকোকার্ডিওগ্রাম"
                : "Cardiac imaging, ECG, ETT, Echocardiogram"}
            </Bullet>
          </Stack>
        </Paper>
      </motion.div>
    </Grid>

    {/* Card 3 — Clinical Services */}
    <Grid size={{ xs: 12, md: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        whileHover={{ y: -4 }}
      >
        <Paper sx={{ p: 2.25, overflow: "hidden" }}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1600&auto=format&fit=crop"
            alt="Clinical Services"
            sx={{
              width: "100%",
              height:"100%",
              objectFit: "cover",
              borderRadius: 1.5,
              mb: 1.5,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            {lang === "bn" ? "ক্লিনিকাল সেবা" : "Clinical Services"}
          </Typography>
          <Stack spacing={1}>
            <Bullet>
              {lang === "bn"
                ? "মেডিসিন, শিশু, গাইনী, ইএনটি, হৃদরোগ, অর্থোপেডিক, ইউরোলজি"
                : "Medicine, Pediatrics, Gynae, ENT, Cardiology, Ortho, Urology"}
            </Bullet>
            <Bullet>
              {lang === "bn"
                ? "চর্মরোগ, গ্যাস্ট্রো, নিউরো, ডায়াবেটিস ও থাইরয়েড"
                : "Dermatology, Gastro, Neuro, Diabetes & Thyroid"}
            </Bullet>
            <Bullet>
              {lang === "bn"
                ? "ক্যান্সার, মানসিক স্বাস্থ্য ও আরও বিশেষায়িত বিভাগ"
                : "Oncology, Mental Health & other specialties"}
            </Bullet>
          </Stack>
        </Paper>
      </motion.div>
    </Grid>
  </Grid>

  {/* Closing Statement */}
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.45, delay: 0.1 }}
  >
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography>
        {lang === "bn"
          ? "আমাদের লক্ষ্য, প্রতিটি রোগীকে সর্বোচ্চ যত্ন ও নির্ভুল রোগ নির্ণয়ের মাধ্যমে সুস্থ জীবনের পথে এগিয়ে দেওয়া।"
          : "Our goal is to empower every patient toward a healthier life through precise diagnostics and compassionate care."}
      </Typography>
    </Paper>
  </motion.div>
  </Box>
    </Box>
    
  );
}

