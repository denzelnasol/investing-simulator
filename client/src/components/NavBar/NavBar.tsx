import React from 'react';

import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate();

  const signOutUser = () => {
    Cookies.remove('token');
    navigate('login');
  };

  const guestItems = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      url: '/',
    },
    {
      label: 'About Us',
      icon: 'pi pi-fw pi-info-circle',
      url: '/about',
    },
  ];
  const userItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      url: '/dashboard',
    },
    {
      label: 'Competitions',
      icon: 'pi pi-fw pi-info-circle',
      url: '/competition-list',
    },
  ];

  const isUserLoggedIn: boolean = Cookies.get('token') ? true : false;

  const loginButton = (
    <Link to="/login" style={{ textDecoration: 'none' }}>
      <Button
        label='Login'
        icon='pi pi-sign-in'
        className='p-button-secondary p-ml-auto'

      />
    </Link>
  );

  const loggedInLeftNavBar = (
    <div className="flex">

      <Button
        label="Trade"
        icon='pi pi-money-bill'
        className='p-button-secondary p-ml-auto mr-2'
        onClick={() => navigate('/stock-table')}
      />

      <Button
        label='Logout'
        icon='pi pi-sign-out'
        className='p-button-secondary p-ml-auto'
        onClick={signOutUser}
      />
    </div>
  );

  const userMenu = (
    <Menubar model={userItems} end={loggedInLeftNavBar} style={{ color: 'var(--primary-color) ' }} />
  );

  const guestMenu = (
    <Menubar model={guestItems} end={loginButton} style={{ color: 'var(--primary-color)' }} />
  );

  return (
    <div className='navbar' >
      {isUserLoggedIn ? userMenu : guestMenu}
    </div>
  );
}

export default Navbar;
