import React from 'react';
import { Card, Form } from 'react-bootstrap';

const DraftImage = ({ data, handleTitle, handleCaption, togglePublic }) => {
    return (
        <Card>
            <Card.Img variant="top" src={data.src} />
            <Card.Body>
                <Card.Title>
                    <Form.Control 
                        type="text" 
                        name={data.id.toString()} 
                        placeholder="Image Title" 
                        value={data.title} 
                        onChange={handleTitle} 
                    />
                </Card.Title>
                <Card.Text>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name={data.id.toString()} 
                        placeholder="Image Caption" 
                        value={data.caption} 
                        onChange={handleCaption} 
                    />
                </Card.Text>
                <Form.Check 
                    type="switch"
                    id={"switch-"+data.id.toString()}
                    label=" public?"
                    onChange={togglePublic}
                    checked={data['is_public?']}
                />
            </Card.Body>
        </Card>
    )
};

export default DraftImage;