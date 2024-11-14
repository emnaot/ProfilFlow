import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ImporterMission = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: -7,
        mb: 2,
        boxShadow:
          theme.palette.mode === "light"
            ? "0 8px 30px -5px rgba(0,0,0,0.3)"
            : "0 8px 30px -5px rgba(255,255,255,0.3)",
        maxWidth: "calc(100% - 64px)",
        minHeight: 350,
        bgcolor:
          theme.palette.mode === "light" ? "background.paper" : "#294c60",
        borderRadius: "20px",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(145deg, #6a9fb5 30%, #b6d2e8 90%)"
            : "linear-gradient(145deg, #294c60 30%, #5c8b9e 90%)",
        color: theme.palette.mode === "light" ? "#294c60" : "#ffffff",
        ":hover": {
          boxShadow:
            theme.palette.mode === "light"
              ? "0 10px 40px -7px rgba(0,0,0,0.4)"
              : "0 10px 40px -7px rgba(255,255,255,0.4)",
          transform: "scale(1.05)",
          transition: "transform 0.2s, box-shadow 0.2s",
        },
        marginLeft: "calc(9% - 16px)",
        marginRight: "calc(15% - 16px)",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          transition: "transform 0.2s",
        }}
      >
        <Typography
          component="h2"
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            textShadow:
              theme.palette.mode === "light"
                ? "0 2px 4px rgba(0,0,0,0.5)"
                : "0 2px 4px rgba(255,255,255,0.5)",
            color: theme.palette.mode === "light" ? "#ffffff" : "#294c60",
            textAlign: "center", 
            display: "block", 
          }}
        >
          Importer une mission à partir d’un modèle
        </Typography>
        <IconButton
          color="inherit"
          aria-label="importer modèle mission"
          component="label"
          sx={{
            my: 2,
            ":hover": {
              transform: "rotate(360deg)",
              transition: "transform 0.6s",
            },
          }}
        >
          <CloudUploadIcon fontSize="large" />
          <input
            type="file"
            hidden
            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
        </IconButton>
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textShadow:
              theme.palette.mode === "light"
                ? "0 1px 3px rgba(0,0,0,0.3)"
                : "0 1px 3px rgba(255,255,255,0.3)",
            letterSpacing: "0.1em",
            fontSize: "1rem",
            color: theme.palette.mode === "light" ? "#d0e4f7" : "#ffffff",
          }}
        >
          Sélectionnez et importez un modèle de mission pour commencer.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ImporterMission;
