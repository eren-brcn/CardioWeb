import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function TermsPage() {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Typography variant="h3" component="h1">
        {t("terms.title")}
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="body1" color="text.secondary">
              {t("terms.p1")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("terms.p2")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("terms.p3")}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default TermsPage;
