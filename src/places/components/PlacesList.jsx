import React from 'react';

import './PlacesList.css';
import PlaceItem from './PlaceItem';
import Card from '../../shared/components/UIElements/Card';

const PlacesList = (props) => {
    if(props.items.length === 0){
        return(
            <div className="place-list center">
                <Card>
                    <h2>No Places Found.Maybe create one?</h2>
                    <button>Share Places</button>
                </Card>
            </div>
        )
    }

    return(
        <ul className="place-list">
            {props.items.map((place) => {
                return <PlaceItem  
                            key={place.id} 
                            id={place.id} 
                            image={place.imageURL} 
                            title={place.title} 
                            description={place.description}
                            address = {place.address}
                            creatorId={place.creator}
                            coordinates={place.location} 
                        />
            })}
        </ul>
    )

}

export default PlacesList;