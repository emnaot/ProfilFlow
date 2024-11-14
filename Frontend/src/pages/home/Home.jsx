import React from "react";
import { Grid } from "@mui/material";

import FeaturedPost from "./FeaturedPost";
import ImporterMission from "./ImporterMission";
import FormulaireProfil from "./Formulaire";

const Home = () => {
  return (
    <Grid container spacing={4}>
      {}
      <Grid item xs={12}>
        <FeaturedPost />
      </Grid>

    {}
      <Grid item xs={12} container spacing={4} justifyContent="space-between">
        {}
        <Grid item xs={12} md={6}>
          <ImporterMission />
        </Grid>

        {}
        <Grid item xs={12} md={6}>
          <FormulaireProfil />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
