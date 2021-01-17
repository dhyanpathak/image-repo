import React, { Component } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { CardDeck, Card, Form, Container, Button, Alert } from 'react-bootstrap';

import '../../assets/stylesheets/upload.css';

class Upload extends Component {
    constructor(props) {
        super(props);
        this.onDrop = (files) => {
            let additions = files.length;

            this.setState({
                files,
                publics: [...Array(additions).fill(false)],
                titles: [...Array(additions).fill('')],
                captions: [...Array(additions).fill('')],
                showAlert: false,
                goodAlert: false,
                alertMessage: ''
            });
            
        };
        this.state = {
            files: [],
            titles: [],
            captions: [],
            publics: [],
            showAlert: false,
            goodAlert: false,
            alertMessage: '',
            isLoading: false
        }
    }

    setAlert = (alert) => {
        const { showAlert, goodAlert, alertMessage } = alert;

        this.setState({ showAlert, goodAlert, alertMessage });
    }
    
    setLoading = (loadBool) => {
        this.setState({ isLoading: loadBool });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setLoading(true);

        const { files, publics, titles, captions } = this.state;
        let formData = new FormData();
        for(let i = 0; i < files.length; i++) {
            formData.append('images[]', files[i]);
            formData.append('titles[]', titles[i]);
            formData.append('captions[]', captions[i]);
            formData.append('publics[]', publics[i]);
        }
        
        const headers = {
            'Content-Type': 'multipart/form-data' 
        }
        
        axios.post('/api/images', formData, { headers, withCredentials: true })
            .then(resp => {
                this.setState({
                    files: [],
                    titles: [],
                    captions: [],
                    publics: []
                });
                this.setAlert({showAlert: true, goodAlert: true, alertMessage: resp.data.message});
                this.setLoading(false);
                this.props.update(resp.data.images, 'ADD');
            })
            .catch(err => {
                console.log(err);
                this.setAlert({showAlert: true, goodAlert: false, alertMessage: "Unsuccessful upload"});
                this.setLoading(false);
            });
    };

    handleTitleChange = (event) => {
        const { name, value } = event.target;
        let i = parseInt(name);

        this.setState(state => {
            const titles = state.titles.map((title, j) => {
                if(j === i) {
                    return value;
                } else {
                    return title;
                }
            });
            return { titles, };
        });
    };

    handleCaptionChange = (event) => {
        const { name, value } = event.target;
        let i = parseInt(name);

        this.setState(state => {
            const captions = state.captions.map((caption, j) => {
                if(j === i) {
                    return value;
                } else {
                    return caption;
                }
            });
            return { captions, };
        });
    };

    togglePublic = (i) => {
        this.setState(state => {
            const publics = state.publics.map((p, j) => {
                if(j === i) {
                    return !p;
                } else {
                    return p;
                }
            });
            return { publics, };
        });
    }

    render() {
        const baseStyle = {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            borderWidth: 2,
            borderRadius: 2,
            borderColor: '#eeeeee',
            borderStyle: 'dashed',
            backgroundColor: '#fafafa',
            color: '#bdbdbd',
            outline: 'none',
            transition: 'border .24s ease-in-out'
        };

        const clearAlert = {
            alertMessage: '',
            goodAlert: false,
            showAlert: false
        };

        let cards = this.state.files.map((file, i) => (
            <Card key={i}>
                <Card.Img variant="top" src={URL.createObjectURL(file)} />
                <Card.Body>
                    <Card.Title>
                        <Form.Control 
                            type="text" 
                            name={i} 
                            placeholder="Image Title" 
                            value={this.state.titles[i]} 
                            onChange={this.handleTitleChange} 
                        />
                    </Card.Title>
                    <Card.Text>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            name={i} 
                            placeholder="Image Caption" 
                            value={this.state.captions[i]} 
                            onChange={this.handleCaptionChange} 
                        />
                    </Card.Text>
                    <Form.Check 
                        type="switch"
                        id={"switch-"+i}
                        label=" public?"
                        onChange={() => this.togglePublic(i)}
                        checked={this.state.publics[i]}
                    />
                </Card.Body>
            </Card>
        ));

        return (
            <div id="upload" style={{ display: this.props.isActive ? "block" : "none" }}>
                <Alert 
                    variant={ this.state.goodAlert ? "success" : "danger"} 
                    onClose={() => this.setAlert(clearAlert)} 
                    dismissible
                    style={{ display: this.state.showAlert ? "block" : "none" }}
                >
                    <Alert.Heading>{this.state.alertMessage}</Alert.Heading>
                </Alert>
                <Dropzone onDrop={this.onDrop} accept='image/jpeg, image/png' maxFiles={6}>
                    {({getRootProps, getInputProps}) => (
                        <div>
                            <Container className="container" style={baseStyle}>
                                <div {...getRootProps({className: 'dropzone'})}>
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some images here, or click to select images</p>
                                </div>
                            </Container>
                        </div>
                    )}
                </Dropzone>
                <div style={{textAlign: "center"}}>
                    { this.state.files.length > 0 ?  
                        <Button variant="primary" size="lg" id="submit" disabled={this.state.isLoading} onClick={!this.state.isLoading ? this.handleSubmit : null}>
                            {this.state.isLoading ? 'Loading...' : 'Upload'}
                        </Button>
                        :
                        <p>You can add titles, captions and let others see your images or not.<br />Add up to 6 images!</p> 
                    }
                </div>
                <CardDeck>
                    {cards}
                </CardDeck>
            </div>
        )
    }
}

export default Upload;