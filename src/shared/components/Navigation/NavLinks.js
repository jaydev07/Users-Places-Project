import React,{useContext} from 'react';
import { NavLink } from 'react-router-dom';

import './NavLinks.css';
import {AuthContext} from '../../context/auth-context';

const NavLinks = props => {

  // useConext is a hook used to take a state(object) present in a CONTEXT(AuthContext)

  // Whenever auth changes this component will RERENDER
  const auth = useContext(AuthContext);

  return (
  <ul className="nav-links">
    <li>
      <NavLink to="/" exact>ALL USERS</NavLink>
    </li>

    {/* MY PLACES will only render when isLoggedIn is TRUE */}
    { 
      auth.isLoggedIn && <li>
      <NavLink to="/u1/places">MY PLACES</NavLink>
    </li> 
    }

    {
      auth.isLoggedIn && <li>
      <NavLink to="/places/new">ADD PLACE</NavLink>
    </li>
    }
    
    {
      !auth.isLoggedIn && <li>
        <NavLink to="/auth">AUTHENTICATE</NavLink>
    </li>
    }
    
    {
      auth.isLoggedIn && <li>
        <button onClick={auth.logout}>LOGOUT</button>
      </li>
    }
  </ul>
  );
};

export default NavLinks;