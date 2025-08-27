import { Box, BoxProps } from "@mui/system";

export default function Logo({ sx, size = 40 }: { sx?: BoxProps["sx"], size?: number }) {
  // OR using local (public folder)
  // -------------------------------------------------------
  const Logo = (
    <Box
      component="img"
      src="/logo/logo_icon.svg"
      sx={{ width: size, height: size }}
    />
  );
  return <Box sx={sx}>{Logo}</Box>;
}
