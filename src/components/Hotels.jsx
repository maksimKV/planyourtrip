import React, { Component } from 'react';
import {formatDate} from '../utils/FormatDate';

class Hotels extends Component {
    constructor(props){
        super(props);
        this.getLocations = this.getLocations.bind(this);
        this.filterHotels = this.filterHotels.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.getRoomPhotos = this.getRoomPhotos.bind(this);

        this.mockHotels = this.mockHotels.bind(this);
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
            },
            
                //this.getLocations,
            );
        }

        if(this.state.endDate !== this.props.endDate && this.props.endDate !== "")
        {
            this.setState({
                endDate: this.props.endDate,
            },
                
                //this.getLocations,
            );
        }

        if(this.state.city !== this.props.city && this.props.city !== "")
        {
            this.setState({
                city: this.props.city,
            },

                //this.getLocations,
            );
        }

        if(this.state.hotels.length <= 0){
            this.mockHotels();
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
                        destinationId: hotel.destinationId,
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
    }

    // Due to API restriction I need to mock the hotels data in order to continue the development process.
    mockHotels() {
        this.setState({
            hotels: [
                {
                    destinationId: "561413",
                    name: "LondonHouse Chicago, Curio Collection by Hilton",
                },
                {
                    destinationId: "235666",
	                name: "London Heathrow Marriott Hotel",
                },
                {
                    destinationId: "234896",
		            name: "London Marriott Hotel County Hall",
                },
            ],

            hotelDetails: [
                {
                    address: "85 East Wacker Drive, Chicago, IL, 60601, United States of America",
                    destinationId: "561413",
                    price: "$107",
                    starRating: 4.5,
                    whatIsAround: [
                        "In The Loop",
                        "Chicago Riverwalk - 1 min walk",
                        "Grant Park - 7 min walk",
                        "Chicago Theatre - 7 min walk",
                        "House of Blues Chicago - 9 min walk",
                        "Millennium Park - 10 min walk",
                        "Art Institute of Chicago - 13 min walk",
                        "Water Tower Place - 15 min walk",
                        "John Hancock Center - 16 min walk",
                        "Willis Tower - 21 min walk",
                        "Navy Pier - 22 min walk",
                    ],
                },
                {
                    address: "Bath Road, Heathrow Airport, Hayes, England, UB3 5AN, United Kingdom",
                    destinationId: "235666",
                    price: "$124",
                    starRating: 4,
                    whatIsAround: [
                        "In Hillingdon",
                        "Twickenham Stadium - 5.3 mi / 8.5 km",
                        "Kempton Racecourse - 6.6 mi / 10.6 km",
                        "Hampton Court Palace - 8.3 mi / 13.4 km",
                        "Windsor Castle - 8.4 mi / 13.5 km",
                        "Thorpe Park - 9.8 mi / 15.8 km",
                        "Hampton Court - 12 mi / 19.2 km",
                        "Legoland - 13.3 mi / 21.4 km",
                        "Chessington World of Adventures - 24.4 mi / 39.3 km",
                    ],
                },
                {
                    address: "London County Hall, Westminster Bridge Road, London, England, SE1 7PB, United Kingdom",
                    destinationId: "234896",
                    price: "$307",
                    starRating: 5,
                    whatIsAround: [
                        "In London City Centre",
                        "London Eye - 4 min walk",
                        "Big Ben - 5 min walk",
                        "Buckingham Palace - 20 min walk",
                        "St. Paul's Cathedral - 28 min walk",
                        "Hyde Park - 30 min walk",
                        "The British Museum - 30 min walk",
                        "Tower of London - 2.4 mi / 3.8 km",
                        "London Stadium - 7.1 mi / 11.4 km",
                        "O2 Arena - 8 mi / 12.8 km",
                        "Wembley Stadium - 12.5 mi / 20.2 km",
                    ],
                },
            ],

            hotelPhotos: [
                {
                    destinationId: "561413",
		            imageDetails: [
                        {
                            imageId: 431500626,
                            mediaGUID: "7ce1e40d-f42b-4eb8-9fb9-db323b94fac4",
                            url: "https://exp.cdn-hotels.com/hotels/13000000/12790000/12786700/12786616/7ce1e40d_z.jpg",
                        },
                        {
                            imageId: 391789343,
                            mediaGUID: "8ab5cac0-e9ea-45e1-8477-0289a551e00f",
                            url: "https://exp.cdn-hotels.com/hotels/13000000/12790000/12786700/12786616/8ab5cac0_z.jpg",
                        },
                        {
                            imageId: 105602083,
                            mediaGUID: "e78f46c2-ca35-4398-a2ca-821c58eba188",
                            url: "https://exp.cdn-hotels.com/hotels/13000000/12790000/12786700/12786616/e78f46c2_z.jpg",
                        },
                        {
                            imageId: 105602109,
                            mediaGUID: "4fdc0540-3caa-4338-9de9-2c44a9706834",
                            url: "https://exp.cdn-hotels.com/hotels/13000000/12790000/12786700/12786616/4fdc0540_z.jpg",
                        },
                        {
                            imageId: 105602225,
                            mediaGUID: "6c647f92-dd23-4bc5-bdc7-2182cbdd40e7",
                            url: "https://exp.cdn-hotels.com/hotels/13000000/12790000/12786700/12786616/6c647f92_z.jpg",
                        },
                        {
                            imageId: 391791720,
                            mediaGUID: "c0962bc3-1b4f-4fd9-81a2-d7e53ac1d0b0",
                            url: "https://exp.cdn-hotels.com/hotels/13000000/12790000/12786700/12786616/c0962bc3_z.jpg",
                        },
                        {
                            imageId: 391791490,
                            mediaGUID: "0b2651d2-73dd-4db3-8b36-04595500ed21",
                            url: "https://exp.cdn-hotels.com/hotels/13000000/12790000/12786700/12786616/0b2651d2_z.jpg",
                        },
                    ],
                },
                {
                    destinationId: "235666",
			        imageDetails: [
                        {
                            imageId: 95096904,
                            mediaGUID: "2829b516-adc8-417d-843f-669cc35905d7",
                            url: "https://exp.cdn-hotels.com/hotels/1000000/440000/438600/438504/2829b516_z.jpg",
                        },
                        {
                            imageId: 62208258,
                            mediaGUID: "1e4e5443-a89a-417f-8916-b76e3244a72e",
                            url: "https://exp.cdn-hotels.com/hotels/1000000/440000/438600/438504/1e4e5443_z.jpg",
                        },
                    ],
                },
                {
                    destinationId: "234896",
			        imageDetails: [
                        {
                            imageId: 100519485,
                            mediaGUID: "159e137a-905a-41c7-8826-84879599642f",
                            url: "https://exp.cdn-hotels.com/hotels/1000000/20000/19100/19058/159e137a_z.jpg",
                        },
                        {
                            imageId: 257744115,
                            mediaGUID: "6b48aa8c-eb5c-4c73-b07f-be9dd9fe3513",
                            url: "https://exp.cdn-hotels.com/hotels/1000000/20000/19100/19058/6b48aa8c_z.jpg",
                        },
                        {
                            imageId: 66462293,
                            mediaGUID: "bd205f95-6798-45ce-bcdf-2bf4b3ed8c7f",
                            url: "https://exp.cdn-hotels.com/hotels/1000000/20000/19100/19058/bd205f95_z.jpg",
                        },
                        {
                            imageId: 100519288,
                            mediaGUID: "0f60b2e1-9096-4cf6-984b-f6146ccab1c9",
                            url: "https://exp.cdn-hotels.com/hotels/1000000/20000/19100/19058/0f60b2e1_z.jpg",
                        },
                        {
                            imageId: 100519436,
                            mediaGUID: "a933ae79-65f0-4f0b-ba5b-17e2ba6797c6",
                            url: "https://exp.cdn-hotels.com/hotels/1000000/20000/19100/19058/a933ae79_z.jpg",
                        },
                    ],
                },
            ],
        });
    }

    render(){
        return(
            <div className="hotelsWrapper">
            <h2>Hotels & Landmarks</h2>
                {this.state.hotelDetails.length <= 0 ? "" : 
                    <ul className="hotelsList">
                        {this.state.hotels.map(hotel => {
                            return (
                                <li key={hotel.destinationId}>
                                    <p className="hotelName">{hotel.name}</p>
                                    <img className="hotelThumbnail" alt={hotel.name} src={this.state.hotelPhotos.find(photo => photo.destinationId === hotel.destinationId).imageDetails[0].url} />
                                    <p className="hotelRating">Rating: {this.state.hotelDetails.find(details => details.destinationId === hotel.destinationId).starRating}</p>
                                    <p className="hotelPrice">Price: {this.state.hotelDetails.find(details => details.destinationId === hotel.destinationId).price}</p>
                                    <p className="hotelAddress">Address: {this.state.hotelDetails.find(details => details.destinationId === hotel.destinationId).address}</p>
                                </li>
                            )
                        })}
                    </ul>
                }
            </div>
        );
    };
};

export default Hotels;