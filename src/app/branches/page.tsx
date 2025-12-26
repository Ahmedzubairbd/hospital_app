"use client";

import * as React from "react";
import {
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ScienceIcon from "@mui/icons-material/Science";
import MedicationIcon from "@mui/icons-material/Medication";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

type BranchKey = "kushtia" | "jhenaidah";

const branchHighlights: Record<
  BranchKey,
  {
    titleBn: string;
    titleEn: string;
    addressBn: string;
    addressEn: string;
    introBn: string;
    introEn: string;
    hours: Array<{
      labelBn: string;
      labelEn: string;
      valueBn: string;
      valueEn: string;
    }>;
    focusBn: string[];
    focusEn: string[];
  }
> = {
  kushtia: {
    titleBn: "কুষ্টিয়া শাখা",
    titleEn: "Kushtia Branch",
    addressBn: "কোর্টপাড়া, কুষ্টিয়া",
    addressEn: "Courtpara, Kushtia",
    introBn:
      "আমাদের ফ্ল্যাগশিপ শাখা যেখানে ২০০৩ সাল থেকে বৃহত্তর কুষ্টিয়ার রোগীদের জন্য উন্নত পরীক্ষার সেবা হয়ে উঠেছে বিশ্বস্ত নাম।",
    introEn:
      "Our flagship centre since 2003, trusted by patients from across greater Kushtia for comprehensive diagnostics and specialist care.",
    hours: [
      {
        labelBn: "শনিবার – বৃহস্পতিবার",
        labelEn: "Saturday – Thursday",
        valueBn: "সকাল ৮টা – রাত ১০টা",
        valueEn: "8:00 AM – 10:00 PM",
      },
      {
        labelBn: "শুক্রবার",
        labelEn: "Friday",
        valueBn: "সকাল ৯টা – বিকাল ৫টা",
        valueEn: "9:00 AM – 5:00 PM",
      },
    ],
    focusBn: [
      "২৪/৭ জরুরি স্যাম্পল প্রসেসিং সহায়তা",
      "বিশ্বমানের ল্যাবরেটরি মেশিনে সম্পূর্ণ অটোমেশন",
      "সকল বিভাগের বিশেষজ্ঞ চিকিৎসক প্যানেল",
    ],
    focusEn: [
      "24/7 support for urgent sample processing",
      "Fully automated laboratory equipment from global brands",
      "Multi-specialty consultant panel on-site",
    ],
  },
  jhenaidah: {
    titleBn: "ঝিনাইদহ শাখা",
    titleEn: "Jhenaidah Branch",
    addressBn: "বনানীপাড়া, ঝিনাইদহ",
    addressEn: "Bonanipara, Jhenaidah",
    introBn:
      "২০২৫ সালে যাত্রা শুরু করা ঝিনাইদহ শাখা শিগগিরই আধুনিক সেবা, দ্রুত রিপোর্টিং ও ডিজিটাল ফলো-আপ এর জন্য জনপ্রিয় হয়েছে।",
    introEn:
      "Opened in 2025, the Jhenaidah branch rapidly became the go-to diagnostic destination for modern care, fast reporting, and digital follow-up.",
    hours: [
      {
        labelBn: "রবিবার – বৃহস্পতিবার",
        labelEn: "Sunday – Thursday",
        valueBn: "সকাল ৮টা – রাত ৯টা",
        valueEn: "8:00 AM – 9:00 PM",
      },
      {
        labelBn: "শুক্রবার",
        labelEn: "Friday",
        valueBn: "সকাল ১০টা – বিকাল ৫টা",
        valueEn: "10:00 AM – 5:00 PM",
      },
    ],
    focusBn: [
      "হোম স্যাম্পল কালেকশন ও অনলাইন রিপোর্টিং",
      "উন্নত ইমেজিং ও কার্ডিয়াক স্ক্রিনিং সুবিধা",
      "ঝিনাইদহ ও পার্শ্ববর্তী জেলার জন্য বিশেষজ্ঞ সেবা",
    ],
    focusEn: [
      "Home sample collection with digital reporting",
      "Advanced imaging and cardiac screening facilities",
      "Specialist coverage for Jhenaidah and nearby districts",
    ],
  },
};

const toggleMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function BranchesPage() {
  const { lang } = useI18n();
  const [branch, setBranch] = React.useState<BranchKey>("kushtia");

  const copy = branchHighlights[branch];

  const tx = (bn: string, en: string) => (lang === "bn" ? bn : en);

  const handleToggle = (
    _: React.MouseEvent<HTMLElement>,
    value: BranchKey | null,
  ) => {
    if (value) setBranch(value);
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Paper
        variant="outlined"
        sx={(theme) => ({
          mb: 3,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.08,
          )}, ${alpha(theme.palette.background.paper, 0.95)})`,
        })}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography
              variant="overline"
              color="primary"
              sx={{ fontWeight: 800, letterSpacing: 2 }}
            >
              {tx("আমিন ডায়াগনস্টিক", "Amin Diagnostic")}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              {tx("আমাদের শাখাসমূহ", "Our Branches")}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
              {tx(
                "আপনার নিকটস্থ শাখা নির্বাচন করে সেবার সময়সূচি, ঠিকানা ও বিশেষ সুবিধা সম্পর্কে জানুন।",
                "Choose the branch nearest to you to explore visiting hours, location, and signature services.",
              )}
            </Typography>
          </Stack>

          <ToggleButtonGroup
            value={branch}
            exclusive
            onChange={handleToggle}
            color="primary"
            sx={{ flexWrap: "wrap" }}
          >
            <ToggleButton value="kushtia">
              {tx("কুষ্টিয়া শাখা", "Kushtia Branch")}
            </ToggleButton>
            <ToggleButton value="jhenaidah">
              {tx("ঝিনাইদহ শাখা", "Jhenaidah Branch")}
            </ToggleButton>
          </ToggleButtonGroup>

          <AnimatePresence mode="wait">
            <motion.div key={branch} {...toggleMotion}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  backgroundImage: (theme) =>
                    theme.palette.mode === "light"
                      ? "linear-gradient(135deg, rgba(25,118,210,0.05), rgba(25, 210, 158, 0.01))"
                      : "linear-gradient(135deg, rgba(15, 35, 28, 0.32), rgba(15, 91, 65, 0.08))",
                }}
              >
                <Stack spacing={3}>
                  <Stack spacing={1.2}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 800, lineHeight: 1.1 }}
                    >
                      {tx(copy.titleBn, copy.titleEn)}
                    </Typography>
                    <Typography color="text.secondary">
                      {tx(copy.introBn, copy.introEn)}
                    </Typography>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationOnIcon color="primary" />
                          <Stack spacing={0.25}>
                            <Typography variant="body2" color="text.secondary">
                              {tx("ঠিকানা", "Address")}
                            </Typography>
                            <Typography fontWeight={600}>
                              {tx(copy.addressBn, copy.addressEn)}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Divider flexItem />

                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <AccessTimeIcon color="primary" />
                            <Typography variant="body2" color="text.secondary">
                              {tx("সেবা সময়সূচি", "Service Hours")}
                            </Typography>
                          </Stack>
                          <Stack spacing={0.75}>
                            {copy.hours.map((row) => (
                              <Stack
                                key={row.labelEn}
                                direction="row"
                                justifyContent="space-between"
                                sx={{
                                  borderRadius: 1,
                                  px: 1.25,
                                  py: 0.75,
                                  backgroundColor: (theme) =>
                                    theme.palette.action.hover,
                                }}
                              >
                                <Typography fontWeight={600}>
                                  {tx(row.labelBn, row.labelEn)}
                                </Typography>
                                <Typography color="text.secondary">
                                  {tx(row.valueBn, row.valueEn)}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Stack>

                        <Divider flexItem />

                        <Typography variant="body2" color="text.secondary">
                          {tx(
                            "যেকোনো সহায়তার জন্য পোর্টালের সাপোর্ট চ্যাট অথবা অন-সাইট হেল্প ডেস্ক ব্যবহার করুন।",
                            "For assistance, use the portal support chat or visit the on-site help desk.",
                          )}
                        </Typography>
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                      <Stack spacing={2}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {tx(
                            "বিশেষ সেবা ও সুবিধা",
                            "Featured Services & Facilities",
                          )}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          gap={1}
                        >
                          <Chip
                            icon={<ScienceIcon />}
                            label={tx(
                              "উন্নত ল্যাব অটোমেশন",
                              "Advanced Lab Automation",
                            )}
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            icon={<MedicationIcon />}
                            label={tx("বিশেষজ্ঞ ক্লিনিক", "Specialist Clinics")}
                            variant="outlined"
                          />
                          <Chip
                            icon={<LocalShippingIcon />}
                            label={tx(
                              "স্যাম্পল কালেকশন সেবা",
                              "Sample Collection Service",
                            )}
                            variant="outlined"
                          />
                        </Stack>
                        <Stack spacing={1.5}>
                          {copy.focusEn.map((itemEn, index) => (
                            <Paper
                              key={itemEn}
                              variant="outlined"
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                backgroundColor: (theme) =>
                                  theme.palette.mode === "light"
                                    ? "rgba(25, 210, 158, 0.04)"
                                    : "rgba(25, 210, 158, 0.16)",
                              }}
                            >
                              <Typography fontWeight={600}>
                                {lang === "bn"
                                  ? copy.focusBn[index]
                                  : copy.focusEn[index]}
                              </Typography>
                            </Paper>
                          ))}
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
            </motion.div>
          </AnimatePresence>
        </Stack>
      </Paper>
    </Box>
  );
}
