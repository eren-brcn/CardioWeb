import { AppBar, Box, Button, MenuItem, TextField, Toolbar, Typography } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuthSession, hasAuthSession } from "../services/authStorage";
import { useTranslation } from "react-i18next";

function Navbar() {
	const navigate = useNavigate();
	const isAuthenticated = hasAuthSession();
	const { t, i18n } = useTranslation();

	const privateLinks = [
		{ to: "/", label: t("nav.dashboard"), icon: <DashboardOutlinedIcon fontSize="small" /> },
		{ to: "/profile", label: t("nav.profile"), icon: <PersonOutlineOutlinedIcon fontSize="small" /> },
		{ to: "/categories", label: t("nav.trainingGuides"), icon: <MenuBookOutlinedIcon fontSize="small" /> },
		{ to: "/settings", label: t("nav.settings"), icon: <SettingsOutlinedIcon fontSize="small" /> }
	];

	const publicLinks = [
		{ to: "/login", label: t("nav.login"), icon: <LoginOutlinedIcon fontSize="small" /> },
		{ to: "/signup", label: t("nav.signup"), icon: <PersonAddAltOutlinedIcon fontSize="small" /> }
	];

	const handleLogout = () => {
		clearAuthSession();
		navigate("/login", { replace: true });
	};

	const handleLanguageChange = (event) => {
		i18n.changeLanguage(event.target.value);
	};

	return (
		<AppBar
			position="sticky"
			elevation={0}
			sx={{
				borderBottom: "1px solid rgba(255,255,255,0.08)",
				backgroundColor: "rgba(10, 18, 24, 0.82)",
				backdropFilter: "blur(8px)"
			}}
		>
			<Toolbar sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 } }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
					<MonitorHeartOutlinedIcon color="primary" />
					<Typography variant="h6" component="div" sx={{ fontWeight: 800 }}>
						CardioWeb
					</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
					<TextField
						select
						size="small"
						label={t("nav.language")}
						value={i18n.resolvedLanguage || "en"}
						onChange={handleLanguageChange}
						sx={{ minWidth: 130 }}
					>
						<MenuItem value="en">{t("languages.en")}</MenuItem>
						<MenuItem value="tr">{t("languages.tr")}</MenuItem>
						<MenuItem value="de">{t("languages.de")}</MenuItem>
						<MenuItem value="fr">{t("languages.fr")}</MenuItem>
						<MenuItem value="es">{t("languages.es")}</MenuItem>
					</TextField>

					{(isAuthenticated ? privateLinks : publicLinks).map((link) => (
						<Button
							key={link.to}
							component={NavLink}
							to={link.to}
							startIcon={link.icon}
							sx={{
								color: "text.secondary",
								borderRadius: 99,
								px: 1.7,
								"&.active": {
									color: "primary.main",
									backgroundColor: "rgba(0,194,168,0.13)"
								}
							}}
						>
							{link.label}
						</Button>
					))}

					{isAuthenticated && (
						<>
							<Button
								onClick={handleLogout}
								startIcon={<LogoutOutlinedIcon fontSize="small" />}
								sx={{
									color: "text.secondary",
									borderRadius: 99,
									px: 1.7
								}}
							>
								{t("nav.logout")}
							</Button>
						</>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
}

export default Navbar;
