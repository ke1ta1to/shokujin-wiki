import { LinearProgress } from "@mui/material";

export default function Loading() {
  return (
    <LinearProgress sx={{ position: "fixed", top: 0, left: 0, right: 0 }} />
  );
}
