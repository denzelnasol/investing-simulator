import React from 'react';
import { Routes, Route } from "react-router-dom";

import "primereact/resources/themes/bootstrap4-light-blue/theme.css";     //theme
import "primereact/resources/primereact.min.css";                         //core css
import "primeicons/primeicons.css";                                       //icons
import "primeflex/primeflex.css"

// Components
import Welcome from 'components/Welcome/Welcome';
import Register from 'components/Register/Register';
import Login from 'components/Login/Login';
import Footer from 'components/Footer/Footer'
import Navbar from 'components/NavBar/NavBar';
import Dashboard from 'components/Dashboard/Dashboard'
import Competition from 'components/Competition/Competition';
import Stock from 'components/Stock/Stock';
import CompeteOther from 'components/FillerPage/CompeteOthers';
import PracticeInvest from 'components/FillerPage/practiceInvest'
import RealTimeData from 'components/FillerPage/RealTimeData';
import AboutUs from 'components/FillerPage/AboutUs';
import CompetitionList from 'components/Competition/CompetitionList'
import StockTable from 'components/StockTable/StockTable';

// Styles
import './app.scss';


const App = () => {

  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/competition' element={<Competition />} />
        <Route path='/stock' element={<Stock />} />
        <Route path='/stock-table' element={<StockTable />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/real-time-data' element={<RealTimeData/>}/>
        <Route path='/practice-invest' element={<PracticeInvest/>}/>
        <Route path='/compete-other' element={<CompeteOther/>}/>
        <Route path ='/about' element={<AboutUs/>}/>

        <Route path='competition-list' element={<CompetitionList />}/>

      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
