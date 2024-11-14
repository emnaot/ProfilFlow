import React from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useAuth } from "AuthContext"; // Assurez-vous que le chemin est correct
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  People,
  Home,
  Logout,
  Person2,
  Description,
  ManageAccounts,
} from "@mui/icons-material";

const Drawerr = ({
  drawerWidth,
  setmyMOde,
  noneORblock,
  drawerType,
  hideDrawer,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { instance } = useMsal();
  const { user } = useAuth();

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/login" });
  };

  const drawerItems = [
    {
      text: "Accueil",
      icon: <Home />,
      path: "/home",
      roles: ["Administrateur", "Responsable"],
    },
    {
      text: "Rôles",
      icon: <ManageAccounts />,
      path: "/roles",
      roles: ["Administrateur"],
    },
    {
      text: "Collaborateurs",
      icon: <People />,
      path: "/Collaborateurs",
      roles: ["Administrateur", "Responsable"],
    },
    {
      text: "Profil",
      icon: <Person2 />,
      path: "/profil",
      roles: ["Collaborateur", "Responsable"],
    },
    {
      text: "Modèles",
      icon: <Description />,
      path: "/modele",
      roles: ["Responsable", "Administrateur"],
    },
  
  ];

  const filteredItems = user
    ? drawerItems.filter((item) => item.roles.includes(user.role))
    : [];

  return (
    <Drawer
      sx={{
        display: { xs: noneORblock, sm: "block" },
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: theme.palette.mode === "light" ? "#092244" : null,
        },
      }}
      variant={drawerType}
      anchor="left"
      open={true}
      onClose={hideDrawer}
    >
      <List>
        <ListItem
          sx={{ display: "flex", justifyContent: "center", mb: "14px" }}
          disablePadding
        >
          <IconButton
            onClick={() => {
              localStorage.setItem(
                "currentMode",
                theme.palette.mode === "dark" ? "light" : "dark"
              );
              setmyMOde(theme.palette.mode === "light" ? "dark" : "light");
            }}
            sx={{ color: theme.palette.mode === "light" ? "white" : "inherit" }}
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7 sx={{ color: "orange" }} />
            ) : (
              <Brightness4 />
            )}
          </IconButton>
        </ListItem>
        <Divider />
        {filteredItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon
                sx={{
                  color: theme.palette.mode === "light" ? "white" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: theme.palette.mode === "light" ? "white" : "inherit",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon
              sx={{
                color: theme.palette.mode === "light" ? "white" : "inherit",
              }}
            >
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Se déconnecter"
              sx={{
                color: theme.palette.mode === "light" ? "white" : "inherit",
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Drawerr;
