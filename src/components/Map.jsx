import React, { Component } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import Search from './Search';
import Dates from './Dates';
import Flights from './Flights';
import Hotels from './Hotels';

// Note: I am using rapidapi.com as it has all the apis I need and it requires a single key to use them all.
// Note: I am using Skyscanner Flight Search API for the flights information. Found at: https://rapidapi.com/skyscanner/api/skyscanner-flight-search/details
// Note: I am using Htoels API for the hotels and landmarks information. Found at: https://rapidapi.com/apidojo/api/hotels4/details
class Map extends Component {
    constructor(props) {
        super(props);
        this.updateDestinations = this.updateDestinations.bind(this);
        this.updateStartAirports = this.updateStartAirports.bind(this);
        this.updateEndAirports = this.updateEndAirports.bind(this);
        this.updateDates = this.updateDates.bind(this);
    };

    state = {
        startDestination: {
            long: 0,
            lat: 0,
            desc: "",
            city: "",
            country: "",
        },

        endDestination: {
            long: 0,
            lat: 0,
            desc: "",
            city: "",
            country: "",
        },

        startAirports: [],
        endAirports: [],
        
        startDate: "",
        endDate: "",

    };

    updateDestinations(startCity, endCity) {
        this.setState({
            startDestination: startCity,
            endDestination: endCity,
        });
    };

    updateStartAirports(startAirports) {
        this.setState({
            startAirports: startAirports,
        });
    }

    updateEndAirports(endAirports) {
        this.setState({
            endAirports: endAirports,
        });
    };

    updateDates(startDate, endDate) {
        this.setState({
            startDate: startDate,
            endDate: endDate,
        });
    }

    render() {
        return (
            <React.Fragment>

            <LeafletMap
                center={[this.state.startDestination.lat, this.state.startDestination.long]}
                zoom={3}
                attributionControl={true}
                zoomControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
                >

                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />

                { this.state.startDestination.lat === 0 && this.state.startDestination.long === 0 ? "" : 
                    <Marker position={[this.state.startDestination.lat, this.state.startDestination.long]}>
                    <Popup>
                        {this.state.startDestination.desc}
                    </Popup>
                    </Marker> 
                }

                { this.state.endDestination.lat === 0 && this.state.endDestination.long === 0 ? "" : 
                    <Marker position={[this.state.endDestination.lat, this.state.endDestination.long]}>
                    <Popup>
                        {this.state.endDestination.desc}
                    </Popup>
                    </Marker> 
                }
            </LeafletMap>

            {/* Left sidebar */}
            <Search updateDestinations={this.updateDestinations} updateStartAirports={this.updateStartAirports} 
                updateEndAirports={this.updateEndAirports}/>
            <Dates updateDates={this.updateDates}/>

            {/* Right sidebar */}
            <Flights startDate={this.state.startDate} endDate={this.state.endDate} 
                        startAirports={this.state.startAirports} endAirports={this.state.endAirports} />
                        { /*
            <Hotels startDate={this.state.startDate} endDate={this.state.endDate} 
                city={this.state.endDestination.city}/> */}
            
            </React.Fragment>
        );
    };
};

export default Map;