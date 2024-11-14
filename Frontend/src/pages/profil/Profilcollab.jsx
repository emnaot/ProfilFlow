import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Grid, Button, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { styled } from "@mui/material/styles";
import PopupModel from '../modele/PopupModel'; 

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  marginTop: theme.spacing(6),
  background: theme.palette.mode === "dark" ? "linear-gradient(145deg, #333, #444)" : "linear-gradient(145deg, #fff, #eee)",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
  "&:hover": {
    transform: "scale(1.02)",
    transition: "transform 0.3s ease-in-out",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  color: "#0d3d73", 
  fontSize: "1.6rem", 
}));

const EditSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  color: "#0d3d73", 
  fontSize: "1.25rem", 
}));

const FieldContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(4),
  background: theme.palette.mode === "dark" ? "#222" : "#f9f9f9",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
}));

const FieldTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: "#0d3d73", 
  marginBottom: theme.spacing(1),
  fontSize: "1.25rem", 
}));

const FieldValue = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  lineHeight: 1.6,
  whiteSpace: 'pre-line',
}));

const ButtonContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(2),
}));

const Profil = ({ collaboratorId }) => {
  const [cv, setCv] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editCV, setEditCV] = useState({});
  const [loading, setLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://localhost:45455/api/CV/getCVById/${collaboratorId}`)
      .then(response => response.json())
      .then(data => {
        setCv(data);
        setEditCV(data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du CV:', error);
      })
      .finally(() => setLoading(false));
  }, [collaboratorId]);

  const handleUpdateClick = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    if (!collaboratorId) {
      alert('Erreur : ID du collaborateur non disponible.');
      return;
    }
    console.log("cv data-test1", editCV);
    console.log("cv data-test2", editCV[0]["Nom et Prénom"]);
    const formattedCV = [{
      "Nom et Prénom": editCV[0]["Nom et Prénom"],
      "Titre du cv": editCV[0]["Titre du cv"],
      "Informations personnelles": editCV[0]["Informations Personnelles"],
      "Education": editCV[0]["Education"],
      "Compétences": editCV[0]["Compétences"],
      "Projet Académique": editCV[0]["Projet Académique"],
      "Experience professionnelle": editCV[0]["Experience Professionnelle"],
      "Langues": editCV[0]["Langues"],
      "Certifications": editCV[0]["Certifications"],
      "Vie Associative": editCV[0]["Vie Associative"],
      "Centre d'interet": editCV[0]["Centre d'interet"]
    }];

    setLoading(true);
    console.log("test123", formattedCV)
    console.log('Données envoyées :', JSON.stringify(formattedCV));

    fetch(`https://localhost:45455/api/CV/updateCVById/${collaboratorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedCV),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Réponse réseau non OK');
        }
        return response.json();
      })
      .then(() => {
        setCv(editCV);
        setEditMode(false);
        alert("CV mis à jour avec succès !");
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du CV:', error);
        alert("Erreur lors de la mise à jour du CV: " + error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    setEditCV(cv);
    setEditMode(false);
  };

  const handleGenerateClick = () => {
    setSelectedCV(cv); // Ajoutez ceci pour stocker les données de CV sélectionnées
    console.log('CV sélectionné:', cv); 
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const renderContent = (key, value) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <FieldContainer key={key}>
          {Object.keys(value).map(subKey => (
            <div key={subKey} style={{ marginLeft: '20px' }}>
              <FieldTitle variant="subtitle2">{subKey}:</FieldTitle>
              <FieldValue variant="body2">{value[subKey]}</FieldValue>
            </div>
          ))}
        </FieldContainer>
      );
    }
    return (
      <FieldContainer key={key}>
        <FieldTitle variant="h6">{key}</FieldTitle>
        <FieldValue variant="body2">{value}</FieldValue>
      </FieldContainer>
    );
  };

  const renderEditContent = (key, value, path) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <div style={{ marginLeft: '20px' }}>
          {Object.keys(value).map(subKey => (
            <div key={subKey}>
              <EditSectionTitle>{subKey}</EditSectionTitle>
              {renderEditContent(subKey, value[subKey], `${path}.${subKey}`)}
            </div>
          ))}
        </div>
      );
    }
    return (
      <TextField
        fullWidth
        multiline
        variant="outlined"
        value={value || ""}
        onChange={e => {
          const newValue = e.target.value;
          setEditCV(prevState => {
            const newState = { ...prevState };
            const keys = path.split('.');
            let obj = newState;
            for (let i = 0; i < keys.length - 1; i++) {
              obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = newValue;
            return newState;
          });
        }}
      />
    );
  };

  if (loading) return <CircularProgress />;

  if (!cv) return <Typography>Chargement du CV...</Typography>;

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 8 }}>
      <StyledPaper>
        {editMode ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <EditSectionTitle>Photo du Collaborateur</EditSectionTitle>
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
              {photo && (
                <img 
                  src={photo} 
                  alt="Collaborateur" 
                  style={{ 
                    marginTop: '20px', 
                    width: '150px', 
                    height: '150px', 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }} 
                />
              )}
            </div>
            {Object.keys(cv).map(key => (
              <div key={key}>
                {renderEditContent(key, cv[key], key)}
              </div>
            ))}
            <ButtonContainer container>
              <Grid item>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Enregistrer
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" onClick={handleCancel}>
                  Annuler
                </Button>
              </Grid>
            </ButtonContainer>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {photo && (
                <img 
                  src={photo} 
                  alt="Collaborateur" 
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    borderRadius: '50%', 
                    objectFit: 'cover' 
                  }} 
                />
              )}
            </div>
            {Object.keys(cv).map(key => renderContent(key, cv[key]))}
            <ButtonContainer container>
              <Grid item>
                <Button variant="contained" color="primary" onClick={handleUpdateClick}>
                  Mettre à jour
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" style={{ backgroundColor: '#0d3d73', color: '#fff' }} onClick={handleGenerateClick}>
                  Générer
                </Button>
              </Grid>
            </ButtonContainer>
          </>
        )}
      </StyledPaper>
      <Dialog open={openPopup} onClose={handleClosePopup} fullScreen>
        <DialogTitle>Contenu du Modèle</DialogTitle>
        <DialogContent>
          <PopupModel selectedCV={selectedCV} /> {/* Passez les données de CV au composant Modele */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profil;
