import React from "react";
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import { useNavigate } from "react-router-dom";
import pdf from "../assets/OrderDetails.pdf";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => navigate("/video")}>Go to video Page</button>
        <button onClick={() => navigate("/pdf")}>Go to PDF Page</button>
        <a href={pdf} target="_blank" rel="noopener noreferrer">open pdf</a>
      </div>
    </div>
  );
};

export default Home;
