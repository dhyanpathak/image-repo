import React from 'react';

import Image from './Image';
import { Modal, CardDeck } from 'react-bootstrap';
import '../../assets/stylesheets/owner.css';

const Owner = ({ data, displayOwner, closeOwner }) => {
    const generateImages = (data) => {
        if (data == undefined) return;

        return data.map((image) => {
            return <Image showOwner={false} key={image.id} {...image} editable={false} deletable={false} />
        });
    }

    return (
        <Modal className="owner-modal" centered show={displayOwner} onHide={closeOwner} style={{ width: '-webkit-fill-available' }} >
            <Modal.Header closeButton>
                <Modal.Title>{data.user.full_name}'s public photos</Modal.Title>
                <hr />
            </Modal.Header>
            <Modal.Body>
                <CardDeck>
                    {generateImages(data.images)}
                </CardDeck>
            </Modal.Body>
        </Modal>
    )
}

export default Owner;