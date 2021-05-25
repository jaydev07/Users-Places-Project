import {useCallback,useReducer} from 'react';

const formReducer = (state,action) => {
    switch(action.type){

      case  'INPUT_CHANGE':
        let formIsValid = true;
        for( const inputId in state.inputs){
          if(!state.inputs[inputId]){
            continue;
          }
          if(inputId === action.inputId){
            formIsValid = formIsValid && action.isValid
          }
          else{
            formIsValid = formIsValid && state.inputs[inputId].isValid
          }
        }
  
        return{
          ...state,
          inputs:{
            ...state.inputs,
            [action.inputId] : {
              value:action.value,
              isValid:action.isValid
            }
          },
          isValid:formIsValid
        }

    case 'SET-DATA':
        return{
            inputs:action.inputs,
            isValid:action.formValidity
        };
      
      default:
        return state;
    }
}

export const useForm = (initialFormInput , initialFormValidity) => {

    const [formState , dispatch] = useReducer(formReducer,{
        inputs:initialFormInput,
        isValid:initialFormValidity
    });

    const inputHandler = useCallback((id,value,isValid) => {
        dispatch({
          type:"INPUT_CHANGE",
          inputId:id,
          value:value,
          isValid:isValid
        });
    },[]);

    const setFormData = useCallback((inputData,formValidity) => {
        dispatch({
            type:'SET-DATA',
            inputs:inputData,
            formIsValid:formValidity
        })
    },[]);

    return [formState,inputHandler,setFormData];
}