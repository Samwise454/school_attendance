// App.jsx
    import React from 'react';
    import { Routes, Route } from 'react-router';
    import Nav from './components/Nav';
    import Home from './Home';
    import Form from './Form';
    import Header from './components/Header';
    import Formheader from './components/Formheader';
    import Done from './Done';
    import Multiple from './Multiple';
    import Footer from './components/Footer';
    import Newschool from './Newschool';
    import Forgotwiper from './Forgotwiper';
    import Admin from './Admin';
    import Afternoon from './Afternoon';
    import Register from './Register';
    import Emisdata from './Emisdata';

    function App() {
      return (
        <Routes>
          <Route path="/nav" element={<Nav />} />
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/header" element={<Header />} />
          <Route path="/formheader" element={<Formheader />} />
          <Route path="/done" element={<Done />} />
          <Route path="/multiple" element={<Multiple />} />
          <Route path="/newschool" element={<Newschool />} />
          <Route path="/forgotwiper" element={<Forgotwiper />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/afternoon" element={<Afternoon />} />
          <Route path="/register" element={<Register />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/emisdata" element={<Emisdata />} />
        </Routes>
      );
    }

    export default App;