import React,{useEffect} from 'react';
import {useParams} from 'react-router-dom';

import './NewPlace.css';
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../../shared/components/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';

const DUMMY_PLACES = [
    {
      id: 'p1',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
      address: '20 W 34th St, New York, NY 10001',
      location: {
        lat: 40.7484405,
        lng: -73.9878584
      },
      creator: 'u1'
    },
    {
      id: 'p2',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
      address: '20 W 34th St, New York, NY 10001',
      location: {
        lat: 40.7484405,
        lng: -73.9878584
      },
      creator: 'u2'
    }
  ];


  
const UpdatePlaces = () => {

    const placeId = useParams().placeId;

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

    const identifiedPlace = DUMMY_PLACES.find((place) => {
       return place.id === placeId 
    });

    useEffect(() => {
        if(identifiedPlace){
            setFormData({
                title:{
                    value:identifiedPlace.title,
                    isValid:true
                },
                description:{
                    value:identifiedPlace.description,
                    isValid:true
                }
                },true);
        }
    },[setFormData,identifiedPlace]);
   

    if(!identifiedPlace){
        return(
            <div className="center">
                <Card>
                <h2>Could not find the Place</h2>
                </Card>
            </div>
        );
    }

    const submitHandeler = (event) => {
        event.preventDefault();
        console.log(formState.inputs);
    }

    if(!formState.inputs.title.value){
        return(
            <div className="center">
                <h2>Loading !!!</h2>
            </div>
        );
    }
    
    return(
        <form className="place-form" onSubmit={submitHandeler}>
            <Input 
                id="title" 
                element="input" 
                type="text" 
                label="Title" 
                validators={[VALIDATOR_REQUIRE()]}
                errorText = "Please Enter Valid Title"
                onInput = {handleForm}
                value={formState.inputs.title.value}
                valid={formState.inputs.title.isValid}
            />
            <Input 
                id="description" 
                element="textarea"  
                label="Description" 
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText = "Please Enter Valid description of min length 5"
                onInput = {handleForm}
                value={formState.inputs.description.value}
                valid={formState.inputs.description.isValid}
            />

            <Button type="submit" disabled={!formState.isValid}>
                UPDATE PLACE
            </Button>
                 
        </form>
    );
}

export default UpdatePlaces;