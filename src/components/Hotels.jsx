import React, { Component } from 'react';
import {formatDate} from '../utils/FormatDate';

class Hotels extends Component {
    constructor(props){
        super(props);
        this.getLocations = this.getLocations.bind(this);
        this.filterHotels = this.filterHotels.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.getRoomPhotos = this.getRoomPhotos.bind(this);
    }

    state = {
        startDate: "",
        endDate: "",
        city: "",

        hotels: [],
        hotelDetails: [],
        hotelPhotos: [],

        landmarks: [],
    };

    componentDidUpdate() {
        if(this.state.startDate !== this.props.startDate && this.props.startDate !== "")
        {
            this.setState({
                startDate: this.props.startDate,
            });
        }

        if(this.state.endDate !== this.props.endDate && this.props.endDate !== "")
        {
            this.setState({
                endDate: this.props.endDate,
            });
        }

        if(this.state.city !== this.props.city && this.props.city !== "")
        {
            this.setState({
                city: this.props.city,
            },

            this.getLocations,
            );
        }
    }

    async getLocations() {
        if(this.state.city !== "" && this.state.startDate !== "" && this.state.endDate !== "")
        {
            await fetch("https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=" + this.state.city, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "hotels4.p.rapidapi.com",
                        "x-rapidapi-key": process.env.REACT_APP_AIRPORTS_KEY
                    }
                    })
            .then(res => res.json())
            .then((result) => {
                   let hotels = result.suggestions.find(hotels => hotels.group === "HOTEL_GROUP");
                   let landmarks = result.suggestions.find(marks => marks.group === "LANDMARK_GROUP");

                   this.filterHotels(hotels);
                })
            .catch((err) => {
                this.setState({
                    error: err,
                    hotels: [],
                    landmarks: [],
                });
            });
        }
    };

    filterHotels(locations) {
        let filteredLocations = [];

        for(let location of locations.entities)
        {
            filteredLocations.push({
                destinationId: location.destinationId,
                name: location.name,
            });
        }

        
        console.log(filteredLocations);

        this.setState({
            hotels: filteredLocations,
        });

        this.getRoomDetails();
    }

    async getRoomDetails(){
       let hotels = [];

       for(let hotel of this.state.hotels)
       {
            await fetch("https://hotels4.p.rapidapi.com/properties/get-details?locale=en_US&currency=USD&checkOut=" + formatDate(this.state.endDate) + 
            "&adults1=1&checkIn=" + formatDate(this.state.startDate) + "&id=" + hotel.destinationId, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "hotels4.p.rapidapi.com",
                        "x-rapidapi-key": process.env.REACT_APP_AIRPORTS_KEY
                    }
                    })
            .then(res => res.json())
            .then((result) => {
                let hotelDetails = {
                        whatIsAround: result.data.body.overview.overviewSections[1].content,
                        address: result.data.body.propertyDescription.address.fullAddress,
                        starRating: result.data.body.propertyDescription.starRating,
                        price: result.data.body.propertyDescription.featuredPrice.currentPrice.formatted,
                };
                
                hotels.push(hotelDetails);
                })
            .catch((err) => {
                this.setState({
                    error: err,
                });
            });
       }

       this.setState({
            hotelDetails: hotels,
       });

       this.getRoomPhotos();
   }
    
    async getRoomPhotos() {
        let filteredImages = [];

        for(let room of this.state.hotels)
        {
            await fetch("https://hotels4.p.rapidapi.com/properties/get-hotel-photos?id=" + room.destinationId, {
                        "method": "GET",
                        "headers": {
                            "x-rapidapi-host": "hotels4.p.rapidapi.com",
                            "x-rapidapi-key": process.env.REACT_APP_AIRPORTS_KEY
                        }
                        })
            .then(res => res.json())
            .then((result) => {
                    let images = {
                        destinationId: room.destinationId,
                        imageDetails: [],
                    };

                    for(let photo of result.roomImages[0].images)
                    {
                        let baseURL = photo.baseUrl;
                        let correctURL = baseURL.replace("{size}", photo.sizes[0].suffix);

                        images.imageDetails.push({
                            url: correctURL,
                            imageId: photo.imageId,
                            mediaGUID: photo.mediaGUID,
                        });
                    }

                    filteredImages.push(images);
                })
            .catch((err) => {
                this.setState({
                    error: err,
                });
            });
            }

            this.setState({
                hotelPhotos: filteredImages,
            });

            console.log(this.state.hotels);
            console.log(this.state.hotelDetails);
            console.log(this.state.hotelPhotos);
    }

    render(){
        return(
            <h2>Hotels</h2>
        );
    };
};

export default Hotels;