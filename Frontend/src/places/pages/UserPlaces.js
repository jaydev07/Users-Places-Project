import React,{useEffect , useState} from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UserPlaces = () => {

  // We have to mentain a state so that after reteriving the DATA from backend it will display
  const [places, setLoadedPlaces] = useState(null);
  
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState();

  const userId = useParams().userId;

  // USEEFFECT is used because This component will be rendered again-again but we have to TRIGGER this FUNCTION ONLY ONCE
  useEffect( () => {
    const fetchPlaces = async () => {
      try{
        setIsLoading(true);
        const response = await fetch( process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`);

        const responseData = await response.json();

        if(response.message){
          throw new Error(response.message);
        }

        setLoadedPlaces(responseData.place);
        // console.log(responseData.place);

        setIsLoading(false);
      }catch(err){
        setIsLoading(false);
        console.log(err);
        setError(err.message || 'Something wrong!');
      }
      
    }

    fetchPlaces();
  },[userId]);
  
  const clearError = () => {
    setError(null);
  }

  const handleDeletePlace = (deletedPlaceId) => {

    // So after getting the DELETE-PLACE-ID we will FILTER IT & RERENDER
    setLoadedPlaces((prevPlaces) => {
      prevPlaces.filter((place) => {
        return place.id !== deletedPlaceId;
      })
    });
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      { !isLoading && places && <PlaceList items={places} onDeletePlace={handleDeletePlace} />}
    </React.Fragment>
  );
};

export default UserPlaces;

