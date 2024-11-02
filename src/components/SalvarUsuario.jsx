import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import api from "../_service/api";

const CriarUsuario = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const verificarUsuarioExistente = async (email) => {
    try {
      const response = await api.get(`/usuarios?email=${email}`);
      return response.data.length > 0;
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      return false;
    }
  };

  const criarUsuario = async () => {
    if (!nome || !email) {
      toast.error('Por favor, preencha todos os campos!');
      return;
    }

    try {
      const usuarioExiste = await verificarUsuarioExistente(email);
      
      if (usuarioExiste) {
        toast.warning('Usuário já existe!');
        return;
      }

      const response = await api.post("/criarusuarios", {
        nome,
        email,
        deleted_at: null
      });

      if (response.data) {
        toast.success('Usuário cadastrado com sucesso!');
        localStorage.setItem('usuarioId', response.data.id);
        localStorage.setItem('usuarioNome', nome);
        localStorage.setItem('usuarioEmail', email);
        
        // Adicione um pequeno delay antes do redirecionamento
        setTimeout(() => {
          navigate('/questionario');
        }, 1000);
      }

    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao cadastrar usuário. Tente novamente.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await criarUsuario();
  };

  return (
    <Box 
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        maxWidth: 400,
        margin: '0 auto',
        padding: 3
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Cadastro de Usuário
      </Typography>

      <TextField
        fullWidth
        label="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        variant="outlined"
        required
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        required
      />

      <Button 
        fullWidth
        variant="contained" 
        color="primary" 
        type="submit"
        size="large"
      >
        Iniciar Questionário
      </Button>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
};

export default CriarUsuario;







