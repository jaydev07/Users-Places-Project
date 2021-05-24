import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/components/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';
import ErrorModel from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {useHttpClient} from '../../shared/hooks/http-fetch-hoock';
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // For Loading when we are RETERIVING THE DATA FROM DATABASE
  const [isLoading, setIsLoading] = useState(false);

  // When any ERROR OCCURS while RETERIVING THE DATA FROM DATABASE
  const [error,setError] = useState();

  //const {isLoading , error ,sendRequest , clearError} = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      // Signup -> Login
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }

    // Switching the signup & Login
    setIsLoginMode(prevMode => !prevMode);
  };

  // handeling SUBMIT AND BACKEND
  const authSubmitHandler = async event => {
    event.preventDefault();

    console.log(formState.inputs);
    // LOADING THE SCREEN WHILE THE DATA IS RETERIVED
     setIsLoading(true);

    if (isLoginMode) {

      // USING FETCH DIRECTLY
      try{
        const response = await fetch("http://localhost:5000/api/users/login",{
          method:"POST",
          headers:{
            'Content-Type':'application/json'    // Please write this thing PERFECTLY
          },
          body:JSON.stringify({
            email:formState.inputs.email.value,
            password:formState.inputs.password.value
          })
        });

        // We have to convert data to JSON because WEB BROWSER only COMMUNICATES WITH STRNG DATA
        const responseData = await response.json();

        console.log(responseData);

        if(responseData.message){
          throw Error(responseData.message);
        }

        setIsLoading(false);                                   // removing loading when data is arrived
        
        // Giving USERID to the FRONTEND for further use
        auth.login(responseData.userId ,responseData.token);

      }catch(err){
        setIsLoading(false);
        console.log(err);
        setError(err.message || "Something went wrong!");
      } 
    }  
    else {
      // DIRECTLY USING FETCH 
      try {

        // we cannot send the binary data for image in JSON(body) so we use FormData
        const formData = new FormData();
        formData.append('name',formState.inputs.name.value);
        formData.append('email',formState.inputs.email.value);
        formData.append('password',formState.inputs.password.value);
        formData.append('image',formState.inputs.image.value);

        // Using FETCH for using API
        const response = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',                                  
          body: formData
        });

        const responseData = await response.json();

        // If response is having STATUS CODE 404 or 500. This condition will be true
        //if(!responseData.ok)
        if(responseData.message)
        {
          throw Error(responseData.message);
        }

        console.log(responseData);
        setIsLoading(false);                                   // removing loading when data is arrived
        
        // Giving USERID to the FRONTEND for further use
        auth.login(responseData.userId , responseData.token);

      } catch (err) {
        //Catching error
        setIsLoading(false);
        console.log(err);
        setError(err.message || "Something Went Wrong");
      }
    

      /* USING HOOCK
      try{
        await sendRequest('http://localhost:5000/api/users/signup',
        'POST',
        {
          'Content-Type':'application/json'
        },
        JSON.stringify({
          name:formState.inputs.name.value,
          email:formState.inputs.email.value,
          password:formState.inputs.password.value,
        })
        );

        auth.login();
      }catch(err){

      }
      */ 
    }
  };

  const clearError = () => {
    setError(null);
  }

  return (
    <React.Fragment>
      <ErrorModel error={error} onClear={clearError} />
      <Card className="authentication">

        {/* Showing the loading screen */}
        {isLoading && <LoadingSpinner asOverlay />}

        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler}/>}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password, at least 5 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
