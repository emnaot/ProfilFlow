import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url("./images/Back.png")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%", padding: 20, backgroundColor: "#092244" }}
          >
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ position: "relative" }}
            >
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  color: "#fff",
                  mt: 20,
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px #000000",
                  fontFamily: "Cursive",
                }}
              >
                404 - Page Non Trouvée
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#fff",
                  mt: 2,
                  textAlign: "center",
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px #000000",
                  fontFamily: "Cursive",
                  fontSize: "1.1rem",
                }}
              >
                Désolé, la page que vous cherchez n'existe pas.
              </Typography>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 5,
                mb: 0.1,
                bgcolor: "#2a6e9f",
                color: "#fff",
                "&:hover": { bgcolor: "#2c387e" },
                maxWidth: 200,
              }}
              onClick={() => navigate("/home", { replace: true })}
            >
              Retour à l'accueil
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
