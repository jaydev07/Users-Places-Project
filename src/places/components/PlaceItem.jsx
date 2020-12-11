import React,{useState} from 'react';

import './PlaceItem.css';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Model from '../../shared/components/UIElements/Model';
import Map from '../../shared/components/UIElements/Map';

const PlaceItem = (props) => {

    const [showMap, setShowMap] = useState(false);

    const openMapHandeler = () => setShowMap(true);
    
    const closeMapHandler = () => setShowMap(false);

    return (
        <React.Fragment>
            <Model 
                show={showMap} 
                onCancle={closeMapHandler} 
                header={props.address} 
                contentClass="place-item__model-content"
                footerClass="place-item__model-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>} 
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16} />
                </div>
            </Model>
            <li className="place-item">
                <Card className="place-item__content">
                    <div className="place-item__image">
                        <img src={props.image} alt={props.title}/>
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandeler}>VIEW ON MAP</Button>
                        <Button to={`/places/${props.id}`}>EDIT</Button>
                        <Button danger>DELETE</Button>
                    </div>
                </Card>
            </li>
        </React.Fragment>
    )
}

export default PlaceItem;