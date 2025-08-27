"use client";

import * as React from "react";
import { ButtonGroup, Button, Tooltip } from "@mui/material";
import { useI18n } from "@/lib/i18n";

export default function LanguageSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <Tooltip title="Language">
      <ButtonGroup variant="outlined" size="small" aria-label="Language toggle">
        <Button
          onClick={() => setLang("en")}
          variant={lang === "en" ? "contained" : "outlined"}
        >
          EN
        </Button>
        <Button
          onClick={() => setLang("bn")}
          variant={lang === "bn" ? "contained" : "outlined"}
        >
          BN
        </Button>
      </ButtonGroup>
    </Tooltip>
  );
}
