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
    transition: 'background-color 0.3s', // Dodaje płynne przejście koloru
  };

  const cardHoverStyle = {
    ...cardStyle,
    '&:hover': {
      backgroundColor: '#1976d2',
      color: 'white', // Zmienia kolor tekstu po najechaniu
    },
  };

  return (
    <Card sx={cardHoverStyle}>
      <CardContent>
        <Typography variant="h5" component="h2">{title}</Typography>
        <Typography variant="body1">{description}</Typography>
      </CardContent>
    </Card>
  );
}

function MainPage() {
  return (
    <div classname="MainPageBg">
      
      <Container maxWidth="md">
        <FadeOnScroll>
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              
              Welcome to HR Management
              
            </Typography>
            
            {/* Opis aplikacji */}
            <FeatureCard 
              title="Feature 1"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
              
            />
            <FeatureCard 
              title="Feature 2"
              description="Nulla auctor, urna a condimentum ullamcorper, mauris a dui vel velit..."
            />
            <FeatureCard 
              title="Feature 3"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
              
            />
            <FeatureCard 
              title="Feature 4"
              description="Nulla auctor, urna a condimentum ullamcorper, mauris a dui vel velit..."
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
