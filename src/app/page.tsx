"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import PersonAddAltSharpIcon from "@mui/icons-material/PersonAddAltSharp";
import BiotechIcon from "@mui/icons-material/Biotech";
import WifiCalling3Icon from "@mui/icons-material/WifiCalling3";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

import EmailIcon from "@mui/icons-material/Email";

import DoctorCardSlider from "@/components/home/DoctorCardSlider";
import { useI18n } from "@/lib/i18n";
// JSX
import BasicSlider from "@/components/sliders/BasicSlider";
import AdvanceMedicalTest from "@/components/home/AdvanceMedicalTest";
import SpecialistDoctorChamber from "@/components/home/SpecialistChamber";
import HealthPackage from "@/components/home/HealthPackage";

type Localized = {
  bn: string;
  en: string;
};

type LocalizedParagraphs = {
  bn: string[];
  en: string[];
};

type HeroContent = {
  tagline: Localized;
  title: Localized;
  description: LocalizedParagraphs;
};

type QuickAction = {
  icon: React.ElementType;
  label: Localized;
  description: Localized;
  href: string;
};

type ServiceHighlight = {
  title: Localized;
  description: Localized;
  image: string;
};

type JourneyStory = {
  title: Localized;
  paragraphs: Localized[];
  image: string;
  imageRight?: boolean;
};

type ContactColumn = {
  title: Localized;
  items: Localized[];
};

const heroContent: HeroContent = {
  tagline: {
    bn: "আমিন ডায়াগনস্টিকস",
    en: "Amin Diagnostics",
  },
  title: {
    bn: "দীর্ঘ ২ যুগ ধরে কম খরচ, সেরা সেবা",
    en: "Trusted Diagnostics for Over Two Decades",
  },
  description: {
    bn: [
      "আমিন ডায়াগনস্টিক এন্ড মেডিকেল সার্ভিসেস-এ আপনাকে স্বাগতম। কুষ্টিয়া ও ঝিনাইদহ অঞ্চলের মানুষের স্বাস্থ্যসেবায় আমরা একটি আস্থার নাম। আমরা বিশ্বাস করি, একটি সুস্থ জীবন শুরু হয় সঠিক রোগ নির্ণয়ের মাধ্যমে। তাই আমাদের অঙ্গীকার হলো অত্যাধুনিক প্রযুক্তি ও আন্তরিক সেবার সমন্বয়ে আপনাদের সর্বোচ্চ মানের স্বাস্থ্যসেবা নিশ্চিত করা।",

      "আমাদের প্রতিষ্ঠানে রয়েছে আন্তর্জাতিক মানের ল্যাবরেটরি এবং আধুনিক যন্ত্রপাতি, যা প্রতিটি মেডিকেল টেস্টের শতভাগ নির্ভুলতা নিশ্চিত করে। পাশাপাশি, আমাদের সাথে আছেন অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকবৃন্দ, যারা অত্যন্ত যত্নসহকারে সঠিক চিকিৎসা ও পরামর্শ প্রদান করেন। আমরা জানি, নির্ভুল রিপোর্টই সঠিক চিকিৎসার প্রথম এবং প্রধান ধাপ। তাই গুণগত মান ও সেবার ক্ষেত্রে আমরা কখনোই আপোষ করি না।",

      "রোগীর স্বাচ্ছন্দ্য এবং দ্রুত রিপোর্ট প্রদান আমাদের অন্যতম অগ্রাধিকার। কুষ্টিয়া ও ঝিনাইদহের অন্যতম আধুনিক এই ডায়াগনস্টিক সেন্টারে আপনি পাবেন পরিবারের মতো যত্ন। আপনার এবং আপনার পরিবারের সুচিকিৎসার জন্য আমাদের ওপর আস্থা রাখুন। বিশ্বস্ততা, গুণগত মান ও নির্ভুল রিপোর্ট— আমাদের এই তিন মূলমন্ত্রেই আপনার সেবা করতে আমরা সর্বদা প্রস্তুত।",
    ],
    en: [
      "Welcome to Amin Diagnostic and Medical Services, the premier destination for reliable healthcare in Kushtia and Jhenaidah. We are dedicated to setting a new benchmark in medical diagnostics by combining cutting-edge technology with compassionate care. We firmly believe that an accurate diagnosis is the cornerstone of effective treatment, and that is why we strive for perfection in every test we conduct.",
      "Our facility is equipped with state-of-the-art laboratory technology and staffed by a team of highly qualified specialist doctors and skilled technicians. Whether you require routine pathology tests or complex diagnostic procedures, we ensure the highest level of precision and speed. At Amin Diagnostic, we understand the value of your health and time, which is why we are committed to providing error-free reports and expert medical consultations under one roof.",
      "Patient satisfaction and quality assurance are at the heart of our operations. We invite you to experience healthcare defined by trust, excellence, and modernization. Choose Amin Diagnostic and Medical Services for you and your family—where accurate testing meets the right cure.",
    ],
  },
};

