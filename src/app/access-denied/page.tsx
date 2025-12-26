"use client";

import { Box, Button, Container, Typography, Paper } from "@mui/material";
import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You do not have the necessary permissions to view this page.
        </Typography>
        <Button component={Link} href="/" variant="contained">
          Go to Homepage
        </Button>
      </Paper>
    </Container>
  );
}
