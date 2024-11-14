
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import { useAuth } from "../../AuthContext";
import "./Login.css";

const defaultTheme = createTheme();

export default function SignInSide() {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = () => {
    instance
      .loginPopup(loginRequest)
      .then((response) => {
        if (response && response.account) {
          const userEmail = response.account.username;

          fetch(
            `https://localhost:45455/api/User/getUserRoleByEmail/${encodeURIComponent(
              userEmail
            )}`
          )
            .then((res) => {
              if (!res.ok) {
                throw new Error(
                  `Erreur lors de la récupération des rôles : ${res.statusText}`
                );
              }
              return res.json();
            })
            .then((data) => {
              if (data && data.role) {
                const currentUser = {
                  username: data.displayName,
                  name: data.displayName,
                  role: data.role,
                };

                login(currentUser);

                if (data.role === "Administrateur" || data.role === "Responsable") {
                  navigate("/home", { replace: true });
                } else if (data.role === "Collaborateur") {
                  navigate("/profil", { replace: true });
                } else {
                  setError(
                    "Rôle inconnu. Veuillez contacter votre administrateur."
                  );
                }
              } else {
                setError("Erreur lors de la récupération du rôle de l'utilisateur.");
              }
            })
            .catch((e) => {
              console.error(
                "Erreur lors de la récupération du rôle de l'utilisateur:",
                e
              );
              setError(
                "Impossible de récupérer le rôle de l'utilisateur. Veuillez réessayer."
              );
            });
        }
      })
      .catch((e) => {
        console.error("Échec de la connexion:", e);
        setError("La connexion a échoué. Veuillez réessayer.");
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url("./images/back6.webp")`,
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
              <img
                src="./images/logo.jpeg"
                alt="Logo"
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  position: "absolute",
                  top: "0%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
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
                Bienvenue sur ProfilFlow !
              </Typography>
              {error && (
                <Typography sx={{ color: "red", mt: 1 }}>{error}</Typography>
              )}
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#fff",
                  mt: 2,
                  textAlign: "center",
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px #000000",
                  fontFamily: "Cursive",
                  animation: "pulse 2s infinite",
                  fontSize: "1.1rem",
                }}
              >
                Optimisez votre parcours professionnel et mettez à jour vos
                compétences.
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
              onClick={handleLogin}
              startIcon={<MicrosoftIcon />}
            >
              Connectez-vous
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
