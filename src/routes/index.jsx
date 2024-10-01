import React from "react";
import { Routes, Route }from "react-router-dom";
import HomePage from '../pages';
import Usuarios from "../components/Usuarios.jsx";
import Perguntas from "../components/Perguntas";
import QuestionariosRespondidos from "../components/QuestionariosRespondidos";

const RoutesApp=() =>{
return(
<Routes >
<Route path="/"element={<HomePage />} />
<Route path="/usuarios"element={<Usuarios />} />
<Route path="/perguntas"element={<Perguntas />} />
<Route path="/quest_resp"element={<QuestionariosRespondidos />} />

</Routes >

);
};
export default RoutesApp;







