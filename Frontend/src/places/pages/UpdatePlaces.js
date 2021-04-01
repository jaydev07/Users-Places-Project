import React,{useEffect, useState, useContext} from 'react';
import {useParams , useHistory} from 'react-router-dom';

import './NewPlace.css';
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../../shared/components/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';
import {useHttpClient} from '../../shared/hooks/http-fetch-hoock';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {AuthContext} from "../../shared/context/auth-context";

  
const UpdatePlaces = () => {

    const auth = useContext(AuthContext);

    // used for getting the DATA FROM API
    const {isLoading , error ,sendRequest, clearError} = useHttpClient();
    
    // To set the PLACE having PLACEID
    const [loadedPlace, setLoadedPlace] = useState();

    // Getting the PLACEID from ROUTE
    const placeId = useParams().placeId;

    const history = useHistory();

    const [formState, handleForm ,setFormData] = useForm(
        {
            title:{
                value:'',
                isValid:false
            },
            description:{
                value:'',
                isValid:false
            }
        },
        true
    );

    // For SENDING THR REQUEST to BACKEND API
    // And USING USEEFFECT TO AVOID INFINITE LOOPS
    useEffect( () => {
      const fetchdata = async () => {
          try{
            // GET request for getting PLACE
            const response = await sendRequest(`http://localhost:5000/api/places/${placeId}`);

            // Updating the STATE with the RESPONSE GIVEN
            setLoadedPlace(response.place);
            console.log(response.place);
            // SETTING THE DEFAULT DATA IN THE TEXT BOXES
            setFormData({
                title:{
                    value:response.place.title,
                    isValid:true
                },
                description:{
                    value:response.place.description,
                    isValid:true
                }
                },true);

          }catch(err){}
      }   

      fetchdata();
    },[sendRequest,placeId, setFormData]);

   
    if(isLoading){
        return(
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    if( !isLoading && !loadedPlace){
        return(
            <div className="center">
                <Card>
                <h2>Could not find the Place</h2>
                </Card>
            </div>
        );
    }

    const submitHandeler = async (event) => {
        event.preventDefault();

        try{
            const response = await sendRequest(`http://localhost:5000/api/places/${placeId}`,
                'PATCH',
                {
                    'Content-Type':'application/json'
                },
                JSON.stringify({
                    title:formState.inputs.title.value,
                    description:formState.inputs.description.value
                })
            );

            // Redirecting to the HOME PAGE
            history.push(`/${auth.userId}/places`);
        }catch(err){}

        
    }

    
    
    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            { console.log("My loaded Place",loadedPlace) }
            <form className="place-form" onSubmit={submitHandeler}>
                { isLoading && <div className="center">
                    <LoadingSpinner />
                </div>}
                { !isLoading && loadedPlace && ( 
                    <React.Fragment>
                        <Input 
                            id="title" 
                            element="input" 
                            type="text" 
                            label="Title" 
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText = "Please Enter Valid Title"
                            onInput = {handleForm}
                            value={loadedPlace.title}                                  //{formState.inputs.title.value}
                            valid={true}                                  //{formState.inputs.title.isValid}
                        />
                        <Input 
                            id="description" 
                            element="textarea"  
                            label="Description" 
                            validators={[VALIDATOR_MINLENGTH(5)]}
                            errorText = "Please Enter Valid description of min length 5"
                            onInput = {handleForm}
                            value={loadedPlace.description}                                          //{formState.inputs.description.value}
                            valid={true}
                        />

                        <Button type="submit" disabled={!formState.isValid}>
                            UPDATE PLACE
                        </Button>
                    </React.Fragment>
                    )
                }       
            </form>
        </React.Fragment>
    );
}

export default UpdatePlaces;