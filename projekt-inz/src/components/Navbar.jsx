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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Human resource management
        </Typography>
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={user.photos[0].value} alt={user.displayName} sx={{ marginRight: 1 }} />
            <Box sx={{ marginRight: 1 }}>
              <Typography variant="body2">{user.displayName}</Typography>
            </Box>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Link to="login" className="link">
            <Button color="inherit">Logowanie</Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
