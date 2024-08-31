import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

export const Navbar: React.FC = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/tarea">Gesitón de Tareas</Link></li>
                <li><Link to="/autor">Gesitón de AUtores</Link></li>
            </ul>
        </nav>
    );
}