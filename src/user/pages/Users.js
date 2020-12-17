import React,{useEffect,useState} from 'react';

import UsersList from '../components/UsersList';
import ErrorModel from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {useHttpClient} from '../../shared/hooks/http-fetch-hoock';

const Users = () => {

  //const [isLoading,setIsLoading] = useState(false);
  //const [error,setError] = useState();

  const {isLoading , error , sendRequest , clearError} = useHttpClient();
  // We have to store the USERS in a STATE because we are fetching from DATABASE
  const [dataArrived ,setDataArrived] = useState();

  let USERS;

  // We have to use USEFFECT because it will not create INFINITE LOOP for FETCH
  useEffect(() => {
    const fetchUsers = async () => {
      /* DIRECTLY USING FETCH
      try{
        setIsLoading(true);

        // By Default FETCH give a GET REQUEST
        const response = await fetch('http://localhost:5000/api/users/');
  
        const responseData = await response.json();
  
        if(responseData.message && responseData.message==="Something wrong!"){
          throw Error(responseData.message);
        }

        console.log(responseData.users);
        setIsLoading(false);

        // After getting the data from DATABASE update the STATE
        setDataArrived(responseData.users);
      }catch(err){
        setIsLoading(false);
        console.log(err);
        setError(responseData.message);
      }
      
      */

      const resposedata = await sendRequest('http://localhost:5000/api/users/');
      setDataArrived(resposedata.users);
    }

    fetchUsers();
    
  } , [sendRequest] ); 

  /*
  const handleError = () => {
    setError(null);
  }*/

  return (
    <React.Fragment>
      <ErrorModel error={error} onClear={clearError} />
      { isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )} 
      { !isLoading && dataArrived && <UsersList items={dataArrived} /> }
    </React.Fragment>
  )
};

export default Users;
