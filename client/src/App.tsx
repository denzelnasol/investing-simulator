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
import CompetitionCreate from 'components/Competition/CompetitionCreate';

import Private from 'components/Private/Private';

// Styles
import './app.scss';
import InviteAccepted from 'components/Competition/InviteAccepted';


const App = () => {

  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        {/* 'Public' routes */}
        <Route path='/' element={<Welcome />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/real-time-data' element={<RealTimeData/>}/>
        <Route path='/practice-invest' element={<PracticeInvest/>}/>
        <Route path='/compete-other' element={<CompeteOther/>}/>
        <Route path ='/about' element={<AboutUs/>}/>
        <Route path ='/create' element={<CompetitionCreate/>}/>

        {/* Login restricted routes */}
        <Route path='/competition-list' element={<Private componentToRender={CompetitionList} />}/>
        <Route path='/competition' element={<Private componentToRender={Competition} />} />
        <Route path='/stock' element={<Private componentToRender={Stock} />} />
        <Route path='/stock-table' element={<Private componentToRender={StockTable} />} />
        <Route path='/dashboard' element={<Private componentToRender={Dashboard} />} />
        <Route path='/invite-accept' element={<InviteAccepted />} />

      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
