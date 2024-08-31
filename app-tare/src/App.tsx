import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Inicio } from './components/Inicio';
import { ListaTareas } from './components/ListaTareas';
import { ListaAutores } from './components/ListaAutores';
import espe from './assets/espe_1.png';

function App() {
  return (
    <Router>
      <Navbar />      
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/tarea' element={<ListaTareas />} />
        <Route path='/autor' element={<ListaAutores />} />
      </Routes>
    </Router>
  );
}

export default App;