const heroQuickActions: QuickAction[] = [
  {
    icon: PersonAddAltSharpIcon,
    label: {
      bn: "ডাক্তার খুঁজুন",
      en: "Find A Doctor",
    },
    description: {
      bn: "মাত্র কয়েক ক্লিকে বুকিং নিশ্চিত করুন",
      en: "Confirm visits in just a few clicks",
    },
    href: "/find-doctor",
  },
  {
    icon: MedicalServicesIcon,
    label: {
      bn: "মেডিকেল টেস্ট",
      en: "Medical Test",
    },
    description: {
      bn: "কুষ্টিয়া ও আশপাশে একই দিনে সেবা",
      en: "Same-day service across Kushtia",
    },
    href: "/medical-test-prices",
  },
  {
    icon: BiotechIcon,
    label: {
      bn: "অনলাইন রিপোর্ট",
      en: "Online Reports",
    },
    description: {
      bn: "২৪/৭ সুরক্ষিত লগইন পোর্টাল",
      en: "Secure portal available 24/7",
    },
    href: "/auth/portal/login",
  },
  {
    icon: WifiCalling3Icon,
    label: {
      bn: "হটলাইন",
      en: "Hotline",
    },
    description: {
      bn: "২৪/৭ সাড়া, দ্রুততম রেসপন্স",
      en: "Always-on hotline with rapid dispatch",
    },
    href: "tel:+8801712243514",
  },
];

const serviceHighlights: ServiceHighlight[] = [
  {
    title: {
      bn: "বিশেষজ্ঞ ডাক্তার চেম্বার",
      en: "Specialist Physician Chamber",
    },
    description: {
      bn: "বিভিন্ন বিভাগের অভিজ্ঞ বিশেষজ্ঞরা নিয়মিত চেম্বার করেন এবং রিপোর্ট অনুযায়ী পরামর্শ প্রদান করেন।",
      en: "Consultants across every major discipline offer on-site clinics and guide patients using their reports.",
    },
    image: "/assets/card115.png",
  },
  {
    title: {
      bn: "উন্নত প্রযুক্তির মেডিকেল টেস্ট",
      en: "Advanced Diagnostic Technology",
    },
    description: {
      bn: "হেমাটোলজি, বায়োকেমিস্ট্রি, ইমিউনোলজি ও মাইক্রোবায়োলজি—সবকিছুই সম্পূর্ণ অটোমেটেড।",
      en: "Automated hematology, biochemistry, immunology and microbiology platforms ensure precise results.",
    },
    image: "/assets/card116.png",
  },
  {
    title: {
      bn: "সমন্বিত রোগী সহায়তা",
      en: "Integrated Patient Support",
    },
    description: {
      bn: "স্যাম্পল কালেকশন থেকে রিপোর্ট হস্তান্তর, কেয়ার কোঅর্ডিনেটর দল আপনার পাশে থাকে।",
      en: "Care coordinators assist from sample collection to report delivery for a seamless experience.",
    },
    image: "/assets/card117.png",
  },
];

