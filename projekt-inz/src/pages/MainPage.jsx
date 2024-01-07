import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Card, CardContent } from '@mui/material';
import { useScrollTrigger, Fade } from '@mui/material';
import { Link } from 'react-router-dom';

function FadeOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Fade in={!trigger}>
      {children}
    </Fade>
  );
}

function FeatureCard({ title, description }) {
  const cardStyle = {
    marginBottom: '20px',
    transition: 'background-color 0.3s',
    backgroundColor: '#333',
    color: 'white',
  };

  const cardHoverStyle = {
    ...cardStyle,
    '&:hover': {
      backgroundColor: '#1976d2',
      color: 'white',
    },
  };

  return (
    <Card sx={cardHoverStyle}>
      <CardContent>
        <Typography variant="h5" component="h2" style={{ color: ' ' }}>{title}</Typography>
        <Typography variant="body1" style={{ color: 'inherit' }}>{description}</Typography>
      </CardContent>
    </Card>
  );
}

function MainPage() {
  return (
    <div className="MainPageBg">
    <Container maxWidth="md">
      <FadeOnScroll>
        <div style={{ marginTop: '20px'}}> {/* Dodano wyśrodkowanie */}
          <Typography variant="h4" component="h1" padding="20px" margin="20px" textAlign="center" gutterBottom style={{ color: 'white' }}>
          System zarządzania zasobami ludzkimi
          </Typography>
            
            {/* Opis aplikacji */}
            <FeatureCard 
              title="Panel pracownika"
              description="Szereg funkcjonalności dla pracowników"
              
            />
            <FeatureCard 
              title="Panel administratora"
              description="Zarządzanie danymi oraz edycja pracowników"
            />
            <FeatureCard 
              title="Uwierzytelnianie użytkowników"
              description="Bezpieczne logowanie i autentykacja użytkowników"
            />
          

            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Przejdź do logowania
                </Button>
              </Link>
            </div>
          </div>
         
        </FadeOnScroll>
      </Container>
    </div>
  );
}

export default MainPage;
