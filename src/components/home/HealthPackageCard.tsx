"use client";

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material";

type Localized = { bn: string; en: string };

type HealthPackage = {
  title: Localized;
  subtitle: Localized;
  tests: Localized[];
  price: { old: Localized; new: Localized };
  image: string;
};

type Props = {
  pkg: HealthPackage;
  lang: string;
  t: (value: Localized) => string;
};

export default function PackageCard({ pkg, lang, t }: Props) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        boxShadow: 6,
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": { transform: "translateY(-10px)", boxShadow: 12 },
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={pkg.image}
        alt={t(pkg.title)}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 2 }}>
        <Typography variant="h6" align="center" fontWeight="bold" gutterBottom>
          {t(pkg.title)}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="primary"
          gutterBottom
        >
          {t(pkg.subtitle)}
        </Typography>

        <Box sx={{ my: 2 }}>
          {pkg.tests.map((test, idx) => (
            <Typography
              key={`${t(pkg.title)}-${idx}`}
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              {t(test)}
            </Typography>
          ))}
        </Box>

        <Stack spacing={1} alignItems="center" sx={{ mt: 3 }}>
          <Typography
            variant="body1"
            sx={{ textDecoration: "line-through", color: "text.disabled" }}
          >
            {t(pkg.price.old)}
          </Typography>
          <Typography variant="h5" color="success.main" fontWeight="bold">
            {t(pkg.price.new)}
          </Typography>
        </Stack>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            background: "linear-gradient(45deg, #9c27b0 30%, #2196f3 90%)",
            py: 1.5,
            borderRadius: "8px",
            fontWeight: "bold",
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          {lang === "bn" ? "প্যাকেজ কিনুন" : "Buy Package"}
        </Button>
      </Box>
    </Card>
  );
}
