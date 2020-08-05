import React, { Component } from 'react';

class Flights extends Component {
    constructor(props) {
        super(props);
        this.getInboundFlights = this.getInboundFlights.bind(this);
        this.getOutboundFlights = this.getOutboundFlights.bind(this);
        this.handleStartAirport = this.handleStartAirport.bind(this);
        this.handleEndAirport = this.handleEndAirport.bind(this);
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
            PlaceName: "",
        },
        endAirport: {
            PlaceName: "",
        },

        outboundFlights: [],
        inboundFlights: [],
    };

    componentDidUpdate() {
        if(this.state.startAirports !== this.props.startAirports && this.props.startAirports.length > 0
            && this.state.endAirports !== this.props.endAirports && this.props.endAirports.length > 0)
        {
            this.setState({
                startAirports: this.props.startAirports,
                endAirports: this.props.endAirports,

                startAirport: this.props.startAirports[0],
                endAirport: this.props.endAirports[0],
            });
        };

        if(this.state.startDate !== this.props.startDate.toDateString() && this.props.startDate !== "") {
            this.setState({
                startDate: this.props.startDate.toDateString(),
            });
        };

        if(this.state.endDate !== this.props.endDate.toDateString() && this.props.endDate !== "") {
            this.setState({
                endDate: this.props.endDate.toDateString(),
            });
        }
    }

    getInboundFlights() {
        
    }

    getOutboundFlights() {
        
    }

    handleStartAirport(e) {
        let airport = this.state.startAirports.find(airport => airport.PlaceId === e.target.value);

        this.setState({
            startAirport: airport,
        });
    }

    handleEndAirport(e) {
        let airport = this.state.endAirports.find(airport => airport.PlaceId === e.target.value);

        this.setState({
            endAirport: airport,
        });
    }

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

                <div className="outboundFlights">
                    { this.state.startAirport.PlaceName === "" && this.state.endAirport.PlaceName === "" ? <h4>You haven't selected destinations, airports and dates</h4> :
                        <h4>Flights from {this.state.startAirport.PlaceName} to {this.state.endAirport.PlaceName} on {this.state.startDate} </h4>
                    }
                </div>
                
                <div className="inboundFlights">
                    { this.state.startAirport.PlaceName === "" && this.state.endAirport.PlaceName === "" ? <h4>You haven't selected destinations, airports and dates</h4> :
                        <h4>Flights from {this.state.endAirport.PlaceName} to {this.state.startAirport.PlaceName} on {this.state.endDate} </h4>
                    }
                </div>
            </div>
        );
    };
};

export default Flights;