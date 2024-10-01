import React from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const MenuComponent = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Gestão
        </Typography> {/* Move 'Gestão' to the left */}

        <Button color="inherit" onClick={handleClick}>
          Menu
        </Button> {/* Renamed to 'Menu' for clarity */}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleClose} component={Link} to="/usuarios">Usuários</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/perguntas">Perguntas</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/quest_resp">Questionários Respondidos</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default MenuComponent;

