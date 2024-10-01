import React from 'react'; // Importa a biblioteca React.
import ReactDOM from 'react-dom/client'; // Importa a biblioteca ReactDOM para renderização.
import './index.css'; // Importa o arquivo CSS global.
import App from './App'; // Importa o componente principal da aplicação.
import reportWebVitals from './reportWebVitals'; // Importa uma ferramenta de medição de performance.

// Cria uma raiz para renderizar a aplicação no elemento HTML com id 'root'.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza a aplicação dentro do modo estrito do React, que ajuda na detecção de problemas potenciais.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Função opcional para medir performance da aplicação.
// Pode ser usada para enviar resultados a um endpoint ou logar no console.
// Saiba mais: https://bit.ly/CRA-vitals
reportWebVitals();
