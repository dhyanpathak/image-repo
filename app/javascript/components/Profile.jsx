import React, { Component } from 'react';
import axios from 'axios';
import Image from './Image';
import DraftImage from './DraftImage';
import { CardDeck, Button, Modal, Alert } from 'react-bootstrap';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            userImages: [],
            imageEdit: {
                id: 0,
                title: '',
                caption: '',
                src: '',
                ['is_public?']: false
            },
            showEditModal: false,
            showAlert: false,
            goodAlert: false,
            alertMessage: ''
        });
    }

    componentDidUpdate(prevProps) {
        if(prevProps.user.images != this.props.user.images) {
            this.setState({ userImages: this.props.user.images })
        }
        if(prevProps.updatedImages != this.props.updatedImages && this.props.updateType == 'ADD') { //only going to add images
            this.setState({ userImages: [...this.props.updatedImages, ...this.state.userImages] })
        }
    }

    setAlert = (alert) => {
        const { showAlert, goodAlert, alertMessage } = alert;
        this.setState({ showAlert, goodAlert, alertMessage });
    }

    closeEditModal = () => {
        this.setState({ showEditModal: false });
    }

    setImageEdit = (id) => {
        const { userImages } = this.state;
        
        for(let i = 0; i < userImages.length; i++) {
            if(userImages[i].id == id) {
                this.setState({
                    imageEdit: {
                        id,
                        title: userImages[i].title,
                        caption: userImages[i].caption,
                        src: userImages[i].url,
                        ['is_public?']: userImages[i]['is_public?']
                    },
                    showEditModal: true
                });
                return;
            }
        }
    }

    deleteImage = (id) => {
        axios.delete(`/api/images/${id}`, { id }, { withCredentials: true })
        .then(resp => {
            let deletedImage = resp.data.image;
            this.setState(state => {
                const userImages = state.userImages.filter(image => image.id !== deletedImage.id)
                return { userImages, };
            });

            this.props.update([deletedImage], 'DELETE')
        })
        .catch(err => {
            this.setAlert({showAlert: true, goodAlert: false, alertMessage: "Failed to delete."});
            console.log("API ERROR", err)
        });
    }

    handleTitle = (event) => {
        const { value } = event.target;
        let { imageEdit } = this.state;
        imageEdit.title = value;

        this.setState({ imageEdit });
    }

    handleCaption = (event) => {
        const { value } = event.target;
        let { imageEdit } = this.state;
        imageEdit.caption = value;

        this.setState({ imageEdit });
    }

    togglePublic = () => {
        let { imageEdit } = this.state;
        imageEdit['is_public?'] = !imageEdit['is_public?'];

        this.setState({ imageEdit });
    }

    updateImage = () => {
        const { imageEdit } = this.state;
        let src = imageEdit.src;
        delete imageEdit.src;
        
        axios.patch(`/api/images/${imageEdit.id}`, imageEdit, { withCredentials: true })
            .then(resp => {
                let updatedImage = resp.data.image;
                updatedImage.url = src;
                this.setState(state => {
                    const userImages = state.userImages.map(image => {
                        if(image.id == updatedImage.id) {
                            return updatedImage;
                        } else {
                            return image;
                        }
                    });
                    return { userImages, };
                });
                this.closeEditModal();
                this.props.update([updatedImage], 'EDIT')
            })
            .catch(err => {
                this.setAlert({showAlert: true, goodAlert: false, alertMessage: "Update failed."});
                console.log("API ERROR", err)
            });
    }

    render() {
        return(
            <div id="profile" style={{ display: this.props.isActive ? "block" : "none" }}>
                 <Alert 
                    variant={ this.state.goodAlert ? "success" : "danger"} 
                    onClose={() => this.setAlert(clearAlert)} 
                    dismissible
                    style={{ display: this.state.showAlert ? "block" : "none" }}
                >
                    <Alert.Heading>{this.state.alertMessage}</Alert.Heading>
                </Alert>
                <Modal centered show={this.state.showEditModal} onHide={this.closeEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Image</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ textAlign: '-webkit-center' }}>
                        <DraftImage 
                            data={this.state.imageEdit} 
                            handleTitle={this.handleTitle}
                            handleCaption={this.handleCaption} 
                            togglePublic={this.togglePublic}
                        />                               
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.updateImage}>Update</Button>
                    </Modal.Footer>
                </Modal>
                <h4>Welcome {this.props.user.full_name}</h4>
                <CardDeck>
                    {
                        this.state.userImages == undefined ? ''
                            :
                            this.state.userImages.map((image) => {
                                return <Image 
                                    key={image.id} 
                                    {...image} 
                                    showOwner={false} 
                                    editable={true} 
                                    deletable={true} 
                                    editFunc={this.setImageEdit}
                                    deleteFunc={this.deleteImage} 
                                />
                            })
                    }
                </CardDeck>
            </div>
        )
    }
}

export default Profile;