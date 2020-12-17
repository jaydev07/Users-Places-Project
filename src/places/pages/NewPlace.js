import React,{useCallback,useReducer, useContext} from 'react';
import {useHistory} from 'react-router-dom';

import './NewPlace.css';
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../../shared/components/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {useForm} from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-fetch-hoock';
import {AuthContext} from "../../shared/context/auth-context";
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";


const NewPlace = () => {

  // For adding the data to BACKEND
  const {isLoading , error , sendRequest , clearError} = useHttpClient();

  const auth = useContext(AuthContext);

  const [formState,inputHandler] = useForm({
    title:{
      value:"",
      isValid:false
    },
    description:{
      value:"",
      isValid:false
    }
  },false);

  // For fingibg the history
  const history = useHistory();


  const submitHandeler = async (event) => {
    event.preventDefault();

    try{

      await sendRequest('http://localhost:5000/api/places/',
        'POST',
        {
          'Content-Type':'application/json'
        },
        JSON.stringify({
          title:formState.inputs.title.value,
          description:formState.inputs.description.value,
          address:formState.inputs.address.value,
          // Sending the userId from FRONTEND TO BACKEND
          creator: auth.userId 
        })
      );

      //Redirecting the user to "/" ROUTE
      history.push("/");
  }catch(err){

  }
}

  return(
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={submitHandeler}>
        { isLoading && <LoadingSpinner asOverlay/>}
        <Input 
          id="title"
          element="input" 
          type="text" 
          label="Title" 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText="Please Enter A Valid Title"
          onInput={inputHandler}
        />

        <Input 
          id="description"
          element="textarea" 
          type="text" 
          label="Description" 
          validators={[VALIDATOR_MINLENGTH(5)]} 
          errorText="Please Enter description gerater then 5"
          onInput={inputHandler}
        />

        <Input 
          id="address"
          element="input" 
          type="text" 
          label="Address" 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText="Please Enter A Valid Address"
          onInput={inputHandler}
        />

          <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
      </form>
    </React.Fragment>
  )
};

export default NewPlace;