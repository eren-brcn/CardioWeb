import { Box, Container, Stack, Typography } from "@mui/material";

function Footer() {
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
            {new Date().getFullYear()} CardioWeb. Keep training with consistency.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography variant="caption" color="text.secondary">
              Privacy
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Support
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Terms
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;