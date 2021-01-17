import React, { Component } from 'react';
import axios from 'axios';
import { Waypoint } from 'react-waypoint';
import { Spinner, CardDeck } from 'react-bootstrap';

import Image from './Image';
import '../../assets/stylesheets/feed.css';

class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            page: 0
        }
    }

    componentDidMount() {
        axios.get(window.location.origin + '/api/images?page=' + this.state.page,
            { withCredentials: true })
            .then(resp => {
                this.setState({ data: resp.data.feed, page: this.state.page += 1 });
            })
            .catch(error => console.log('API ERROR:', error));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.updatedImages != this.props.updatedImages) {
            if(this.props.updateType == 'ADD') {
                let imagesToAdd = this.props.updatedImages.filter(image => image['is_public?']);

                this.setState({ data: [...imagesToAdd, ...this.state.data] });
            }
            if(this.props.updateType == 'EDIT') {
                let edittedImage = this.props.updatedImages[0];
                
                this.setState(state => {
                    const data = state.data.filter(image => image.id !== edittedImage.id)
                    return { data, };
                });

                this.setState(state => {
                    let data = [edittedImage, ...state.data].filter(image => image['is_public?']);
                    return { data, };
                });
            }
            if(this.props.updateType == 'DELETE') {
                let imageToDelete = this.props.updatedImages[0];
                
                this.setState(state => {
                    const data = state.data.filter(image => image.id !== imageToDelete.id)
                    return { data, };
                });
            }
        }
    }

    getMoreImages = () => {
        axios.get(window.location.origin + '/api/images?page=' + this.state.page,
        { withCredentials: true })
        .then(resp => {
            if (!resp) return;
            if (resp.data.feed.length < 1) return;
            this.setState({ data: resp.data.feed, page: this.state.page += 1 });
        })
        .catch(error => console.log('API ERROR:', error));
    }
    
    render() {
        return (
            <div id="feed" style={{ display: this.props.isActive ? "block" : "none" }}>
                <h4>Explore public images</h4>
                <CardDeck>
                    {
                        this.state.data ? this.state.data.map((image) => {
                                return <Image key={image.id} {...image} showOwner={true} editable={false} deletable={false} />
                            })
                            :
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                    }
                </CardDeck>
                <Waypoint onEnter={() => this.getMoreImages()} />
            </div>
        )
    }
}

export default Feed;