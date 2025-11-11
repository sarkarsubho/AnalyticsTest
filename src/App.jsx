import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import PDFViewer from "./components/PDFViewer";
import pdf from "./assets/OrderDetails.pdf";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video" element={<Video />} />
        <Route path="/pdf" element={<PDFViewer pdfUrl={pdf} />} />
      </Routes>
    </>
  );
}

export default App;
