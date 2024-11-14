import React from 'react';
import { Container, Paper, Typography, Box, Grid, Avatar, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  background: '#f4f4f9',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  backgroundColor: '#f4f4f9',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  borderBottom: `4px solid ${theme.palette.primary.main}`,
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  fontSize: '1.5rem', // réduction de la taille du titre principal
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1),
  fontSize: '1.25rem', 
}));

const DividerStyled = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  backgroundColor: theme.palette.primary.main,
}));

const Sidebar = styled(Box)(({ theme }) => ({
  backgroundColor: '#e0f7fa',
  padding: theme.spacing(2),
  borderRadius: '10px',
}));

const CVTemplate5 = ({ cvData }) => {
  if (!cvData) return <Typography>Chargement des données du CV...</Typography>;

  return (
    <Container maxWidth="lg">
      <StyledPaper>
        <Header>
          <Avatar alt={cvData["Nom et Prénom"]} src="/static/images/avatar/1.jpg" sx={{ width: 80, height: 80, marginRight: 2 }} />
          <Box>
            <Title variant="h4">{cvData["Nom et Prénom"]}</Title>
            <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>{cvData["Titre du cv"]}</Typography>
            <Typography variant="body2" mt={2} sx={{ fontSize: '0.8rem' }}>{cvData["Informations Personnelles"]}</Typography>
          </Box>
        </Header>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Sidebar>
              <Section>
                <SectionTitle variant="h6">Compétences</SectionTitle>
                <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>{cvData["Compétences"]}</Typography>
              </Section>

              <DividerStyled />

              <Section>
                <SectionTitle variant="h6">Langues</SectionTitle>
                <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>{cvData["Langues"]}</Typography>
              </Section>

              <DividerStyled />

              <Section>
                <SectionTitle variant="h6">Vie Associative</SectionTitle>
                <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>{cvData["Vie Associative"]}</Typography>
              </Section>

              <DividerStyled />

              <Section>
                <SectionTitle variant="h6">Centres d'intérêt</SectionTitle>
                <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>{cvData["Centre d'interet"]}</Typography>
              </Section>
            </Sidebar>
          </Grid>

          <Grid item xs={12} md={8}>
            <Section>
              <SectionTitle variant="h5">Formations</SectionTitle>
              <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>{cvData["Education"]}</Typography>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h5">Expériences Professionnelles</SectionTitle>
              <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>{cvData["Experience Professionnelle"]}</Typography>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h5">Projets Académiques</SectionTitle>
              <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>{cvData["Projet Académique"]}</Typography>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h5">Certifications</SectionTitle>
              <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>{cvData["Certifications"]}</Typography>
            </Section>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
}

export default CVTemplate5;
