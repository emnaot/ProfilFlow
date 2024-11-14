import React from 'react';
import { Container, Paper, Typography, Box, Grid, Avatar, Divider, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

const A4_WIDTH = '210mm';
const A4_HEIGHT = '297mm';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  background: '#f4f4f9',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
  width: A4_WIDTH,
  height: A4_HEIGHT,
  boxSizing: 'border-box',
  margin: '0 auto',
  overflow: 'hidden',
}));

const Header = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  fontSize: '20px',
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: '#666',
  fontSize: '14px',
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#3A3A3A',
  marginBottom: theme.spacing(1),
  borderBottom: '2px solid #3A3A3A',
  paddingBottom: theme.spacing(1),
  fontSize: '16px',
}));

const DividerStyled = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}));

const CVTemplate3 = ({ cvData }) => {
  if (!cvData) return <Typography>Chargement des données du CV...</Typography>;

  return (
    <Container maxWidth="lg">
      <StyledPaper>
        <Header>
          <Avatar alt={cvData["Nom et Prénom"]} src="/static/images/avatar/1.jpg" sx={{ width: 80, height: 80, margin: 'auto' }} />
          <Box mt={2}>
            <Title variant="h4">{cvData["Nom et Prénom"]}</Title>
            <Subtitle variant="h6">{cvData["Titre du cv"]}</Subtitle>
          </Box>
        </Header>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Section>
              <SectionTitle variant="h6">Contact</SectionTitle>
              <List>
                <ListItem>
                  <ListItemText primary={cvData["Informations Personnelles"]} />
                </ListItem>
              </List>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h6">Compétences</SectionTitle>
              <Typography variant="body2">{cvData["Compétences"]}</Typography>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h6">Centres d'intérêt</SectionTitle>
              <Typography variant="body2">{cvData["Centre d'interet"]}</Typography>
            </Section>
          </Grid>

          <Grid item xs={12} md={8}>
            <Section>
              <SectionTitle variant="h5">Expérience Professionnelle</SectionTitle>
              <Typography variant="body2">{cvData["Experience Professionnelle"]}</Typography>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h5">Formation</SectionTitle>
              <Typography variant="body2">{cvData["Education"]}</Typography>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h5">Projet Académique</SectionTitle>
              <Typography variant="body2">{cvData["Projet Académique"]}</Typography>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h5">Certifications</SectionTitle>
              <Typography variant="body2">{cvData["Certifications"]}</Typography>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h5">Vie Associative</SectionTitle>
              <Typography variant="body2">{cvData["Vie Associative"]}</Typography>
            </Section>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
}

export default CVTemplate3;
