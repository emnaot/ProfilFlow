import React, { useState } from "react";
import { Paper, Typography, Box, Modal, useTheme } from "@mui/material";
import ImporterMission from "./ImporterMission";

const FeaturedPost = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: -8,
          mb: 4,
        }}
      >
        <Paper
          sx={{
            padding: "75px 75px 50px",
            backgroundImage: `url("./images/home.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: theme.palette.mode === "light" ? "#e0e0e0" : "#ffffff",
            width: "100%",
            maxWidth: "1200px",
            mx: 4,
            my: 2,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 4px 10px 0 rgba(0,0,0,0.3)"
                : "0 4px 10px 0 rgba(255,255,255,0.3)",
            borderRadius: "8px",
            "&:hover": {
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 6px 12px 0 rgba(0,0,0,0.5)"
                  : "0 6px 12px 0 rgba(255,255,255,0.5)",
            },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          elevation={4}
          onClick={handleOpen}
        >
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontWeight: "bold",
              fontSize: "2rem",
              lineHeight: 1.2,
              mb: 2,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              textShadow:
                theme.palette.mode === "light"
                  ? "2px 2px 8px rgba(0,0,0,0.8)"
                  : "2px 2px 8px rgba(255,255,255,0.8)",
            }}
          >
            Simplifiez vos CVs de Mission
          </Typography>
          <Box sx={{ opacity: 0.7 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                textShadow:
                  theme.palette.mode === "light"
                    ? "2px 2px 8px rgba(0,0,0,0.8)"
                    : "2px 2px 8px rgba(255,255,255,0.8)",
              }}
            >
              Automatisation avancée pour une création et personnalisation
              rapide des CVs.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                textShadow:
                  theme.palette.mode === "light"
                    ? "2px 2px 8px rgba(0,0,0,0.8)"
                    : "2px 2px 8px rgba(255,255,255,0.8)",
              }}
            >
              Économisez temps et efforts à chaque projet.
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ outline: "none" }}>
          <ImporterMission />
        </Box>
      </Modal>
    </>
  );
};

export default FeaturedPost;
