import React from 'react';
import { Container, Paper, Typography, Box, Grid, Avatar, Divider, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import StarIcon from '@mui/icons-material/Star';
import InterestsIcon from '@mui/icons-material/Interests';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
  backgroundColor: '#2c3e50',
  color: 'white',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius * 2,
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  color: '#1abc9c',
  fontSize: '18px',
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: '#ecf0f1',
  fontSize: '14px',
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: theme.spacing(1),
  borderBottom: '2px solid #1abc9c',
  paddingBottom: theme.spacing(1),
  fontSize: '14px',
}));

const DividerStyled = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  backgroundColor: '#1abc9c',
}));

const Sidebar = styled(Box)(({ theme }) => ({
  backgroundColor: '#ecf0f1',
  padding: theme.spacing(1),
  borderRadius: '10px',
}));

const CVTemplate4 = ({ cvData }) => {
  if (!cvData) return <Typography>Chargement des données du CV...</Typography>;

  return (
    <Container maxWidth="lg">
      <StyledPaper>
        <Header>
          <Avatar alt={cvData["Nom et Prénom"]} src="/static/images/avatar/1.jpg" sx={{ width: 80, height: 80, margin: 'auto', border: '3px solid #1abc9c' }} />
          <Box mt={2}>
            <Title variant="h4">{cvData["Nom et Prénom"]}</Title>
            <Subtitle variant="h6">{cvData["Titre du cv"]}</Subtitle>
          </Box>
        </Header>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Sidebar>
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
                <SectionTitle variant="h6">Langues</SectionTitle>
                <List>
                  <ListItem>
                    <ListItemText primary={cvData["Langues"]} />
                  </ListItem>
                </List>
              </Section>

              <DividerStyled />

              <Section>
                <SectionTitle variant="h6">Compétences</SectionTitle>
                <List>
                  <ListItem>
                    <ListItemText primary={cvData["Compétences"]} />
                  </ListItem>
                </List>
              </Section>

              <DividerStyled />

              <Section>
                <SectionTitle variant="h6">Certifications</SectionTitle>
                <List>
                  <ListItem>
                    <ListItemText primary={cvData["Certifications"]} />
                  </ListItem>
                </List>
              </Section>

              <DividerStyled />

              <Section>
                <SectionTitle variant="h6">Centres d'intérêt</SectionTitle>
                <List>
                  <ListItem>
                    <ListItemText primary={cvData["Centre d'interet"]} />
                  </ListItem>
                </List>
              </Section>
            </Sidebar>
          </Grid>

          <Grid item xs={12} md={8}>
            <Section>
              <SectionTitle variant="h5">Parcours Professionnel</SectionTitle>
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
              <SectionTitle variant="h5">Vie Associative</SectionTitle>
              <Typography variant="body2">{cvData["Vie Associative"]}</Typography>
            </Section>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
}

export default CVTemplate4;
