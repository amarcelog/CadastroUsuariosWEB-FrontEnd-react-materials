import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';

const SalvarUsuario = ({ onSave }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const handleChangeNome = (event) => {
    setNome(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    if (nome && email) {
      onSave({ nome, email });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <TextField label="Nome" value={nome} onChange={handleChangeNome} margin="normal" />
      <TextField label="Email" value={email} onChange={handleChangeEmail} margin="normal" />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Iniciar Questionário
      </Button>
    </Box>
  );
};

export default SalvarUsuario;

