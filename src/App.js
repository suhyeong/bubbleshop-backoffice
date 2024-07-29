import './App.css';
import React from "react";
import { Routes, Route } from "react-router-dom";
import ManageProduct from "./ManageProduct";
import AddProduct from "./AddProduct";
import Main from "./Main";
import ShowProductDetail from "./ShowProductDetail";

function App() {
  return (
      <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/management/product' element={<ManageProduct />} />
          <Route path="/management/product/add" element={<AddProduct />} />
          <Route path="/management/product/detail/:prdCode" element={<ShowProductDetail />} />
      </Routes>
  );
}

export default App;
