"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function ServicesPage() {
  const { lang } = useI18n();
  const tx = (bn: string, en: string) => (lang === "bn" ? bn : en);

  const fadeIn = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const section = (
    titleBn: string,
    titleEn: string,
    children: React.ReactNode,
    defaultExpanded = false,
  ) => (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn}
    >
      <Accordion
        defaultExpanded={defaultExpanded}
        sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" fontWeight={700}>
            {tx(titleBn, titleEn)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>{children}</Stack>
        </AccordionDetails>
      </Accordion>
    </motion.div>
  );

  const Card = ({
    titleBn,
    titleEn,
    itemsBn,
    itemsEn,
  }: {
    titleBn: string;
    titleEn: string;
    itemsBn: string[];
    itemsEn: string[];
  }) => (
    <Paper
      elevation={0}
      sx={(t) => ({
        p: 2,
        height: "100%",
        borderRadius: 2,
        border: `1px solid ${t.palette.divider}`,
        background: alpha(t.palette.background.paper, 0.7),
      })}
    >
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        {tx(titleBn, titleEn)}
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Stack component="ul" sx={{ pl: 2 }} spacing={0.5}>
        {(lang === "bn" ? itemsBn : itemsEn).map((it, idx) => (
          <Typography key={idx} component="li" variant="body2">
            {it}
          </Typography>
        ))}
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ position: "relative", zIndex: 2 }}>
      <Box
        component={motion.section}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={(t) => ({
          mb: 3,
          px: { xs: 2, sm: 3 },
          py: 4,
          borderRadius: 3,
          background: `linear-gradient(180deg, ${alpha(t.palette.primary.main, 0.12)}, ${alpha(t.palette.background.paper, 0.6)})`,
          border: `1px solid ${alpha(t.palette.primary.main, 0.25)}`,
        })}
      >
        <Typography variant="overline" color="text.secondary">
          {tx("আমাদের সেবাসমূহ", "Our Services")}
        </Typography>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          {tx(
            "সেরা সেবা, উন্নত প্রযুক্তি, বিশ্বস্ত যত্ন",
            "Quality Care, Advanced Technology, Trusted Service",
          )}
        </Typography>
        <Typography color="text.secondary">
          {tx(
            "আমিন ডায়াগনস্টিকে আমরা বিশ্বমানের প্রযুক্তি ও অভিজ্ঞ বিশেষজ্ঞদের সমন্বয়ে বিস্তৃত ডায়াগনস্টিক, ইমেজিং ও ক্লিনিকাল সেবা প্রদান করি।",
            "At Amin Diagnostic, we combine world‑class technology with experienced specialists to deliver comprehensive diagnostic, imaging, and clinical services.",
          )}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
          <Chip
            label={tx("ডায়াগনস্টিক", "Diagnostics")}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={tx("ইমেজিং", "Imaging")}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={tx("ক্লিনিকাল", "Clinical")}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={tx("অনলাইন রিপোর্ট", "Online Reports")}
            variant="outlined"
          />
          <Chip
            label={tx("স্যাম্পল কালেকশন", "Home Sample Collection")}
            variant="outlined"
          />
        </Stack>
      </Box>

      {section(
        "আমিন ডায়াগনস্টিক এর ইতিবৃত্ত",
        "Amin Diagnostic: Our Story",
        <>
          <Typography>
            {tx(
              "২০০৩ সালে আমিন ডায়াগনস্টিক তার যাত্রা শুরু করে বাংলাদেশের সাংস্কৃতিক রাজধানী কুষ্টিয়ার প্রাণকেন্দ্রে কোর্টপাড়ায়। 'কম খরচে, সেরা সেবা' সুনিশ্চিত করা এবং বৃহত্তর কুষ্টিয়ার মানুষের জন্য স্বাস্থ্যসেবা খাতের বৈপ্লবিক পরিবর্তনের লক্ষ্যে কিছু উদ্যমী মানুষ শুরু করে পরাজিত না হতে চাওয়া এক সংগ্রাম। সেই সময়ে যোগাযোগ ব্যবস্থা বর্তমানের মতো এত উন্নত ছিল না। কুষ্টিয়া থেকে রাজধানী ঢাকা আসা-যাওয়া তখন ছিল অচিন্তনীয়।",
              "Amin Diagnostic began its journey in 2003 at Courtpara, the heart of Kushtia — the cultural capital of Bangladesh. With the vision of ‘best service at affordable cost’ and a mission to transform healthcare in greater Kushtia, a group of determined pioneers set out on a path that refused to accept defeat. At that time, transport infrastructure was far from today’s standards; traveling between Kushtia and the capital Dhaka felt almost unthinkable.",
            )}
          </Typography>
          <Typography>
            {tx(
              "বিশ্ববিখ্যাত ব্র্যান্ডের বিশ্বসেরা প্রযুক্তির সকল মেশিনারিজ, সেরা ও অভিজ্ঞ টেকনিশিয়ান এবং সকল বিভাগে বিশেষজ্ঞ পর্যায়ের চিকিৎসকবৃন্দকে সাথে নিয়ে বিগত ২২ বছর ধরে আমিন ডায়াগনস্টিক বৃহত্তর কুষ্টিয়ায় শীর্ষ পর্যায়ে থেকে স্বাস্থ্যসেবা নিয়ে কাজ করে যাচ্ছে।",
              "Equipped with world‑renowned brands, state‑of‑the‑art technologies, skilled technologists, and specialist physicians across departments, Amin Diagnostic has led healthcare services in greater Kushtia for the past 22 years.",
            )}
          </Typography>
          <Typography>
            {tx(
              "মানসম্মত এবং উন্নতমানের স্বাস্থ্যসেবা দেওয়ার জন্য আমিন ডায়াগনস্টিক কুষ্টিয়ার পার্শ্ববর্তী জেলা ঝিনাইদহের প্রাণকেন্দ্রে বনানীপাড়াতে তার দ্বিতীয় শাখা চালু করার সিদ্ধান্ত নেয়। এই প্রতিষ্ঠান সকলের ঐকান্তিক প্রচেষ্টা ও সকলের আন্তরিক সমর্থনে ১ জানুয়ারি ২০২৫ আমিন ডায়াগনস্টিক সেন্টার - ঝিনাইদহ শাখা এর কার্যক্রম সফলভাবে শুরু হয়।",
              "To deliver quality care even more widely, Amin Diagnostic decided to open its second branch at Bonanipara in the heart of Jhenaidah. With sincere effort and support from all, the Jhenaidah branch successfully commenced operations on January 1, 2025.",
            )}
          </Typography>
          <Typography>
            {tx(
              "চিকিকৎসা সেবার লক্ষ্য অর্জনে ঝিনাইদহবাসীর আন্তরিক সমর্থন, স্বাস্থ্যসেবা সেক্টরে কর্মরত প্রত্যেকটি ব্র্যক্তিবর্গ ও বিশেষভাবে সকল বিশেষজ্ঞ এবং চিকিৎসকবৃন্দের আন্তরিক সহযোগিতা প্রয়োজন। আমিন ডায়াগনস্টিক কর্তৃপক্ষ সকলের দোয়া ও সমর্থন প্রত্যাশী।",
              "To achieve our healthcare goals, we seek the wholehearted support of the people of Jhenaidah, every professional working in the health sector, and especially the cooperation of all specialists and physicians. The Amin Diagnostic team humbly requests your prayers and support.",
            )}
          </Typography>
        </>,
        true,
      )}
      <br />
      {section(
        "ডায়াগনস্টিক সেবা",
        "Diagnostic Services",
        <>
          <Typography>
            {tx(
              "অত্যাধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসকদের সহায়তায় আমরা নিম্নলিখিত সেবা প্রদান করি:",
              "With advanced technology and experienced physicians, we provide the following diagnostic services:",
            )}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="প্যাথলজি টেস্ট"
                titleEn="Pathology Tests"
                itemsBn={[
                  "রক্ত, মূত্র, মল এবং অন্যান্য শারীরিক তরলের বিভিন্ন ধরনের পরীক্ষা",
                  "সম্পূর্ণ স্বয়ংক্রিয় মেশিনে নির্ভুল ফলাফল",
                ]}
                itemsEn={[
                  "Comprehensive tests of blood, urine, stool, and other body fluids",
                  "Fully automated analyzers for precise results",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="হেমাটোলজি (রক্তবিদ্যা)"
                titleEn="Hematology"
                itemsBn={[
                  "কমপ্লিট ব্লাড পিকচার (CBP), ব্লাড ফিল্ম স্টাডি (PBF)",
                  "টিসি (TC), ডিসি (DC), ইএসআর (ESR), হিমোগ্লোবিন (Hb%), সিবিসি (CBC)",
                  "রেটিকুলোসাইট কাউন্ট, বিটি (BT), সিটি (CT), আরবিসি কাউন্ট",
                  "প্লেটলেট কাউন্ট, প্রোথ্রোম্বিন টাইম, এমপি (MP), পিসিভি (PCV/HCT)",
                  "ইওসিনোফিল কাউন্ট, ব্লাড গ্রুপ ও আরএইচ ফ্যাক্টর",
                ]}
                itemsEn={[
                  "Complete Blood Picture (CBP), Peripheral Blood Film (PBF)",
                  "TC, DC, ESR, Hemoglobin (Hb%), CBC",
                  "Reticulocyte Count, Bleeding Time (BT), Clotting Time (CT), RBC Count",
                  "Platelet Count, Prothrombin Time, MP, PCV/HCT",
                  "Total Eosinophil Count, Blood Group & Rh Factor",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="ক্যান্সার/টিউমার মার্কার"
                titleEn="Cancer/Tumor Markers"
                itemsBn={[
                  "আলফা ফেটো প্রোটিন",
                  "পিএসএ (PSA), ফ্রি পিএসএ",
                  "CA‑125, CEA, CA15‑3, CA19‑9",
                ]}
                itemsEn={[
                  "Alpha‑Fetoprotein (AFP)",
                  "PSA, Free PSA",
                  "CA‑125, CEA, CA15‑3, CA19‑9",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="মল পরীক্ষা"
                titleEn="Stool Tests"
                itemsBn={[
                  "স্টুল R/E, স্টুল OBT, স্টুল C/S",
                  "স্টুল R/E ও M/E, রিডিউসিং সাবস্টেন্স, ইনভারটিগ্রাম",
                ]}
                itemsEn={[
                  "Stool R/E, Stool OBT, Stool C/S",
                  "Stool R/E & M/E, Reducing Substances, Invertegran",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="সেরোলজি"
                titleEn="Serology"
                itemsBn={[
                  "ASO, CRP, VDRL, TPHA, উইডাল",
                  "ডেঙ্গু NS1, ওয়াইল ফেলিক্স, ফেব্রাইল অ্যান্টিজেনস",
                  "CFT/ICT ফর ফাইলেরিয়া, কালা-আজার",
                  "HIV, প্রেগন্যান্সি টেস্ট, AT, CT",
                  "H‑Pylori, ICT ফর ম্যালেরিয়া, কুম্বস টেস্ট (Rh)",
                  "IL‑6, D‑Dimer, Procalcitonin, Anti‑HBs, Anti‑HBe, Anti‑HBc",
                  "IgA/IgM/IgG, সিএফটি ফর ফাইলেরিয়া/কালা‑আজার",
                ]}
                itemsEn={[
                  "ASO, CRP, VDRL, TPHA, Widal",
                  "Dengue NS1, Weil‑Felix, Febrile Antigens",
                  "CFT/ICT for Filaria, Kala‑azar",
                  "HIV, Pregnancy Test, AT, CT",
                  "H‑Pylori, ICT for Malaria, Coombs Test (Rh)",
                  "IL‑6, D‑Dimer, Procalcitonin, Anti‑HBs, Anti‑HBe, Anti‑HBc",
                  "IgA/IgM/IgG, CFT for Filaria/Kala‑azar",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="মূত্র পরীক্ষা"
                titleEn="Urine Tests"
                itemsBn={[
                  "ইউরিন R/E, কিটোন, ইউরোবিলিনোজেন, বাইল সল্ট",
                  "এসপি গ্রাভিটি, বাইল পিগমেন্ট, ইউরিন C/S",
                  "২৪ আওয়ার্স ইউরিন টোটাল প্রোটিন (UTP)",
                ]}
                itemsEn={[
                  "Urine R/E, Ketone, Urobilinogen, Bile Salt",
                  "Specific Gravity, Bile Pigment, Urine C/S",
                  "24‑hour Urine Total Protein (UTP)",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="সুগার প্রোফাইল"
                titleEn="Sugar Profile"
                itemsBn={[
                  "গ্লুকোজ (ফাস্টিং/র‍্যান্ডম), ২ ঘন্টা ব্রেকফাস্ট/গ্লুকোজ পর",
                  "OGTT, HbA1C, PPBS, ইউরিন সুগার",
                ]}
                itemsEn={[
                  "Glucose (Fasting/Random), 2‑hrs after breakfast/75g glucose",
                  "OGTT, HbA1C, PPBS, Corresponding Urine Sugar",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="কিডনি প্রোফাইল"
                titleEn="Kidney Profile"
                itemsBn={[
                  "BUN, ইউরিয়া, মাইক্রো অ্যালবুমিন",
                  "ক্রিয়েটিনিন, ইউরিক অ্যাসিড, EGFR, UPCR",
                ]}
                itemsEn={[
                  "BUN, Urea, Micro‑albumin",
                  "Creatinine, Uric Acid, eGFR, UPCR",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="মাইকোব্যাক‑টিবি কমপ্লেক্স"
                titleEn="Mycobacterium‑TB Complex"
                itemsBn={[
                  "Anti‑TB IgG/IgA/IgM, Hexagon TB, Mantoux (MT)",
                  "Mycobacterium tuberculosis, Tuberculin Test",
                ]}
                itemsEn={[
                  "Anti‑TB IgG/IgA/IgM, Hexagon TB, Mantoux (MT)",
                  "Mycobacterium tuberculosis, Tuberculin Test",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="মাইক্রোবায়োলজি"
                titleEn="Microbiology"
                itemsBn={[
                  "ইউরিন/উন্ড/স্টুল/থ্রোট/অরাল/ইয়ার/কনজাংক/পাস/স্পুটাম C/S",
                  "থ্রোট/প্রোস্ট্যাটিক/ইউরেথ্রাল স্মিয়ার G‑Stain",
                  "স্পুটাম ফর AFB, ইউরিন ফর AFB",
                  "প্রোস্ট্যাটিক স্মিয়ার/সিমেন C/S, স্কিন স্ক্র্যাপিং ফর ফাঙ্গাস",
                  "HVS C/S ও G‑Stain, ব্লাড C/S (ফ্যান মেথড)",
                ]}
                itemsEn={[
                  "Urine/Wound/Stool/Throat/Oral/Ear/Conjunctival/Pus/Sputum C/S",
                  "Throat/Prostatic/Urethral Smear G‑Stain",
                  "Sputum for AFB, Urine for AFB",
                  "Prostatic Smear/Semen C/S, Skin Scraping for Fungus",
                  "HVS C/S & G‑Stain, Blood C/S (Fan method)",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="ইলেক্ট্রোলাইটস‑মিনারেলস"
                titleEn="Electrolytes & Minerals"
                itemsBn={[
                  "Na+, K+, KCl, CoP, HCC, pH, ক্যালসিয়াম, ম্যাগনেসিয়াম, ফসফেট (PO4)",
                ]}
                itemsEn={[
                  "Na+, K+, KCl, CoP, HCC, pH, Calcium, Magnesium, Phosphate (PO4)",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="হেপাটাইটিস প্যানেল"
                titleEn="Hepatitis Panel"
                itemsBn={[
                  "HBsAg স্ক্রিনিং/ELISA, Anti‑HBs, Anti‑HAV",
                  "Anti‑HBe, Anti‑HBc Total/IgM, Anti‑HEV, HBeAg, Anti‑HCV, HBV‑DNA",
                ]}
                itemsEn={[
                  "HBsAg Screening/ELISA, Anti‑HBs, Anti‑HAV",
                  "Anti‑HBe, Anti‑HBc Total/IgM, Anti‑HEV, HBeAg, Anti‑HCV, HBV‑DNA",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="লিভার ফাংশন"
                titleEn="Liver Function"
                itemsBn={[
                  "SGPT (ALT), SGOT (AST), Alkaline Phosphatase",
                  "Bilirubin (Total/Direct/Indirect), Total Protein, A/G Ratio, Liver Profile",
                ]}
                itemsEn={[
                  "SGPT (ALT), SGOT (AST), Alkaline Phosphatase",
                  "Bilirubin (Total/Direct/Indirect), Total Protein, A/G Ratio, Liver Profile",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="লিপিড প্রোফাইল"
                titleEn="Lipid Profile"
                itemsBn={["কোলেস্টেরল, ট্রাইগ্লিসারাইড, HDL, LDL"]}
                itemsEn={["Cholesterol, Triglycerides, HDL, LDL"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="হরমোন অ্যানালাইসিস"
                titleEn="Hormone Analysis"
                itemsBn={[
                  "T3, T4, TSH, Free T3, Free T4, Anti‑Thyroid Antibodies",
                  "FSH, LH, Prolactin, Testosterone, Estrogen, Progesterone",
                  "Cortisol (AM/PM), Growth Hormone, Anti‑Thyroid Ab (Anti‑TG + Anti‑TPO)",
                  "Anti‑CCP, PTH, Anti‑DS DNA, TRAb, Beta‑hCG, AMH, AFP",
                ]}
                itemsEn={[
                  "T3, T4, TSH, Free T3, Free T4, Anti‑Thyroid Antibodies",
                  "FSH, LH, Prolactin, Testosterone, Estrogen, Progesterone",
                  "Cortisol (AM/PM), Growth Hormone, Anti‑Thyroid Ab (Anti‑TG + Anti‑TPO)",
                  "Anti‑CCP, PTH, Anti‑DS DNA, TRAb, Beta‑hCG, AMH, AFP",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="কার্ডিয়াক এনজাইম"
                titleEn="Cardiac Enzymes"
                itemsBn={[
                  "CK‑MB, CPK, LDH, Troponin‑I, NT‑proBNP, VIP Cardiac Profile",
                ]}
                itemsEn={[
                  "CK‑MB, CPK, LDH, Troponin‑I, NT‑proBNP, VIP Cardiac Profile",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="অন্যান্য এনজাইম"
                titleEn="Other Enzymes"
                itemsBn={[
                  "Amylase, Lipase, Acid Phosphatase (Total)",
                  "S‑Amylase, S‑Total Protein, S‑Lipase, S‑CPK, S‑GGT",
                ]}
                itemsEn={[
                  "Amylase, Lipase, Acid Phosphatase (Total)",
                  "S‑Amylase, S‑Total Protein, S‑Lipase, S‑CPK, S‑GGT",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="বিশেষ টেস্ট"
                titleEn="Special Tests"
                itemsBn={[
                  "Semen Analysis, Pap’s Smear (Cytology)",
                  "CSF Study (Cytology), Pleural/Ascitic Fluid Study",
                  "Albumin‑Creatinine Ratio (ACR), Iron Profile",
                  "Vitamin D3, Vitamin B‑12, Ferritin, Folic Acid, IgE, ANA, TIBC",
                  "Hb Electrophoresis, VIP Physio Profile",
                ]}
                itemsEn={[
                  "Semen Analysis, Pap’s Smear (Cytology)",
                  "CSF Study (Cytology), Pleural/Ascitic Fluid Study",
                  "Albumin‑Creatinine Ratio (ACR), Iron Profile",
                  "Vitamin D3, Vitamin B‑12, Ferritin, Folic Acid, IgE, ANA, TIBC",
                  "Hb Electrophoresis, VIP Physio Profile",
                ]}
              />
            </Grid>
          </Grid>
        </>,
      )}
      <br />
      {section(
        "ইমেজিং ও বিশেষ পরীক্ষা",
        "Imaging & Special Investigations",
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="আল্ট্রাসাউন্ড (USG)"
                titleEn="Ultrasound (USG)"
                itemsBn={[
                  "হোল/আপার/লোয়ার অ্যাবডোমেন, KUB, পেলভিক অর্গান",
                  "আর্লি প্রেগনেন্সি, প্রেগনেন্সি/PG প্রোফাইল, অ্যানোমালি স্ক্যান",
                  "বায়ো‑ফিজিক্যাল প্রোফাইল, TVS/TVS with Folliculometry",
                  "টেস্টেস/স্ক্রোটাম, ব্রেস্টস, থাইরয়েড, HBS",
                  "কালার ডপলার/ডুপ্লেক্স স্টাডি (ভাসকুলার)",
                  "হেপাটোবিলিয়ারি/ইউরিনারি/জেনিটাল সিস্টেম",
                  "অ্যাবডোমেন ইন ইরেক্ট পোস্টচার, ইউটেরাস অ্যান্ড অ্যাডনেক্সা",
                  "ব্রেইন, সফট টিস্যু, প্যারোটিড",
                ]}
                itemsEn={[
                  "Whole/Upper/Lower Abdomen, KUB, Pelvic Organs",
                  "Early Pregnancy, Pregnancy/PG Profile, Anomaly Scan",
                  "Bio‑physical Profile, TVS/TVS with Folliculometry",
                  "Testes/Scrotum, Breasts, Thyroid, HBS",
                  "Color Doppler/Duplex Study (Vascular)",
                  "Hepatobiliary/Urinary/Genital Systems",
                  "Abdomen in Erect Posture, Uterus & Adnexa",
                  "Brain, Soft Tissue, Parotid",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="ডিজিটাল এক্স‑রে (কনভেনশনাল)"
                titleEn="Digital X‑Ray (Conventional)"
                itemsBn={[
                  "চেস্ট (PA/AP/ল্যাটারাল), স্কাল (B/V), PNS (ওএম/উভয়)",
                  "পেলভিস, পিটুইটারি ফোসা, ম্যান্ডিবল, ম্যাক্সিলা, অরবিট, নাসোফ্যারিঙ্কস",
                  "সার্ভিক্যাল, ডরসাল, L‑S স্পাইন (B/V), স্পাইন (B/V)",
                  "রিস্ট, অ্যাঙ্কেল, ফুট, নী, থাই, লেগ, ফোরআর্ম (ডান/বাম/উভয়)",
                  "শোল্ডার, হিপ জয়েন্ট, ফিবো জয়েন্ট, হ্যান্ড (B/V)",
                ]}
                itemsEn={[
                  "Chest (PA/AP/Lateral), Skull (B/V), PNS (OM/Both)",
                  "Pelvis, Pituitary Fossa, Mandible, Maxilla, Orbit, Nasopharynx",
                  "Cervical, Dorsal, L‑S Spine (B/V), Spine (B/V)",
                  "Wrist, Ankle, Foot, Knee, Thigh, Leg, Forearm (R/L/Both)",
                  "Shoulder, Hip Joint, Fibulo‑tibial Joint, Hand (B/V)",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="সিটি স্ক্যান"
                titleEn="CT Scan"
                itemsBn={[
                  "ব্রেইন/হেড, HBS/প্যানক্রিয়াস, হোল/আপার/লোয়ার অ্যাবডোমেন",
                  "চেস্ট/থোরাক্স, অরবিটস, লিভার",
                  "CT Abdomen, CT Urogram, KUB (কনট্রাস্ট/নন‑কনট্রাস্ট)",
                ]}
                itemsEn={[
                  "Brain/Head, HBS/Pancreas, Whole/Upper/Lower Abdomen",
                  "Chest/Thorax, Orbits, Liver",
                  "CT Abdomen, CT Urogram, KUB (Contrast/Non‑contrast)",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="মাল্টি স্লাইস সিটি স্ক্যান"
                titleEn="Multi‑Slice CT Scan"
                itemsBn={["হাই‑রেজোলিউশন ও দ্রুত ইমেজিং সুবিধা"]}
                itemsEn={["High‑resolution, fast multi‑slice imaging"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="কার্ডিয়াক ইমেজিং"
                titleEn="Cardiac Imaging"
                itemsBn={[
                  "ETT, ECG, ইকোকার্ডিওগ্রাম (2D/M‑Mode/Color Doppler)",
                  "EEG, Arrhythmia Analysis",
                ]}
                itemsEn={[
                  "ETT, ECG, Echocardiogram (2D/M‑Mode/Color Doppler)",
                  "EEG, Arrhythmia Analysis",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="কন্ট্রাস্ট এক্স‑রে"
                titleEn="Contrast X‑Ray"
                itemsBn={[
                  "ফুল/লাম্বার/থোরাসিক/সার্ভিক্যাল মায়েলোগ্রাম",
                  "T‑tube Cholangiogram, VU/VP, RGU/MCU, Barium Swallow/Meal (4‑film)",
                  "Barium Enema (Plain/Double Contrast), Fistulogram, Sinogram/Sialogram",
                  "Hystero‑salpingogram",
                ]}
                itemsEn={[
                  "Full/Lumbar/Thoracic/Cervical Myelogram",
                  "T‑tube Cholangiogram, VU/VP, RGU/MCU, Barium Swallow/Meal (4‑film)",
                  "Barium Enema (Plain/Double Contrast), Fistulogram, Sinogram/Sialogram",
                  "Hystero‑salpingogram",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="এন্ডোস্কোপি"
                titleEn="Endoscopy"
                itemsBn={["আপার GIT (Upper GIT)"]}
                itemsEn={["Upper GIT Endoscopy"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="কলোনোস্কোপি"
                titleEn="Colonoscopy"
                itemsBn={["ভিডিও কলোনোস্কোপি (ফুল/শর্ট)"]}
                itemsEn={["Video Colonoscopy (Full/Short)"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="ডেন্টাল এক্স‑রে"
                titleEn="Dental X‑Ray"
                itemsBn={["OPG, সিঙ্গেল ডেন্টাল"]}
                itemsEn={["OPG, Single Dental X‑Ray"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="বিশেষ পরীক্ষা"
                titleEn="Special Procedures"
                itemsBn={[
                  "FNAC, বায়োপসি ও হিস্টোপ্যাথলজি",
                  "CT/USG‑Guided FNAC",
                  "পাপ’স স্মিয়ার, স্পাইরোমেট্রি, LFT",
                ]}
                itemsEn={[
                  "FNAC, Biopsy & Histopathology",
                  "CT/USG‑Guided FNAC",
                  "Pap’s Smear, Spirometry, LFT",
                ]}
              />
            </Grid>
          </Grid>
        </>,
      )}
      <br />
      {section(
        "ক্লিনিকাল সেবা",
        "Clinical Services",
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="মেডিসিন"
                titleEn="Medicine"
                itemsBn={[
                  "কাশি, জ্বর, হাইপারটেনশন, ডায়াবেটিস ইত্যাদি সাধারণ রোগের চিকিৎসা",
                ]}
                itemsEn={[
                  "Treatment for common conditions: cough, fever, hypertension, diabetes, etc.",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="শিশু"
                titleEn="Pediatrics"
                itemsBn={["শিশুদের বিভিন্ন স্বাস্থ্য সমস্যা ও প্রাথমিক চিকিৎসা"]}
                itemsEn={["Children’s health issues and primary care"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="গাইনি"
                titleEn="Gynecology"
                itemsBn={["গাইনোকলজিক্যাল সমস্যা ও প্রসূতি পরামর্শ"]}
                itemsEn={["Gynecological issues and obstetric counseling"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="ইএনটি"
                titleEn="ENT"
                itemsBn={["কান, নাক ও গলার রোগের চিকিৎসা"]}
                itemsEn={["Ear, nose, and throat treatment"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="হৃদরোগ"
                titleEn="Cardiology"
                itemsBn={["হার্টের রোগের চিকিৎসা, ইকো ও ইসিজি"]}
                itemsEn={["Cardiac care, ECHO and ECG"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="অর্থোপেডিক"
                titleEn="Orthopedics"
                itemsBn={["হাড় ও জয়েন্টের সমস্যা, ফিজিওথেরাপি"]}
                itemsEn={["Bone and joint problems, physiotherapy"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="ইউরোলজি"
                titleEn="Urology"
                itemsBn={["মূত্রাশয় ও প্রজনন স্বাস্থ্য সমস্যা"]}
                itemsEn={["Urinary and reproductive health issues"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="চর্ম রোগ"
                titleEn="Dermatology"
                itemsBn={["একজিমা, ফাঙ্গাল ইনফেকশন ও অ্যালার্জি"]}
                itemsEn={["Eczema, fungal infections, allergies"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                titleBn="মানসিক স্বাস্থ্য"
                titleEn="Mental Health"
                itemsBn={["বিষণ্ণতা, উদ্বেগ ও মানসিক চাপ ব্যবস্থাপনা"]}
                itemsEn={["Depression, anxiety, stress management"]}
              />
            </Grid>
          </Grid>
          <Paper
            elevation={0}
            sx={(t) => ({
              mt: 2,
              p: 2,
              borderRadius: 2,
              border: `1px solid ${t.palette.divider}`,
              background: alpha(t.palette.background.paper, 0.7),
            })}
          >
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {tx("সহযোগী সেবা", "Supportive Services")}
            </Typography>
            <Typography variant="body2">
              {tx(
                "হোম/অফিস স্যাম্পল কালেকশন: আপনার সুবিধামতো স্থান থেকে স্যাম্পল সংগ্রহের ব্যবস্থা।",
                "Home/Office Sample Collection: We collect samples from your preferred location.",
              )}
            </Typography>
          </Paper>
        </>,
      )}
      <br />
      {section(
        "আমাদের লক্ষ্য ও উদ্দেশ্য",
        "Our Goals & Objectives",
        <>
          <Typography>
            {tx(
              "আমিন ডায়াগনস্টিক এর লক্ষ্য কম খরচে, সেরা স্বাস্থ্যসেবা সকল মানুষের দ্বারপ্রান্তে পৌঁছে দেওয়া। সময়ের সাথে তালমিলিয়ে বিশ্বসেরা ও সর্বাধুনিক প্রযুক্তির মেশিনারিজ ও সর্বোচ্চ আধুনিক দক্ষতার মিলবন্ধনে উন্নতমানের আধুনিক সেবা প্রদান আমাদের প্রধান উদ্দেশ্য।",
              "Our goal is to deliver the best healthcare at an affordable cost to everyone. By staying in step with time, we aim to provide modern, high‑quality services through world‑class technologies and top‑tier clinical expertise.",
            )}
          </Typography>
        </>,
      )}
      <br />
      {section(
        "কেনো আমিন ডায়াগনস্টিক?",
        "Why Choose Amin Diagnostic?",
        <>
          <Grid container spacing={2}>
            {[
              [
                "ওয়ান‑স্টপ মানসম্মত ডায়াগনস্টিক সেবা",
                "One‑stop quality diagnostic services",
              ],
              ["স্বল্পমূল্য পরীক্ষা নিরীক্ষা", "Affordable test pricing"],
              ["বিশিষ্ট যোগ্যতা সম্পূর্ণ ডাক্তার", "Highly qualified doctors"],
              ["বিশেষজ্ঞ ডাক্তার চেম্বার", "Specialist consultation chambers"],
              ["মান নিয়ন্ত্রণ", "Strict quality control"],
              ["উন্নতমানের আধুনিক মেশিনারীজ", "Advanced modern machinery"],
              ["অনলাইন রিপোর্ট ডেলিভারী", "Online report delivery"],
              ["নিজস্ব বিদ্যুৎ সুবিধা", "Own power backup"],
              ["স্যাম্পল সংগ্রহ", "Sample collection"],
              ["কম্পিউটারাইজ সিস্টেম", "Computerized systems"],
              ["অন্যান্য সুবিধা", "Other facilities"],
            ].map(([bn, en], i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={(t) => ({
                    p: 2,
                    height: "100%",
                    borderRadius: 2,
                    border: `1px solid ${t.palette.divider}`,
                  })}
                >
                  <Typography variant="body1">{tx(bn, en)}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>,
      )}
      <br />
      {section(
        "আমিন ডায়াগনস্টিক এর বিশেষত্ব",
        "Our Special Features",
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={(t) => ({
                  p: 2,
                  height: "100%",
                  borderRadius: 2,
                  border: `1px solid ${t.palette.divider}`,
                })}
              >
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {tx("সর্বাধুনিক ল্যাব সুবিধা", "State‑of‑the‑art Lab")}
                </Typography>
                <Typography variant="body2">
                  {tx(
                    "আন্তর্জাতিক মানসম্পন্ন ল্যাবরেটরি যেখানে প্রতিটি পরীক্ষার সর্বোচ্চ নির্ভুলতা নিশ্চিত করা হয়।",
                    "International‑standard laboratory ensuring maximum accuracy in every test.",
                  )}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={(t) => ({
                  p: 2,
                  height: "100%",
                  borderRadius: 2,
                  border: `1px solid ${t.palette.divider}`,
                })}
              >
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {tx("উন্নত ইমেজিং সুবিধা", "Advanced Imaging")}
                </Typography>
                <Typography variant="body2">
                  {tx(
                    "ডিজিটাল এক্স‑রে, আল্ট্রাসনোগ্রাফি, ইকোকার্ডিওগ্রাফি, সিটি স্ক্যান ও এমআরআই সুবিধা।",
                    "Advanced digital X‑ray, ultrasonography, echocardiography, CT scan, and MRI facilities.",
                  )}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={(t) => ({
                  p: 2,
                  height: "100%",
                  borderRadius: 2,
                  border: `1px solid ${t.palette.divider}`,
                })}
              >
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {tx("বিশেষজ্ঞ চিকিৎসকের পরামর্শ", "Specialist Consultation")}
                </Typography>
                <Typography variant="body2">
                  {tx(
                    "নেফ্রোলজি, গাইনি, মেডিসিন, শিশু, হৃদরোগসহ বিভিন্ন বিভাগের বিশেষজ্ঞ সেবা।",
                    "Specialist care across nephrology, gynecology, medicine, pediatrics, cardiology, and more.",
                  )}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={(t) => ({
                  p: 2,
                  height: "100%",
                  borderRadius: 2,
                  border: `1px solid ${t.palette.divider}`,
                })}
              >
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {tx("অনলাইন রিপোর্ট সুবিধা", "Online Reports")}
                </Typography>
                <Typography variant="body2">
                  {tx(
                    "রোগীরা ঘরে বসেই আমাদের ওয়েবসাইট থেকে রিপোর্ট ডাউনলোড করতে পারবেন।",
                    "Patients can download their reports securely from home.",
                  )}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={(t) => ({
                  p: 2,
                  height: "100%",
                  borderRadius: 2,
                  border: `1px solid ${t.palette.divider}`,
                })}
              >
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {tx(
                    "বাসা/অফিসে ল্যাব টেস্ট সংগ্রহ",
                    "Home/Office Sample Collection",
                  )}
                </Typography>
                <Typography variant="body2">
                  {tx(
                    "আমরা বাসা বা অফিস থেকে ব্লাড ও অন্যান্য স্যাম্পল সংগ্রহ করে দ্রুত রিপোর্ট প্রদান করি।",
                    "We collect blood and other samples from your home or office and deliver reports quickly.",
                  )}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={(t) => ({
                  p: 2,
                  height: "100%",
                  borderRadius: 2,
                  border: `1px solid ${t.palette.divider}`,
                })}
              >
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {tx("সপ্তাহে ৭ দিন জরুরি সেবা", "24/7 Emergency Support")}
                </Typography>
                <Typography variant="body2">
                  {tx(
                    "জরুরি প্রয়োজনে ২৪ ঘণ্টা এবং সপ্তাহে ৭ দিন সেবা।",
                    "Emergency support available 24 hours a day, 7 days a week.",
                  )}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={(t) => ({
                  p: 2,
                  height: "100%",
                  borderRadius: 2,
                  border: `1px solid ${t.palette.divider}`,
                })}
              >
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {tx("অভিজ্ঞ ও দক্ষ টেকনোলজিস্ট", "Experienced Technologists")}
                </Typography>
                <Typography variant="body2">
                  {tx(
                    "প্রতিটি পরীক্ষায় নির্ভুলতা বজায় রাখতে দক্ষ টেকনোলজিস্টদের টিম।",
                    "Skilled technologists ensure accuracy and reliability in every test.",
                  )}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>,
      )}
    </Box>
  );
}
