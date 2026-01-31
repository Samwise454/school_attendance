// App.jsx
    import React from 'react';
    import { Routes, Route } from 'react-router';
    import Nav from './components/Nav';
    import Home from './Home';
    import Form from './Form';
    import Header from './components/Header';
    import Formheader from './components/Formheader';
    import Done from './Done';
    import Footer from './components/Footer';

    function App() {
      return (
        <Routes>
          <Route path="/nav" element={<Nav />} />
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/header" element={<Header />} />
          <Route path="/formheader" element={<Formheader />} />
          <Route path="/done" element={<Done />} />
          <Route path="/footer" element={<Footer />} />
        </Routes>
      );
    }

    export default App;