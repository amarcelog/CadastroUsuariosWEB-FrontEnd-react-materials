import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { toast } from 'react-toastify';
import ToastContainer from 'react-toastify';

const SalvarUsuario = ({ onSave }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const handleChangeNome = (event) => {
    setNome(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    if (nome && email) {
      try {
        const response = await fetch(`http://localhost:3333/api/usuarios?email=${email}`);
        const usuario = await response.json();
        if (usuario.length > 0 && usuario[0].email === email) {
          toast.warning('Usuário já existe!');
        } else {
          const responseCriar = await fetch('http://localhost:3333/api/usuarios', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nome,
              email,
              deleted_at: null,
            }),
          });
          const usuarioCriado = await responseCriar.json();
          toast.success('Usuário criado!');
        }
        onSave();
      } catch (error) {
        console.error(error);
      }
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