const journeyStories: JourneyStory[] = [
  {
    title: {
      bn: "আমিন ডায়াগনস্টিকসের পথচলা",
      en: "Journey of Amin Diagnostics",
    },
    paragraphs: [
      {
        bn: "২০০৩ সালে আমিন ডায়াগনস্টিক তার যাত্রা শুরু করে বাংলাদেশের সাংস্কৃতিক রাজধানী কুষ্টিয়ার প্রাণকেন্দ্রে কোর্টপাড়ায়। 'কম খরচে, সেরা সেবা' সুনিশ্চিত করা এবং বৃহত্তর কুষ্টিয়ার মানুষের জন্য স্বাস্থ্যসেবা খাতের বৈপ্লবিক পরিবর্তনের লক্ষ্যে কিছু উদ্যমী মানুষ শুরু করে পরাজিত না হতে চাওয়া এক সংগ্রাম। সেই সময়ে যোগাযোগ ব্যবস্থা বর্তমানের মতো এত উন্নত ছিল না। কুষ্টিয়া থেকে রাজধানী ঢাকা আসা-যাওয়া তখন ছিল অচিন্তনীয়।",
        en: "Amin Diagnostic began its journey in 2003 at Courtpara—the heart of Kushtia, the cultural capital of Bangladesh. Guided by the vision of providing ‘the best services at the lowest cost’ and driven by the dream of bringing transformative change to the healthcare sector of greater Kushtia, a group of passionate individuals started a mission that refused to accept defeat. During those days, communication facilities were nowhere near what they are today. Travelling from Kushtia to the capital, Dhaka, was almost unimaginable.",
      },
      {
        bn: "বিশ্ববিখ্যাত ব্র্যান্ডের বিশ্বসেরা প্রযুক্তির সকল মেশিনারিজ, সেরা ও অভিজ্ঞ টেকনিশিয়ান এবং সকল বিভাগে বিশেষজ্ঞ পর্যায়ের চিকিৎসকবৃন্দকে সাথে নিয়ে বিগত ২২ বছর ধরে আমিন ডায়াগনস্টিক বৃহত্তর কুষ্টিয়ায় শীর্ষ পর্যায়ে থেকে স্বাস্থ্যসেবা নিয়ে কাজ করে যাচ্ছে।",
        en: "For the past 22 years, Amin Diagnostic has been operating as a leading healthcare institution in the greater Kushtia region, equipped with world-renowned diagnostic technology, globally trusted machinery, highly skilled technicians, and specialist physicians across all departments.",
      },
      {
        bn: "মানসম্মত এবং উন্নতমানের স্বাস্থ্যসেবা দেওয়ার জন্য আমিন ডায়াগনস্টিক কুষ্টিয়ার পার্শ্ববর্তী জেলা ঝিনাইদহের প্রাণকেন্দ্রে বনানীপাড়াতে তার দ্বিতীয় শাখা চালু করার সিদ্ধান্ত নেয়। এই প্রতিষ্ঠান সকলের ঐকান্তিক প্রচেষ্টা ও সকলের আন্তরিক সমর্থনে ১ জানুয়ারি ২০২৫ আমিন ডায়াগনস্টিক সেন্টার - ঝিনাইদহ শাখা এর কার্যক্রম সফলভাবে শুরু হয়।",
        en: "To ensure advanced and quality healthcare for all, Amin Diagnostic decided to expand its services and opened its second branch in the heart of Jhenaidah, at Bonanipara. With the sincere efforts of everyone involved and the wholehearted support of the community, Amin Diagnostic Center—Jhenaidah Branch officially began its operations on 1 January 2025.",
      },
      {
        bn: "চিকিকৎসা সেবার লক্ষ্য অর্জনে ঝিনাইদহবাসীর আন্তরিক সমর্থন, স্বাস্থ্যসেবা সেক্টরে কর্মরত প্রত্যেকটি ব্র্যক্তিবর্গ ও বিশেষভাবে সকল বিশেষজ্ঞ এবং চিকিৎসকবৃন্দের আন্তরিক সহযোগিতা প্রয়োজন। আমিন ডায়াগনস্টিক কর্তৃপক্ষ সকলের দোয়া ও সমর্থন প্রত্যাশী।",
        en: "To achieve excellence in healthcare services, we seek the continued support of the people of Jhenaidah, every professional working in the medical sector, and especially the valued cooperation of specialist doctors. The Amin Diagnostic authority humbly seeks everyone’s prayers and support.",
      },
    ],
    image: "/assets/SHR01164.jpg",
    imageRight: true,
  },
  {
    title: {
      bn: "আমিন ডায়াগনস্টিক এর লক্ষ্য ও উদ্দেশ্য:",
      en: "Amin Diagnostic — Our Vision & Mission:",
    },
    paragraphs: [
      {
        bn: "আমিন ডায়াগনস্টিক এর লক্ষ্য কম খরচে, সেরা স্বাস্থ্যসেবা সকল মানুষের দ্বারপ্রান্তে পৌঁছে দেওয়া। সময়ের সাথে তালমিলিয়ে বিশ্বসেরা ও সর্বাধুনিক প্রযুক্তির মেশিনারিজ ও সর্বোচ্চ আধুনিক দক্ষতার মিলবন্ধনে উন্নতমানের আধুনিক সেবা প্রদান আমাদের প্রধান উদ্দেশ্য।",
        en: "Our mission is to make high-quality healthcare accessible to everyone at an affordable cost. By combining world-class, innovative diagnostic technology with highly skilled professionals, Amin Diagnostic is committed to delivering modern, reliable, and superior medical services. ",
      },
      {
        bn: "আমিন ডায়াগস্টিক একটি বিশ্বস্ত নাম এবং আপনার স্বাস্থ্য আমাদের প্রথম অগ্রাধিকার। ",
        en: "Amin Diagnostic is a trusted name — because your health is our priority.",
      },
    ],
    image: "/assets/SHR01178.jpg",
  },
];

