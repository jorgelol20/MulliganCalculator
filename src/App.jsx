import { useState, Fragment } from 'react'
import { BrowserRouter } from 'react-router-dom';
import Content from './components/pages/Content.jsx';
import CardProvider from './context/CardProvider.jsx';
import './App.css'
import ErrorProvider from './context/ErrorProvider.jsx';
import Footer from './components/structure/Footer.jsx';
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {

  return (
    <>
      <SpeedInsights/>
      <div className='app'>
        <h1 id='mainTitle'>Calculadora de Mulligan</h1>
        <BrowserRouter>
          <ErrorProvider>
            <CardProvider>
              <Content />
              <Footer/>
            </CardProvider>
          </ErrorProvider>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
