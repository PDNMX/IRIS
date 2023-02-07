import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Componentes
import NavBar from "./NavBar";
import PieDePagina from "./PieDePagina";

//Paginas
import Bandera1 from "../Paginas/Bandera1";
import Bandera2 from "../Paginas/Bandera2";
import Bandera3 from "../Paginas/Bandera3";
import Bandera4 from "../Paginas/Bandera4";
import Bandera5 from "../Paginas/Bandera5";
import Home from "../Paginas/Home";

export default function Main() {
  return (
    <div>
      <Router basename={process.env.PUBLIC_URL}>
        <NavBar />

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/Bandera1" element={<Bandera1 />} />
          <Route exact path="/Bandera2" element={<Bandera2 />} />
          <Route exact path="/Bandera3" element={<Bandera3 />} />
          <Route exact path="/Bandera4" element={<Bandera4 />} />
          <Route exact path="/Bandera5" element={<Bandera5 />} />
        </Routes>
      </Router>
      <PieDePagina/>
    </div>
  );
}
