import { Card, CardContent, Link, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function SupportPage() {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Typography variant="h3" component="h1">
        {t("support.title")}
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="body1" color="text.secondary">
              {t("support.p1")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("support.contact")}: <Link href="mailto:support@cardioweb.app">support@cardioweb.app</Link>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("support.p3")}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default SupportPage;
