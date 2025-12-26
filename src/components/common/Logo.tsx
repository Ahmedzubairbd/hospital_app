import Image from "next/image";
import { Box, BoxProps } from "@mui/system";

export default function Logo({
  sx,
  size = 40,
}: {
  sx?: BoxProps["sx"];
  size?: number;
}) {
  // OR using local (public folder)
  // -------------------------------------------------------
  const Logo = (
    <Image
      src="/logo/logo_icon.svg"
      alt="Amin Diagnostics logo"
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
  return <Box sx={sx}>{Logo}</Box>;
}
