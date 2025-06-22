import './App.css';
import React from "react";
import { Routes, Route } from "react-router-dom";
import ManageProduct from "./product/ManageProduct";
import AddProduct from "./product/AddProduct";
import Main from "./Main";
import ShowProductDetail from "./product/ShowProductDetail";
import ShowMemberDetail from "./member/ShowMemberDetail";
import ShowReviewDetail from "./review/ShowReviewDetail";

function App() {
  return (
      <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/management/product' element={<ManageProduct />} />
          <Route path="/management/product/add" element={<AddProduct />} />
          <Route path="/management/product/detail/:prdCode" element={<ShowProductDetail />} />
          <Route path="/management/member/detail/:memId" element={<ShowMemberDetail />} />
          <Route path="/management/review/detail/:reviewNo" element={<ShowReviewDetail />} />
      </Routes>
  );
}

export default App;
