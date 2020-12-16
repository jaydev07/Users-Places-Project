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

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // For Loading when we are RETERIVING THE DATA FROM DATABASE
  const [isLoading, setIsLoading] = useState(false);

  // When any ERROR OCCURS while RETERIVING THE DATA FROM DATABASE
  const [error,setError] = useState();

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
          name: undefined
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
          }
        },
        false
      );
    }

    // Switching the signup & Login
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    // LOADING THE SCREEN WHILE THE DATA IS RETERIVED
    setIsLoading(true);

    if (isLoginMode) {

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

        if(responseData.message !== "Login Successfull"){
          throw Error(responseData.message);
        }

        setIsLoading(false);                                   // removing loading when data is arrived
        auth.login();
      }catch(err){
        setIsLoading(false);
        console.log(err);
        setError(err.message || "Something went wrong!");
      }
    } 
    else {
      try {
        // Using FETCH for using API
        const response = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',                
          headers: {                                          // Used to know that the API is asking for JSON DATA
            'Content-Type': 'application/json'
          },                  
          body: JSON.stringify({                              // Converting JSON data into String & sending to the backend
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
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
        auth.login();
      } catch (err) {
        //Catching error
        setIsLoading(false);
        console.log(err);
        setError(err.message || "Something Went Wrong");
      }
    }

  };

  const errorHandler = () => {
    setError(null);
  } 

  return (
    <React.Fragment>
      <ErrorModel error={error} onClear={errorHandler} />
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
