import React, { Component } from 'react';
import {formatDate} from '../utils/FormatDate';

class Flights extends Component {
    constructor(props) {
        super(props);
        this.getFligths = this.getFligths.bind(this);
        this.handleStartAirport = this.handleStartAirport.bind(this);
        this.handleEndAirport = this.handleEndAirport.bind(this);
        this.filterFlights = this.filterFlights.bind(this);
    };

    state = {
        startDate: "",
        endDate: "",

        startAirports: [{
            PlaceId: "0",
            PlaceName: "Chose destination",
        }],
        endAirports: [{
            PlaceId: "0",
            PlaceName: "Chose destination",
        }],

        startAirport: {
            PlaceId: "0",
        },
        endAirport: {
            PlaceId: "0",
        },

        destinationFlights: [],
        returnFlights: [],
    };

    componentDidUpdate() {
        if(this.state.startAirports !== this.props.startAirports && this.props.startAirports.length > 0)
        {
            this.setState({
                startAirports: this.props.startAirports,
                startAirport: this.props.startAirports[0],
                },

                this.getFligths,
            );
        };

        if(this.state.endAirports !== this.props.endAirports && this.props.endAirports.length > 0) {
            this.setState({
                endAirports: this.props.endAirports,
                endAirport: this.props.endAirports[0],
            },

                this.getFligths,
            );
        };

        if(this.state.startDate !== formatDate(this.props.startDate) && this.props.startDate !== "") {
            this.setState({
                startDate: formatDate(this.props.startDate),
                },

                this.getFligths,
            );
        };

        if(this.state.endDate !== formatDate(this.props.endDate) && this.props.endDate !== "") {
            this.setState({
                endDate: formatDate(this.props.endDate),
                }, 

                this.getFligths,
            );
        }
    }

    getFligths() {
        if(this.state.startAirport.PlaceId !== "0" && this.state.endAirport.PlaceId !== "0"
            && this.state.startDate !== "" && this.state.endDate !== "")
        {
            fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/US/USD/en-US/" 
                + this.state.startAirport.PlaceId + "/" + this.state.endAirport.PlaceId + "/" + this.state.startDate + "/?inboundpartialdate=" + this.state.endDate, {
                        "method": "GET",
                        "headers": {
                            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                            "x-rapidapi-key": process.env.REACT_APP_AIRPORTS_KEY
                        }
            })
            .then(res => res.json())
            .then((result) => {
                    let filteredFlights = this.filterFlights(result);

                    this.setState({
                        destinationFlights: filteredFlights
                    });
                })
            .catch((err) => {
                this.setState({
                    error: err,
                    destinationFlights: [],
                });
            });

            fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/US/USD/en-US/" 
                + this.state.endAirport.PlaceId + "/" + this.state.startAirport.PlaceId + "/" + this.state.endDate + "/?inboundpartialdate=" + this.state.endDate, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                        "x-rapidapi-key": process.env.REACT_APP_AIRPORTS_KEY
                    }
                    })
            .then(res => res.json())
            .then((result) => {
                    let filteredFlights = this.filterFlights(result);

                    this.setState({
                        returnFlights: filteredFlights
                    });
                })
            .catch((err) => {
                this.setState({
                    error: err,
                    returnFlights: [],
                });
            });
        };
    }

    handleStartAirport(e) {
        let airport = this.state.startAirports.find(airport => airport.PlaceId === e.target.value);

        this.setState({
            startAirport: airport,
            },
            
            this.getFligths,
        );
    }

    handleEndAirport(e) {
        let airport = this.state.endAirports.find(airport => airport.PlaceId === e.target.value);

        this.setState({
            endAirport: airport,
            },

            this.getFligths,
        );
    }

    filterFlights(result) {
        let filteredFlights = [];

        for(let i = 0; result.Quotes.length > i; i++) {
            let depTime = result.Quotes[i].QuoteDateTime.split("T");

            filteredFlights.push({
                originName: result.Places.find(airport => airport.PlaceId === result.Quotes[i].OutboundLeg.OriginId).Name,
                destinationName: result.Places.find(airport => airport.PlaceId === result.Quotes[i].OutboundLeg.DestinationId).Name,
                carrier: result.Carriers.find(carrier => carrier.CarrierId === result.Quotes[0].OutboundLeg.CarrierIds[0]).Name,
                price :"$" + result.Quotes[i].MinPrice,
                direct: result.Quotes[i].Direct ? "Yes" : "No",
                departureTime: depTime[1],
            });
        };

        return filteredFlights;
    };

    render() {
        return (
            <div className="flightsContainer">
                <div className="airportsContainer">
                    <div className="halfAirportsContainer">
                        <h4>Select an airport to fly from: </h4>
                        <select onChange={this.handleStartAirport}>
                            {this.state.startAirports.map(airport => {
                                return (
                                    <option key={airport.PlaceId} value={airport.PlaceId}> {airport.PlaceName} </option>
                                    )
                                })}
                        </select>
                    </div>

                    <div className="halfAirportsContainer">
                        <h4>Select an airport to fly back from: </h4>
                        <select onChange={this.handleEndAirport}>
                            {this.state.endAirports.map(airport => {
                                return (
                                    <option key={airport.PlaceId} value={airport.PlaceId}> {airport.PlaceName} </option>
                                    )
                                })}
                        </select>
                    </div>
                </div>

                <div className="inboundOutboundWrapper">
                    <div className="outboundFlights">
                        { this.state.startAirport.PlaceName === "" && this.state.endAirport.PlaceName === "" ? <h4>You haven't selected destinations, airports and dates</h4> :
                            <h4>Flights from {this.state.startAirport.PlaceName} to {this.state.endAirport.PlaceName} on {this.state.startDate} </h4>
                        }

                        { this.state.destinationFlights.length <= 0 ? "" : 
                            <table>
                                <thead>
                                    <tr>
                                        <th>Departure</th>
                                        <th>Arrival</th>
                                        <th>Carrier</th>
                                        <th>Price</th>
                                        <th>Direct</th>
                                        <th>Dep. Time</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.destinationFlights.map(flight => {
                                        return (
                                                <tr key={Math.random()}>
                                                    <td>{flight.originName}</td>
                                                    <td>{flight.destinationName}</td>
                                                    <td>{flight.carrier}</td>
                                                    <td>{flight.price}</td>
                                                    <td>{flight.direct}</td>
                                                    <td>{flight.departureTime}</td>
                                                </tr>
                                            )
                                    })}
                                </tbody>
                            </table>
                        }
                    </div>
                    
                    <div className="inboundFlights">
                        { this.state.startAirport.PlaceName === "" && this.state.endAirport.PlaceName === "" ? <h4>You haven't selected destinations, airports and dates</h4> :
                            <h4>Flights from {this.state.endAirport.PlaceName} to {this.state.startAirport.PlaceName} on {this.state.endDate} </h4>
                        }

                        { this.state.returnFlights.length <= 0 ? "" : 
                            <table>
                                <thead>
                                    <tr>
                                        <th>Departure</th>
                                        <th>Arrival</th>
                                        <th>Carrier</th>
                                        <th>Price</th>
                                        <th>Direct</th>
                                        <th>Dep. Time</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.returnFlights.map(flight => {
                                        return (
                                                <tr key={Math.random()}>
                                                    <td>{flight.originName}</td>
                                                    <td>{flight.destinationName}</td>
                                                    <td>{flight.carrier}</td>
                                                    <td>{flight.price}</td>
                                                    <td>{flight.direct}</td>
                                                    <td>{flight.departureTime}</td>
                                                </tr>
                                            )
                                    })}
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>
        );
    };
};

export default Flights;