const contactColumns: ContactColumn[] = [
  {
    title: {
      bn: "যোগাযোগ",
      en: "Contact",
    },
    items: [
      { bn: "হটলাইন: ০১৭১২-২৪৩৫১৪", en: "Hotline: 01712-243514" },
      {
        bn: "রিপোর্ট সাপোর্ট: ০১৭১০-৬৬৭৭৩৫",
        en: "Report Support: 01710-667735",
      },
      {
        bn: "ই-মেইল: care@amindiagnostics.net",
        en: "E-Mail: care@amindiagnostics.net",
      },
    ],
  },
  {
    title: {
      bn: "সেবা সময়",
      en: "Service Hours",
    },
    items: [
      {
        bn: "শনিবার - বৃহস্পতিবার: সকাল ৮টা - রাত ১০টা",
        en: "Sat - Thu: 8:00 AM - 10:00 PM",
      },
      { bn: "শুক্রবার: সকাল ৮টা - দুপুর ২টা", en: "Friday: 8:00 AM - 2:00 PM" },
      { bn: "২৪/৭ জরুরি স্যাম্পল কালেকশন", en: "Emergency collection 24/7" },
    ],
  },
  {
    title: {
      bn: "সেন্টার ঠিকানা",
      en: "Center Address",
    },
    items: [
      { bn: "১০৫, কলেজ রোড, কুষ্টিয়া", en: "105 College Road, Kushtia" },
      {
        bn: "ডায়াবেটিক অ্যাসোসিয়েশন সংলগ্ন",
        en: "Adjacent to Diabetic Association",
      },
      {
        bn: "গুগল ম্যাপস: Amin Diagnostics",
        en: "Google Maps: Amin Diagnostics",
      },
    ],
  },
];

