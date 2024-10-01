import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import { Menu, SalvarUsuario, Questionario } from '../components';

const HomePage = () => {
  const [usuarioSalvo, setUsuarioSalvo] = useState(false);

  const handleSaveUser = (userData) => {
    // Aqui você pode salvar os dados do usuário conforme necessário.
    console.log('Usuário salvo:', userData);
    setUsuarioSalvo(true);
  };

 return(
<Container maxWidth="sm">
<Menu />
<Box sx={{ display:"flex", flexDirection:"column", alignItems:"center", height:"100vh"}}>
<h1>Bem-vindo ao questionário!</h1>

{!usuarioSalvo ? (
<SalvarUsuario onSave={handleSaveUser} />
):(
<Questionario />

)}
</Box>

</Container>

);

};
 export default HomePage;















