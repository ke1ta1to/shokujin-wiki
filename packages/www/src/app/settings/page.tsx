import { Box } from "@mui/material";

import { getCurrentUser } from "@/features/user/actions/user-actions";
import { UserSettingsForm } from "@/features/user/components/user-settings-form";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <Box maxWidth="sm" mx="auto">
      <UserSettingsForm user={user} />
    </Box>
  );
}
