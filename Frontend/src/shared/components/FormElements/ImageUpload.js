import React,{useRef , useState, useEffect} from 'react';

import "./ImageUpload.css";
import Button from './Button';

const ImageUpload = props => {

    const [file , setFile] = useState();
    const [previewUrl , setPreviewUrl] =useState();
    const [isValid , setIsValid] = useState(false);
    
    // useRef is used to create the refrence for input tag to show it on screen when the button is clicked
    const filePickerRef = useRef();

    // If a file State changes
    useEffect(() => {
        // If the file state changes to undefined
        if(!file){
            return;
        }

        const fileReader = new FileReader();
        // s2 -> this function will be triggered when the file is loaded in s1
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        }
        // s1 -> Reads the file as data url 
        fileReader.readAsDataURL(file);
    },[file]);

    const pickHandler = (event) => {
        let pickedFile;
        let fileIsValid = isValid;
        // If the file was found
        if(event.target.files && event.target.files.length === 1){
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        }else{
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id , pickedFile , fileIsValid);
    }

    const pickImageHandler = () => {
        filePickerRef.current.click();
    }

    return(
        <div className="form-control">
            <input 
                id={props.id}
                ref={filePickerRef} 
                style={{display:"none"}}
                // The input type is file because we want to upload the image file
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    { previewUrl && <img src={previewUrl} alt="Preview"/> }
                    { !previewUrl && <p>Please pick an image</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            { !isValid && <p>{props.errorText}</p> }
        </div>
    )
}

export default ImageUpload;