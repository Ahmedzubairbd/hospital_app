"use client";
import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import PregnantWomanOutlinedIcon from "@mui/icons-material/PregnantWomanOutlined";
import HearingOutlinedIcon from "@mui/icons-material/HearingOutlined";
import AccessibilityNewOutlinedIcon from "@mui/icons-material/AccessibilityNewOutlined";
import FaceRetouchingNaturalOutlinedIcon from "@mui/icons-material/FaceRetouchingNaturalOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import BloodtypeOutlinedIcon from "@mui/icons-material/BloodtypeOutlined";
import BiotechOutlinedIcon from "@mui/icons-material/BiotechOutlined";
import ChildCareOutlinedIcon from "@mui/icons-material/ChildCareOutlined";
import RheumatologyIcon from "@/components/icons/RheumatologyIcon";

const specialties = [
  { id: "medicine", titleBn: "মেডিসিন", icon: MedicalServicesOutlinedIcon },
  { id: "cardiology", titleBn: "কার্ডিওলজি", icon: FavoriteBorderOutlinedIcon },
  {
    id: "neuromedicine",
    titleBn: "নিউরোমেডিসিন",
    icon: PsychologyOutlinedIcon,
  },
  { id: "gynecology", titleBn: "গাইনি", icon: PregnantWomanOutlinedIcon },
  { id: "ent", titleBn: "ইএনটি", icon: HearingOutlinedIcon },
  {
    id: "orthopedics",
    titleBn: "অর্থোপেডিক্স",
    icon: AccessibilityNewOutlinedIcon,
  },
  {
    id: "dermatology",
    titleBn: "চর্ম ও যৌন",
    icon: FaceRetouchingNaturalOutlinedIcon,
  },
  { id: "oncology", titleBn: "অনকোলজি", icon: LocalHospitalOutlinedIcon },
  {
    id: "neurosurgery",
    titleBn: "সার্জারি",
    icon: ContentCutOutlinedIcon,
  },
  {
    id: "gastroenterology",
    titleBn: "গ্যাস্ট্রোএন্টারোলজি",
    icon: SpaOutlinedIcon,
  },
  {
    id: "psychology",
    titleBn: "সাইকোলজি",
    icon: SentimentSatisfiedAltOutlinedIcon,
  },
  { id: "urology", titleBn: "ইউরোলজি", icon: WaterDropOutlinedIcon },
  { id: "hematology", titleBn: "হেমাটোলজি", icon: BloodtypeOutlinedIcon },
  {
    id: "endocrinology",
    titleBn: "এন্ড্রোক্রাইনোলজি",
    icon: BiotechOutlinedIcon,
  },
  { id: "pediatric", titleBn: "পেডিয়াট্রিক", icon: ChildCareOutlinedIcon },
  { id: "Rheumatology", titleBn: "রিউমাটোলজি", icon: RheumatologyIcon },
];

export default function SpecialistDoctorChamber() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  return (
    <Stack
      component="section"
      sx={{
        maxWidth: 1180,
        md: 3,
        lg: 4,
        xs: 12,
      }}
    >
      <Stack spacing={1} gap={0}>
        {/* First Row */}
        <Box
          sx={{
            display: "grid",
            fontWeight: 800,
            fontSize: 42,
            gap: { xs: 1, md: 1 },
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(4, 1fr)",
              md: "repeat(8, 1fr)",
              lg: "repeat(8, 1fr)",
              xl: "repeat(8, 1fr)",
            },
          }}
        >
          {specialties.slice(0, 8).map((specialty) => {
            const IconComponent = specialty.icon;
            return (
              <Box key={specialty.id}>
                <Card
                  className="shadow-lg hover:shadow-md transition-shadow cursor-pointer rounded-xl h-full"
                  sx={{
                    backgroundColor: isDarkMode
                      ? "rgba(1, 2, 2, 0.76)"
                      : "rgba(110, 232, 211, 0.76)",
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ p: 1, gap: 1 }}
                    >
                      <Box
                        sx={{
                          height: 50,
                          width: 50,
                          fontWeight: 800,
                          fontSize: 42,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconComponent
                          sx={{
                            fontSize: 42,
                            color: "theme.primary",
                            fontWeight: 800,
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: "theme.primary",
                          textAlign: "center",
                        }}
                      >
                        {specialty.titleBn}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>

        {/* Second Row */}
        <Box
          sx={{
            display: "grid",
            fontWeight: 800,
            fontSize: 42,
            gap: { xs: 1, md: 1 },
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(4, 1fr)",
              md: "repeat(8, 1fr)",
              lg: "repeat(8, 1fr)",
              xl: "repeat(8, 1fr)",
            },
          }}
        >
          {specialties.slice(8, 16).map((specialty) => {
            const IconComponent = specialty.icon;
            return (
              <Box key={specialty.id}>
                <Card
                  className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white rounded-xl h-full"
                  sx={{
                    backgroundColor: isDarkMode
                      ? "rgba(1, 2, 2, 0.76)"
                      : "rgba(110, 232, 211, 0.76)",
                  }}
                >
                  <CardContent className="p-2">
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{ p: 1, gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          fontSize: 42,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconComponent
                          sx={{
                            fontSize: 42,
                            fontWeight: 800,
                            color: "theme.primary",
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: "theme.primary",
                          textAlign: "center",
                        }}
                      >
                        {specialty.titleBn}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Stack>
    </Stack>
  );
}
