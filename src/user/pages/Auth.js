import React,{useState,useContext} from 'react';


import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {VALIDATOR_EMAIL,VALIDATOR_MINLENGTH,VALIDATOR_REQUIRE} from '../../shared/components/util/validators';
import {useForm} from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';
import './Auth.css';
import {AuthContext} from '../../shared/context/auth-context';

// const formReducer = (state,action) => {
//     switch (action.type){
//         case 'INPUT-CHANGE':

//             let fromIsValid = true;
//             for (const inputId in state.inputs){
//                 if(inputId === action.inputId){
//                     fromIsValid = fromIsValid && action.isValid;
//                 }
//                 else{
//                     fromIsValid = fromIsValid && state.inputs[inputId].isValid;
//                 }
//             }

//             return{
//                 ...state,
//                 inputs:{
//                     ...state.inputs,
//                     [action.inputId]:{
//                         value:action.value,
//                         isValid:action.isValid
//                     }
//                 },
//                 isValid:fromIsValid
//             }

//         default :
//             return state;
//     }
// }

const Auth = () => {
    // const [formState,dispatch] = useReducer(formReducer,{
    //     inputs:{
    //         email:{
    //             value:"",
    //             isvalid:false
    //         },
    //         password:{
    //             value:"",
    //             isValid:false
    //         }
    //     },
    //     isValid:false
    // });

    // const handleInput = useCallback((id,value,isValid) => {
    //     dispatch({
    //         type:'INPUT-CHANGE',
    //         inputId:id,
    //         value:value,
    //         isValid:isValid
    //     });
    // },[]);


    const [formState , handleInput , setFormData] = useForm(
        {
                    email:{
                        value:"",
                        isvalid:false
                    },
                    password:{
                        value:"",
                        isValid:false
                    }
        },
        false
    );

    const [switchToSignup,setMode] = useState(false);

    const switchModeHandeler = () => {

        // Used to DISABLE The BUTTON when we switch & Perfectly Validates the from
        if(switchToSignup){
            // Sign-up -> LogIn
            setFormData({
                ...formState.inputs,
                // Because Name is Not there in Login Page
                name:undefined
            },
            // We have to onlly validate 2 of the fields 
            formState.inputs.email.isValid && formState.inputs.password.isValid)
        }
        else{
            setFormData({
                ...formState.inputs,
                name:{
                    value:'',
                    isValid:''
                }
            },
            // It is false because NAME component is ADDED & it is EMPTY
            false)
        }
         
        setMode((prevValue) => {
            return ! prevValue;
        })
    }

    // Using CONTEXT to change NavLinks and Page after Loggin
    const auth = useContext(AuthContext);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formState.inputs);
        //When user is Loggin we will change the CONTEXT state
        auth.login(); 

    }

    

    return(
        <Card className="authentication">

            <h2>{switchToSignup ? 'Sign-Up' : 'LogIn'}</h2>
            <hr />
            <form onSubmit={handleSubmit}>
                {switchToSignup && <Input
                                id="name" 
                                element="input"
                                type='text'
                                label="User Name"
                                validators={[VALIDATOR_REQUIRE()]}
                                onInput={handleInput}
                                errorText="Enter Your Name"
                            />
                }
                <Input
                    id="email" 
                    element="input"
                    type='text'
                    label="Email Id"
                    validators={[VALIDATOR_EMAIL()]}
                    onInput={handleInput}
                    errorText="Enter A Valid Email-Id"
                />
                            
                <Input
                    id="password" 
                    element="input"
                    type='password'
                    label={switchToSignup ? "Create Password" : "Password" }
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    onInput={handleInput}
                    errorText="Password Must Be oF 5 characters"
                />

                <Button type="submit" disabled={!formState.isValid} >
                    {switchToSignup ? 'Sign Up' : 'LogIn' }
                </Button>

                <Button inverse onClick={switchModeHandeler}>
                    {switchToSignup ? 'Switch to Sign-in' : 'Switch to Sign-up'}
                </Button>
        </form>

        
        </Card>
    )
}

export default Auth;