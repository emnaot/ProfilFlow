import React from 'react';
import { Container, Paper, Typography, Box, Grid, Avatar, Divider, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

const A4_WIDTH = '210mm';
const A4_HEIGHT = '297mm';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  background: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
  width: A4_WIDTH,
  height: A4_HEIGHT,
  boxSizing: 'border-box',
  margin: '0 auto',
  overflow: 'hidden',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  backgroundColor: '#3A3A3A',
  color: 'white',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  color: '#F4F4F9',
  fontSize: '20px',
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: '#CCCCCC',
  fontSize: '14px',
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#3A3A3A',
  marginBottom: theme.spacing(1),
  fontSize: '16px',
}));

const DividerStyled = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  backgroundColor: '#3A3A3A',
}));

const Sidebar = styled(Box)(({ theme }) => ({
  backgroundColor: '#F4F4F9',
  padding: theme.spacing(1),
  borderRadius: '10px',
  overflow: 'hidden',
}));

const CVTemplate1 = ({ cvData }) => {
  if (!cvData) return <Typography>Chargement des données du CV...</Typography>;

  return (
    <Container maxWidth="lg">
      <StyledPaper>
        <Header>
          <Avatar alt={cvData["Nom et Prénom"]} src="/static/images/avatar/1.jpg" sx={{ width: 80, height: 80, marginRight: 2 }} />
          <Box>
            <Title variant="h4">{cvData["Nom et Prénom"]}</Title>
            <Subtitle variant="h6">{cvData["Titre du cv"]}</Subtitle>
          </Box>
        </Header>

        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Sidebar>
              <Section>
                <SectionTitle variant="h6">CONTACT</SectionTitle>
                <List>
                  <ListItem>
                    <ListItemText primary={cvData["Informations Personnelles"]} />
                  </ListItem>
                </List>
              </Section>

              <DividerStyled />

              <Section>
                <SectionTitle variant="h6">COMPÉTENCES</SectionTitle>
                <Typography variant="body2">{cvData["Compétences"]}</Typography>
              </Section>

              <DividerStyled />

              <Section>
                <SectionTitle variant="h6">LANGUES</SectionTitle>
                <Typography variant="body2">{cvData["Langues"]}</Typography>
              </Section>

              <DividerStyled />

              <Section>
                <SectionTitle variant="h6">CENTRES D'INTÉRÊTS</SectionTitle>
                <Typography variant="body2">{cvData["Centre d'interet"]}</Typography>
              </Section>
            </Sidebar>
          </Grid>

          <Grid item xs={12} md={7}>
            <Section>
              <SectionTitle variant="h5">FORMATION</SectionTitle>
              <Typography variant="body2">{cvData["Education"]}</Typography>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h5">EXPÉRIENCE PROFESSIONNELLE</SectionTitle>
              <Typography variant="body2">{cvData["Experience Professionnelle"]}</Typography>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h5">PROJET ACADÉMIQUE</SectionTitle>
              <Typography variant="body2">{cvData["Projet Académique"]}</Typography>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h5">CERTIFICATIONS</SectionTitle>
              <Typography variant="body2">{cvData["Certifications"]}</Typography>
            </Section>

            <DividerStyled />

            <Section>
              <SectionTitle variant="h5">VIE ASSOCIATIVE</SectionTitle>
              <Typography variant="body2">{cvData["Vie Associative"]}</Typography>
            </Section>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
}

export default CVTemplate1;
