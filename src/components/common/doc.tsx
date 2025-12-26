import Box from "@mui/system/Box";
import Image from "next/image";
import * as React from "react";

export default function Doc() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        bgcolor: "background.default",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "clip",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: 233,
          width: 350,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
          flexShrink: 0,
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=60"
          alt="The house from the offer."
          fill
          sizes="(max-width: 900px) 100vw, 350px"
          style={{ objectFit: "cover" }}
          quality={85}
        />
      </Box>
      <Box
        sx={{
          p: 3,
          minWidth: { md: 350 },
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          gap: 0.5,
        }}
      >
        <Box
          component="span"
          sx={{ fontSize: "0.875rem", color: "text.secondary" }}
        >
          123 Main St, Phoenix AZ
        </Box>
        <Box
          component="span"
          sx={{ color: "primary.main", fontSize: "1.5rem", fontWeight: "bold" }}
        >
          $280,000 — $310,000
        </Box>
        <Box
          sx={{
            py: 0.5,
            px: 1,
            backgroundColor: "rgba(46, 125, 50, 0.1)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            border: "1px solid",
            borderColor: "rgba(46, 125, 50, 0.1)",
            fontSize: "0.7rem",
            fontWeight: "bold",
            letterSpacing: ".05rem",
            textTransform: "uppercase",
            color: "success.main",
          }}
        >
          <Box component="span">Add</Box>
        </Box>
      </Box>
    </Box>
  );
}
