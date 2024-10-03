import React, { useState, useEffect } from 'react';
import { Button, RadioGroup, FormControlLabel, Radio, Typography, Box } from '@mui/material';
import axios from 'axios';

const Questionario = () => {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [perguntas, setPerguntas] = useState([]);
  const [opcoes, setOpcoes] = useState({});

  useEffect(() => {
    const carregarPerguntas = async () => {
      const resposta = await axios.get('http://localhost:3333/api/perguntas');
      setPerguntas(resposta.data);
    };

    carregarPerguntas();
  }, []);

  useEffect(() => {
    const carregarOpcoes = async () => {
      if (perguntas.length > 0) {
        const opcoesPromisses = perguntas.map((pergunta) => {
          return axios.get(`http://localhost:3333/api/opcoes/${pergunta.id}`);
        });

        const opcoesRespostas = await Promise.all(opcoesPromisses);
        const opcoesData = opcoesRespostas.reduce((acc, resposta) => {
          acc[perguntas.findIndex((pergunta) => pergunta.id === resposta.data[0].id_pergunta)] = resposta.data;
          return acc;
        }, {});

        setOpcoes(opcoesData);
      }
    };

    carregarOpcoes();
  }, [perguntas]);

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
      {perguntas.length > 0 && opcoes[indiceAtual] && (
        <div>
          <Typography variant="h6" gutterBottom>
            {perguntas[indiceAtual].descricao}
          </Typography>
          <RadioGroup value={respostas[perguntas[indiceAtual].id] || ""} onChange={handleChange}>
            {opcoes[indiceAtual].map((opcao) => (
              <FormControlLabel key={opcao.id} value={opcao.descricao} control={<Radio />} label={opcao.descricao} />
            ))}
          </RadioGroup>
          <Box sx={{ display:"flex", justifyContent:"space-between", marginTop:"20px"}}>
            <Button variant="contained" color="primary" onClick={handleBack} disabled={indiceAtual === 0}>
              Voltar
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext} disabled={indiceAtual === perguntas.length - 1}>
              Próximo
            </Button>
          </Box>
        </div>
      )}
    </Box>
  );
};

export default Questionario;




