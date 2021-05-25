import React,{useCallback,useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UpdatePlaces from './places/pages/UpdatePlaces';
import Auth from './user/pages/Auth';
import {AuthContext} from './shared/context/auth-context';
import {useAuth} from "./shared/hooks/auth-hook";

const App = () => {

  const {token,userId,login,logout} = useAuth();

  let routes;

  //Seperating different routes for Loggedin
  if(token){
    routes= (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlaces />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  }
  else{
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to='/auth' />
      </Switch>
    );
  }

  return (
    //Whenever the VALUE changes the components which are DEPENDENT on the VALUES will be RERENDERED AGAIN
    
    // And VALUE contains the object passed in the "createContext"
    <AuthContext.Provider value={{
      isLoggedIn : !!token,
      token:token,
      userId:userId,
      login:login,
      logout:logout
    }}>
      <Router>
        <MainNavigation />
        <main>
          {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
