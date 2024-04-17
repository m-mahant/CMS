import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/home';
import NewPost from './components/create_blog';
import EditPost from './components/edit_blog';
import Navbar from './components/navbar';
import Register from './components/register';
import Login from './components/login';
import BlogDetail from './components/blog-detail';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<NewPost />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </Router>
  );
}

export default App;