export default function HomePage() {
  const { lang } = useI18n();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const t = React.useCallback(
    (value: Localized) => (lang === "bn" ? value.bn : value.en),
    [lang],
  );
  return (
    <Box
      sx={{
        maxWidth: "100vw",
        justifyContent: "center",
      }}
    >
      <Stack
        sx={{
          py: { xs: 4, md: 4, lg: 4 },
        }}
      >
        <Box component="section">
          <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
            {/* Left: Text + Quick Actions */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack
                spacing={2}
                sx={{ height: "100%", justifyContent: "space-between" }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: { xs: 14, md: 14, lg: 14 },
                      textTransform: "uppercase",
                    }}
                  >
                    {t(heroContent.tagline)}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 500,
                      lineHeight: 1.2,
                      fontSize: { xs: 32, md: 32, lg: 40 },
                      mt: 1,
                    }}
                  >
                    {t(heroContent.title)}
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 4, mb: 2 }}>
                    {heroContent.description[lang === "bn" ? "bn" : "en"].map(
                      (paragraph) => (
                        <Typography
                          key={`${lang}-paragraph-${paragraph
                            .slice(0, 20)
                            .replace(/\s+/g, "-")}`}
                          color="text.primary"
                          sx={{
                            fontSize: { xs: 16, md: 18, lg: 18 },
                            textAlign: "justify",
                            lineHeight: 1.5,
                          }}
                        >
                          {paragraph}
                        </Typography>
                      ),
                    )}
                  </Stack>
                </Box>

                <Grid container spacing={4}>
                  {heroQuickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Grid size={{ xs: 6, sm: 6, md: 3 }} key={action.href}>
                        <Box
                          component={Link}
                          href={action.href}
                          sx={(theme) => ({
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            backgroundColor: "primary.main",
                            color: "background.paper",
                            borderRadius: 2,
                            py: { xs: 2, md: 2.5 },
                            px: { xs: 1.5, md: 2 },
                            textDecoration: "none",
                            textAlign: "center",
                            minHeight: { xs: 80, md: 90 },
                            border: `1px solid ${theme.palette.divider}`,
                            transition:
                              "transform 0.2s ease, box-shadow 0.2s ease",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
                            },
                          })}
                        >
                          <Icon sx={{ fontSize: { xs: 28, md: 32 } }} />
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 500,
                              fontSize: { xs: 13, md: 14 },
                              lineHeight: 1.2,
                            }}
                          >
                            {t(action.label)}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Stack>
            </Grid>

            {/* Right: Doctor slider */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <DoctorCardSlider />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Stack>
      <br />
      <Box component="section" sx={{ gap: 0, borderRadius: 1, mt: 4, mb: 4 }}>
        <br />
        <Stack spacing={2} sx={{ mb: { xs: 3, md: 5 } }}>
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              fontWeight: 400,
              fontSize: { xs: 28, md: 38, lg: 42 },
            }}
          >
            {lang === "bn" ? "আমাদের সেবাসমূহ" : "Our Services"}
          </Typography>
          <br />
        </Stack>
        <Grid container spacing={{ xs: 12, md: 2, lg: 3 }}>
          {serviceHighlights.map((card) => (
            <Grid size={{ xs: 12, md: 4 }} key={card.image}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  minHeight: 220,
                }}
              >
                <Image
                  src={card.image || "/placeholder.svg"}
                  alt={t(card.title)}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  style={{ objectFit: "cover", borderRadius: 3 }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    p: { xs: 3, md: 4 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                ></Box>
              </Box>
              <br />
            </Grid>
          ))}
        </Grid>
        <br />
        <br />
        <Box
          component="section"
          sx={{ gap: 4, borderRadius: 1, aspectRatio: 3 / 1 }}
        >
          <BasicSlider />
        </Box>
      </Box>
      <br />
      <br />
      {/* বিশেষজ্ঞ ডাক্তার চেম্বার */}
      <Box
        component="section"
        sx={{
          position: "relative",
          width: "100vw",
          // To Pulls it to the left edge to cancel container padding/margin
          ml: "calc(-50vw + 50%)",
          py: { xs: 8, md: 12, lg: 10 },
          // Vertical padding inside the section
          overflow: "hidden",
        }}
      >
        {/* Dark overlay + blurred background */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/assets/background/home/doc.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              edge: 1.5,
              backgroundColor: isDarkMode
                ? "rgba(3, 31, 26, 0.24)"
                : "rgba(89, 213, 220, 0.24)",
              backdropFilter: "blur(8px)",
            },
          }}
        />

        {/* Content on top of background */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={5} alignItems="center">
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: 400,
                fontSize: { xs: 32, md: 42, lg: 50 },
                color: "theme.primary",
              }}
            >
              {lang === "bn" ? "বিশেষজ্ঞ ডাক্তার চেম্বার" : "Specialist Clinics"}
            </Typography>
            {/*  specialist chamber component */}
            <SpecialistDoctorChamber />
          </Stack>
        </Box>
      </Box>
      <br />
      <br />
      <br />
      <AdvanceMedicalTest />
      <br />
      <Box
        component="section"
        sx={{ justifyContent: "center", display: "flex-start" }}
      >
        {/* <br /> */}
        <br />
        <br />
        <HealthPackage />
      </Box>
      <br />
      <br />
      <br />
      <Box component="section">
        <Stack spacing={{ lg: 12, md: 7 }}>
          {journeyStories.map((story) => (
            <Grid
              container
              spacing={{ xs: 7, md: 5 }}
              key={story.title.bn}
              sx={{
                textAlign: "justify",
              }}
              direction={
                story.imageRight ? "row" : { xs: "column", md: "row-reverse" }
              }
            >
              <Grid size={{ xs: 6, md: 6 }}>
                <Stack spacing={4}>
                  <Typography
                    variant="h4"
                    sx={{
                      textAlign: "justify",
                      fontWeight: 900,
                      fontSize: { xs: 28, md: 34 },
                    }}
                  >
                    {t(story.title)}
                  </Typography>
                  <Stack spacing={1} color="text.secondary">
                    {story.paragraphs.map((para) => (
                      <Typography
                        key={para.bn}
                        sx={{ fontSize: 16, textAlign: "justify" }}
                      >
                        {t(para)}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    textAlign: "justify",
                    height: "100%",
                    minHeight: { xs: 240, md: 320 },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Image
                      src={story.image || "/placeholder.svg"}
                      alt={t(story.title)}
                      fill
                      sizes="(max-width: 400px) 90vw, 520px"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                  <br />
                </Paper>
              </Grid>
            </Grid>
          ))}
        </Stack>
      </Box>
      <br />
      <Box
        component="section"
        sx={{
          borderRadius: 2,
          p: { xs: 3, md: 5 },
          border: (theme) => `2px solid ${theme.palette.divider}`,
          boxShadow: isDarkMode
            ? "0 18px 40px rgba(239, 234, 234, 0.12)"
            : "0 18px 40px rgba(0,0,0,0.12)",
        }}
      >
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, fontSize: { xs: 28, md: 34 } }}
              >
                {lang === "bn"
                  ? "প্রশ্ন আছে? সবসময় আমরা পাশে"
                  : "Have a question? We are here for you"}
              </Typography>
              <Typography color="text.secondary">
                {lang === "bn"
                  ? "রিপোর্ট বুঝতে পরামর্শ, প্যাকেজ নির্বাচন কিংবা জরুরি সহায়তা—আমাদের কেয়ার টিম যেকোনো সময় যোগাযোগের জন্য প্রস্তুত।"
                  : "Need support choosing a package, understanding your report or finding urgent help? Our care team is always ready to assist."}
              </Typography>
              <Button
                component={Link}
                href="tel:01712243514"
                variant="contained"
                size="large"
              >
                {lang === "bn" ? "হটলাইনে কল করুন" : "Call the Hotline"}
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 0.5,
                height: "100%",
                border: (theme) => `1px dashed ${theme.palette.primary.main}`,
                backgroundColor: "rgba(255,255,255,0.22)",
              }}
            >
              <Stack spacing={{ xs: 2.5, md: 3.5 }}>
                {contactColumns.map((column) => (
                  <Box key={column.title.bn}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 800, mb: 1 }}
                    >
                      {t(column.title)}
                    </Typography>
                    <Stack spacing={2.5} gap={1.5} color="text.secondary">
                      {column.items.map((item) => (
                        <Typography key={item.bn}>{t(item)}</Typography>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <br />
      <Box
        component="section"
        sx={{
          borderRadius: 4,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          p: { xs: 3, md: 4 },
          display: "grid",
          gap: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <EmailIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 20 } }}>
            {lang === "bn"
              ? "আপনার রিপোর্ট ই-মেইলে পেতে চান? care@amindiagnostics.net এ মেইল করুন"
              : "Want reports over email? Write to care@amindiagnostics.net"}
          </Typography>
        </Stack>
        <Typography color="text.secondary">
          {lang === "bn"
            ? "আমরা রোগীর তথ্যের নিরাপত্তা নিশ্চিত করতে আন্তর্জাতিক মানদণ্ড অনুসরণ করি। প্রতিটি ডিজিটাল রিপোর্ট এনক্রিপ্টেড এবং ভেরিফাইড পোর্টালের মাধ্যমে সরবরাহ করা হয়।"
            : "We protect patient data with global best practices. Every digital report is encrypted and delivered via a verified portal."}
        </Typography>
      </Box>
    </Box>
  );
}
