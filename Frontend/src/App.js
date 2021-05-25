import React,{ Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

// import Users from './user/pages/Users';
// import NewPlace from './places/pages/NewPlace';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdatePlaces from './places/pages/UpdatePlaces';
// import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';
import {AuthContext} from './shared/context/auth-context';
import {useAuth} from "./shared/hooks/auth-hook";

// This are the routes which are used afterwards so they are not downloaded in user browser initially
const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UpdatePlaces = React.lazy(() => import('./places/pages/UpdatePlaces'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

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
          <Suspense fallback={
            <div className="center">
              <LoadingSpinner />
            </div>
          }>
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
