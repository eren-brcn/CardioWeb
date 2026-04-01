import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuthSession, getAuthUser, hasAuthSession } from "../services/authStorage";

const privateLinks = [
	{ to: "/", label: "Dashboard", icon: <DashboardOutlinedIcon fontSize="small" /> },
	{ to: "/categories", label: "Training Guides", icon: <MenuBookOutlinedIcon fontSize="small" /> }
];

const publicLinks = [
	{ to: "/login", label: "Login", icon: <LoginOutlinedIcon fontSize="small" /> },
	{ to: "/signup", label: "Sign Up", icon: <PersonAddAltOutlinedIcon fontSize="small" /> }
];

function Navbar() {
	const navigate = useNavigate();
	const isAuthenticated = hasAuthSession();
	const authUser = getAuthUser();

	const handleLogout = () => {
		clearAuthSession();
		navigate("/login", { replace: true });
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

					{isAuthenticated && authUser?.role === "admin" && (
						<Button
							component={NavLink}
							to="/admin"
							startIcon={<SettingsOutlinedIcon fontSize="small" />}
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
							Admin
						</Button>
					)}

					{isAuthenticated && (
						<>
							<Typography variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
								{authUser?.name || authUser?.email || "Signed in"}
							</Typography>
							<Button
								onClick={handleLogout}
								startIcon={<LogoutOutlinedIcon fontSize="small" />}
								sx={{
									color: "text.secondary",
									borderRadius: 99,
									px: 1.7
								}}
							>
								Logout
							</Button>
						</>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
}

export default Navbar;
