import React, { useState,useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import './PlaceItem.css';
import Map from '../../shared/components/UIElements/Map';
import {AuthContext} from "../../shared/context/auth-context";

const PlaceItem = props => {

  // Used to check Whether the USER is LOGGEDIN OR NOT
  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModel,setShowConfirmModel ] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  // Shown the DELETE WARNING MODEL
  const showDeleteWarningHandeler = () => {
    setShowConfirmModel(true);
  }

  // CANCLEING the Delete Warning MODEL
  const cancleDeleteWarningHandeler = () => {
    setShowConfirmModel(false);
  }

  // CONFORMING the DELETE WARNING MODEL
  const confirmDeleteHandeler = () => {
    setShowConfirmModel(false);
    console.log("Deleting !");
  }

  return (
    <React.Fragment>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>

      <Modal 
        // Only appers when "showConfirmModel" state is true 
        show={showConfirmModel}

        // Calling onCancle function
        onCancel ={cancleDeleteWarningHandeler}
        header="Are You Sure?" 
        footerClase="place-item__model-actions" 
        footer={
        <React.Fragment>

          {/* Canceling the Delete Model */}
          <Button inverse onClick={cancleDeleteWarningHandeler}>CANCLE</Button>

          {/* Confirming the Delete Model*/}
          <Button danger onClick={confirmDeleteHandeler}>DELETE</Button>
        </React.Fragment>
        }

      >
        <p>Do you want to delete this place?</p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {
              auth.isLoggedIn && <Button to={`/places/${props.id}`}>EDIT</Button>
            }
            {
              auth.isLoggedIn && <Button danger onClick={showDeleteWarningHandeler}>DELETE</Button>
            }
          
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
