import React,{ useContext} from 'react';
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
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

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
    },
    image:{
      value:null,
      isValid:false
    }
  },false);

  // For fingibg the history
  const history = useHistory();


  const submitHandeler = async (event) => {
    event.preventDefault();

    try{

      console.log(auth.userId);
      const formData = new FormData();
      formData.append('title' , formState.inputs.title.value);
      formData.append('description' , formState.inputs.description.value);
      formData.append('address' , formState.inputs.address.value);
      formData.append('image' , formState.inputs.image.value);
      
      await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places/',
        'POST',
        {
          Authorization:'Bearer ' + auth.token
        },
        formData
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

        <ImageUpload center id="image" onInput={inputHandler} />

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