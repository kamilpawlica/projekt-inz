import React from "react";
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  const logout = () => {
    window.open("http://localhost:5000/auth/logout", "_self");
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {user ? (
            <Typography variant="h6" component="div">
              Human resource management
            </Typography>
          ) : (
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6" component="div">
                Human resource management
              </Typography>
            </Link>
          )}
        </Box>
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={user.photos[0].value} alt={user.displayName} sx={{ marginRight: 1 }} />
            <Box sx={{ marginRight: 1 }}>
              <Typography variant="body2">{user.displayName}</Typography>
            </Box>
            <Button color="inherit" onClick={logout}>
              Wyloguj
            </Button>
          </Box>
        ) : (
          <Link to="/login" className="link" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="inherit">Logowanie</Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
