import { Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={1.2} alignItems="flex-start">
      <CheckCircleIcon color="primary" fontSize="small" />
      <Typography sx={{ mt: "2px" }}>{children}</Typography>
    </Stack>
  );
}
export default Bullet;
