import React, { useState, useEffect } from "react";
import { Typography, Grid, Container, Card, CardContent, CardMedia, CardActionArea, Button, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import CVTemplate1 from "./templates/template1";
import CVTemplate2 from "./templates/template2";
import CVTemplate3 from "./templates/template3";
import CVTemplate4 from "./templates/template4";
import CVTemplate5 from "./templates/template5";
import CVTemplate6 from "./templates/template6";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const templateImages = {
  template1: "/images/1.png",
  template2: "/images/2.png",
  template3: "/images/3.png",
  template4: "/images/4.png",
  template5: "/images/5.png",
  template6: "/images/6.png",
};

const Modele = ({ selectedCV }) => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleOpen = (template) => {
    setSelectedTemplate(template);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTemplate(null);
  };

  useEffect(() => {
    if (selectedCV) {
      console.log('Données du CV reçu:', selectedCV);
    }
  }, [selectedCV]);

  const handleGeneratePDF = () => {
    const input = document.getElementById('template-to-print');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("cv.pdf");
    });
  };

  return (
    <Container maxWidth="xl" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
        Bibliothèque de Modèles
      </Typography>
      <Typography variant="body1" align="center" sx={{ marginBottom: 4 }}>
        Explorez notre collection de modèles pour vos besoins.
      </Typography>

      <Grid container spacing={4}>
        {Object.keys(templateImages).map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template}>
            <Card sx={{ boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: 10 } }}>
              <CardActionArea onClick={() => handleOpen(template)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={templateImages[template]}
                  alt={`Modèle ${template}`}
                />
                <CardContent sx={{ backgroundColor: 'background.paper', textAlign: 'center' }}>
                  <Typography variant="h5" gutterBottom>
                    {`Modèle ${template}`}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Modèle</DialogTitle>
        <DialogContent>
          <div id="template-to-print">
            {selectedTemplate === "template1" && <CVTemplate1 cvData={selectedCV[0]} />}
            {selectedTemplate === "template2" && <CVTemplate2 cvData={selectedCV[0]} />}
            {selectedTemplate === "template3" && <CVTemplate3 cvData={selectedCV[0]} />}
            {selectedTemplate === "template4" && <CVTemplate4 cvData={selectedCV[0]} />}
            {selectedTemplate === "template5" && <CVTemplate5 cvData={selectedCV[0]} />}
            {selectedTemplate === "template6" && <CVTemplate6 cvData={selectedCV[0]} />}
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleGeneratePDF}>
            Télécharger
          </Button>
          <Button onClick={handleClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Modele;
