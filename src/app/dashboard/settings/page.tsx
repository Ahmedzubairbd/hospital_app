"use client";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Stack,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";
import { useColorMode } from "@/lib/theme/ThemeRegistry";
import { useI18n } from "@/lib/i18n";

export default function SettingsPage() {
  const { mode, toggle: toggleColorMode } = useColorMode();
  const { lang, setLang } = useI18n();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Card>
        <CardHeader title="Appearance & Language" />
        <Divider />
        <CardContent>
          <Stack spacing={2} sx={{ maxWidth: 400 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={mode === "dark"}
                  onChange={toggleColorMode}
                />
              }
              label={`Theme: ${mode === "dark" ? "Dark" : "Light"}`}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={lang === "bn"}
                  onChange={() => setLang(lang === "en" ? "bn" : "en")}
                />
              }
              label={`Language: ${lang === "bn" ? "বাংলা" : "English"}`}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
