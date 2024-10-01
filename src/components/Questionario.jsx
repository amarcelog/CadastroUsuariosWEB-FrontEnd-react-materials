import React, { useState } from 'react';
import { Button, RadioGroup, FormControlLabel, Radio, Typography, Box } from '@mui/material';

const perguntas = [
  {
    id: 1,
    texto: 'Qual é a sua cor favorita?',
    opcoes: ['Vermelho', 'Azul', 'Verde', 'Amarelo'],
  },
  {
    id: 2,
    texto: 'Qual é o seu animal favorito?',
    opcoes: ['Cachorro', 'Gato', 'Pássaro', 'Peixe'],
  },
  {
    id: 3,
    texto: 'Qual é a sua comida favorita?',
    opcoes: ['Pizza', 'Hambúrguer', 'Sushi', 'Salada'],
  },
];

const Questionario = () => {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState({});

  const handleChange = (event) => {
    setRespostas({
      ...respostas,
      [perguntas[indiceAtual].id]: event.target.value,
    });
  };

  const handleNext = () => {
    if (indiceAtual < perguntas.length - 1) {
      setIndiceAtual(indiceAtual + 1);
    }
  };

  const handleBack = () => {
    if (indiceAtual > 0) {
      setIndiceAtual(indiceAtual - 1);
    }
  };

 return (
   <Box sx={{ maxWidth: "400px", marginTop:"20px", padding:"20px", borderRadius:"8px", boxShadow:"0px4px10px rgba(0.0.0.02)" }}>
     <Typography variant="h6" gutterBottom>
       {perguntas[indiceAtual].texto}
     </Typography>
     <RadioGroup value={respostas[perguntas[indiceAtual].id] || ""} onChange={handleChange}>
       {perguntas[indiceAtual].opcoes.map((opcao,index)=>(
         <FormControlLabel key={index} value={opcao} control={<Radio />} label={opcao}/>
       ))}
     </RadioGroup>
     <Box sx={{ display:"flex", justifyContent:"space-between", marginTop:"20px"}}>
       <Button variant="contained" color="primary" onClick={handleBack} disabled={indiceAtual===0}>
         Voltar
       </Button>
       <Button variant="contained" color="primary" onClick={handleNext} disabled={indiceAtual===perguntas.length-1}>
         Próximo
       </Button>
     </Box>
   </Box>
 );
};

export default Questionario;



