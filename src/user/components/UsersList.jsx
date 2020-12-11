import React from 'react';

import UserItem from './UserItem';
import './UsersList.css';
import Card from "../../shared/components/UIElements/Card";

const  UsersList = (props) => {
    if(props.items.length === 0){
        return(
            <div className="center">
                <Card>
                <h1>No User Added</h1>
                </Card>
            </div>
        );
    }
    else{
        return(
            <ul classname="user-list">
                {
                    props.items.map((user) => {
                        return <UserItem key={user.id} id={user.id} image={user.image} name={user.name} placeCount={user.places} />
                    })
                }
            </ul>
        )
    }
}

export default UsersList;