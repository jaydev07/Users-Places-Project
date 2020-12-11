import React from 'react';
import {useParams} from 'react-router-dom';

import PlacesList from '../components/PlacesList';

const DUMMY_PLACES = [
    {
       id:'p1',
       title:"Empire State Building",
       description:"One of the most famous sky scrapers",
       imageURL:"https://www.great-towers.com/sites/default/files/2019-07/tower_0.jpg",
       address:"20 W 34th St, New York, NY 10001, United States",
       location:{
           lat:40.7484405,
           lng:-73.9878531
       },
       creator:'u1'
    },
    {
        id:'p2',
        title:"Empire State Building",
        description:"One of the most famous sky scrapers",
        imageURL:"https://www.great-towers.com/sites/default/files/2019-07/tower_0.jpg",
        address:"20 W 34th St, New York, NY 10001, United States",
        location:{
            lat:40.7484405,
            lng:-73.9878531
        },
        creator:'u2'
     }
]

const UserPlaces = () => {
    const userId = useParams().userID;
    const loadedPlaces = DUMMY_PLACES.filter((place) => {
        return place.creator == userId;
    });

    return <PlacesList items={loadedPlaces} />
}

export default UserPlaces;