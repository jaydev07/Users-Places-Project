import React,{useCallback,useReducer} from 'react';

import './NewPlace.css';
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../../shared/components/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {useForm} from '../../shared/hooks/form-hook';


const NewPlace = () => {

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


  const submitHandeler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  }

  return(
    <form className="place-form" onSubmit={submitHandeler}>
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
  )
};

export default NewPlace;