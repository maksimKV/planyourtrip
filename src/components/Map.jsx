import React, { Component } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import Search from './Search';
import Dates from './Dates';
import Flights from './Flights';

// Note: I am using rapidapi.com as it has all the apis I need and it requires a single key to use them all.
class Map extends Component {
    constructor(props) {
        super(props);
        this.updateDestinations = this.updateDestinations.bind(this);
        this.updateAirports = this.updateAirports.bind(this);
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

    updateAirports(startAirports, endAirports) {
        this.setState({
            startAirports: startAirports,
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
            <Search updateDestinations={this.updateDestinations} updateAirports={this.updateAirports}/>
            <Dates updateDates={this.updateDates}/>

            {/* Right sidebar */}
            <Flights startDate={this.state.startDate} endDate={this.state.endDate} 
                        startAirports={this.state.startAirports} endAirports={this.state.endAirports} />
            
            </React.Fragment>
        );
    };
};

export default Map;