import React from "react";
import { Container, Paper, Typography, Button, Box, Avatar } from "@mui/material";
import GoogleIcon from "../img/google.png"; // Zaimportuj ikonę Google

const Login = () => {
  const google = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} className="login" sx={{ padding: 2 }} > {/* Zmniejsz padding */}
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
        <Typography variant="h7" component="h1" gutterBottom sx={{ marginBottom: 2 }}> {/* Zmniejsz rozmiar tekstu i odstęp od dołu */}
            LOGOWANIE
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Avatar src={GoogleIcon} alt="Google" />}
            onClick={google}
            sx={{ mt: 2 }}
          >
            Logowanie za pomocą Google
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
