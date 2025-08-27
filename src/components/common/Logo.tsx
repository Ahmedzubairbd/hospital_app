import { Box, BoxProps } from "@mui/system";

export default function Logo({ sx }: { sx?: BoxProps["sx"] }) {
  // OR using local (public folder)
  // -------------------------------------------------------
  const Logo = (
    <Box
      component="img"
      src="/logo/logo_icon.svg"
      sx={{ width: 40, height: 40 }}
    />
  );
  return <Box sx={sx}>{Logo}</Box>;
}
