import React, { useState } from "react";
import { Typography, Grid, Container, Card, CardContent, CardMedia, CardActionArea, Popover, Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import CVTemplate1 from "./templates/template1";
import CVTemplate2 from "./templates/template2";
import CVTemplate3 from "./templates/template3";

const templateImages = {
  template1: "/images/1.PNG",
  template2: "/images/2.PNG",
  template3: "/images/3.PNG",
  template4: "/images/4.PNG",
  template5: "/images/5.PNG",
  template6: "/images/6.PNG",
};

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[10],
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center',
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
  pointerEvents: 'none',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '300px',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const Modele = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const handlePopoverOpen = (event, template) => {
    setHoveredTemplate(template);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setHoveredTemplate(null);
    setAnchorEl(null);
  };

  return (
    <Container maxWidth="xl" sx={{ paddingTop: 2, paddingBottom: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
        Bibliothèque de Modèles
      </Typography>
      <Typography variant="body1" align="center" sx={{ marginBottom: 4 }}>
        Explorez notre collection de modèles pour vos besoins.
      </Typography>

      <Grid container spacing={4}>
        {Object.keys(templateImages).map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template}>
            <StyledCard
              onMouseEnter={(event) => handlePopoverOpen(event, template)}
              onMouseLeave={handlePopoverClose}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={templateImages[template]}
                  alt={`Modèle ${template}`}
                />
                <StyledCardContent>
                  <Typography variant="h5" gutterBottom>
                    {`Modèle ${template}`}
                  </Typography>
                </StyledCardContent>
              </CardActionArea>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <StyledPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {hoveredTemplate && (
          <StyledBox>
            <Typography variant="h5" align="center" gutterBottom>
              {`Modèle ${hoveredTemplate}`}
            </Typography>
            <img
              src={templateImages[hoveredTemplate]}
              alt={`Modèle ${hoveredTemplate}`}
              style={{ width: '100%', transform: 'translateY(-30px)' }}
            />
          </StyledBox>
        )}
      </StyledPopover>
    </Container>
  );
};

export default Modele;
