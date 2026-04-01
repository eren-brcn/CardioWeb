import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <Box component="footer" sx={{ borderTop: "1px solid rgba(255,255,255,0.08)", mt: 5, py: 3 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Typography variant="body2" color="text.secondary">
            {new Date().getFullYear()} CardioWeb. {t("footer.tagline")}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link component={RouterLink} to="/privacy" variant="caption" color="text.secondary" underline="hover">
              {t("footer.privacy")}
            </Link>
            <Link component={RouterLink} to="/support" variant="caption" color="text.secondary" underline="hover">
              {t("footer.support")}
            </Link>
            <Link component={RouterLink} to="/terms" variant="caption" color="text.secondary" underline="hover">
              {t("footer.terms")}
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;