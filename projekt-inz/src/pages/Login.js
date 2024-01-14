import React from "react";
import { Container, Paper, Typography, Button, Box, Avatar } from "@mui/material";
import GoogleIcon from "../img/google.png"; 

const Login = () => {
  const google = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" padding="20px" margin="20px" textAlign="center" gutterBottom style={{ color: 'white' }}>
          Panel logowania
          </Typography>
      <Paper elevation={3} className="login" sx={{ padding: 2, backgroundColor: '#333'}}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
          <Typography variant="h7" component="h1" gutterBottom sx={{ marginBottom: 2, color: 'white' }}>
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
