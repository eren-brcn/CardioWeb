import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ py: 2 }}>
          <Typography variant="h3" component="h1">
            404
          </Typography>
          <Typography variant="h5">{t("notFound.title")}</Typography>
          <Typography color="text.secondary">{t("notFound.body")}</Typography>
          <Button component={Link} to="/" variant="contained" sx={{ alignSelf: "flex-start" }}>
            {t("notFound.cta")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default NotFoundPage;
