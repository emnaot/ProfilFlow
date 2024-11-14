// src/components/Appbar.jsx
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Link,
  Typography,
  Avatar,
  Box,
  Badge,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { callMsGraph, getUserProfilePhoto } from "../graph";
import { useAuth } from "../AuthContext";
import "./appbarStyles.css";
import { useNavigate } from "react-router-dom";

const Appbar = ({ drawerWidth, showDrawer }) => {
  const theme = useTheme();
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [attemptedLogout, setAttemptedLogout] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    console.log("Current user:", user); // Vérifiez les rôles icixx

    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, [user]);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (accounts.length > 0) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          callMsGraph(response.accessToken)
            .then((responseData) => {
              console.log("User data from MS Graph:", responseData);
              setUserData(responseData);
              localStorage.setItem("userData", JSON.stringify(responseData));
              setAttemptedLogout(false);
            })
            .then((accessToken) => {
              getUserProfilePhoto(accessToken).then((photoUrl) => {
                if (photoUrl) {
                  setUserData((prevState) => ({
                    ...prevState,
                    photo: photoUrl,
                  }));
                }
              });
            })
            .catch((error) =>
              console.error("Failed to fetch user data:", error)
            );
        })
        .catch((error) =>
          console.error("Failed to acquire token silently:", error)
        );
    } else if (attemptedLogout) {
      setUserData(null);
      localStorage.removeItem("userData");
    }
  }, [instance, accounts, attemptedLogout]);

  useEffect(() => {
    setIsUserOnline(!!userData);
  }, [userData]);

  const handleLogoClick = () => {
    if (user?.role === "Collaborateur") {
      navigate("/profil");
    } else {
      navigate("/home");
    }
  };

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#121212" : "white",
        color: theme.palette.mode === "dark" ? "white" : "black",
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        borderBottom:
          theme.palette.mode === "dark" ? "none" : "1px solid rgba(0, 0, 0, 0.12)",
      }}
      position="static"
    >
      <Toolbar>
        <IconButton
          onClick={showDrawer}
          sx={{
            mr: "9px",
            display: { sm: "none" },
            transition: "transform 0.3s",
            ":hover": { transform: "scale(1.2)" },
          }}
        >
          <Menu />
        </IconButton>
        <Box
          onClick={handleLogoClick}
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
              fontSize: "16.5px",
              color: theme.palette.primary.main,
            },
          }}
          color="inherit"
        >
          <Avatar
            alt="ProfilFlow Logo"
            src="/images/logo1.png"
            sx={{ mr: 1, width: 40, height: 40 }}
          />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            ProfilFlow
          </Typography>
        </Box>
        <Box sx={{ mr: 2, flexShrink: 0 }}>
          {userData ? (
            <>
              <Typography
                variant="body1"
                color={theme.palette.mode === "dark" ? "white" : "black"}
                sx={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                {userData.displayName}
              </Typography>
              <Typography
                variant="body2"
                color={
                  theme.palette.mode === "dark" ? "#B0B0B0" : "text.secondary"
                }
                sx={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "0.875rem",
                }}
              >
                {userData.mail || "No mail provided"}
              </Typography>
            </>
          ) : (
            <Typography
              variant="body1"
              color={theme.palette.mode === "dark" ? "white" : "black"}
              sx={{
                fontFamily: "Arial, sans-serif",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Loading...
            </Typography>
          )}
        </Box>
        <Badge
          color="success"
          variant="dot"
          invisible={!isUserOnline}
          classes={{ badge: isUserOnline ? "pulse-animation" : "" }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Avatar
            alt={userData ? userData.displayName : "User"}
            src={
              userData && userData.photo
                ? userData.photo
                : "/default-avatar.png"
            }
            sx={{
              width: 40,
              height: 40,
              backgroundColor:
                theme.palette.mode === "dark" ? "#1E1E1E" : "lightblue",
            }}
          />
        </Badge>
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
