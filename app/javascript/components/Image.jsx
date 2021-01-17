import React, { useState } from 'react';
import axios from 'axios';
import Owner from './Owner';
import { Card, Button } from 'react-bootstrap';

import '../../assets/stylesheets/image.css';

const Image = ({ id, title, caption, url, user_id, showOwner, editable, editFunc, deletable, deleteFunc }) => {
    const [owner, setOwner] = useState(0);
    const [displayOwner, setDisplayOwner] = useState(false);

    const closeOwner = () => {
        setDisplayOwner(false);
    }
    const getOwner = () => {
        if (!owner) {
            axios.get('/api/users/' + user_id, { withCredentials: true })
                .then(resp => {
                    setOwner(resp.data);
                    setDisplayOwner(true);
                })
                .catch(error => console.log('API ERROR:', error));
        } else {
            setDisplayOwner(true);
        }
    }

    return (
        <div style={{ display: 'inline-block' }}>
            {displayOwner ? <Owner data={owner} displayOwner={displayOwner} closeOwner={closeOwner} /> : null}
            <Card key={id}>
                <Card.Img variant="top" src={url} />
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>{caption}</Card.Text>
                    { showOwner ? 
                        <Button variant="link" onClick={getOwner}>View profile</Button>
                        :
                        ''
                    }
                </Card.Body>
                {
                    (editable == true && deletable == true) ?
                        <Card.Body className="editable-card">
                            <Button variant="link" onClick={() => editFunc(id)}>Edit</Button>
                            <Button variant="link" onClick={() => deleteFunc(id)}>Delete</Button>
                        </Card.Body>
                        :
                        ''    
                }
            </Card>
        </div>
    )
};

export default Image;