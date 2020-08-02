import React, { Component } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import Search from './Search';

class Map extends Component {
    constructor(props) {
        super(props);
        this.updateDestinations = this.updateDestinations.bind(this);
    };

    state = {
        startDestination: {
            long: 0,
            lat: 0,
            desc: ""
        },

        endDestination: {
            long: 0,
            lat: 0,
            desc: ""
        },

    };

    updateDestinations(startCity, endCity) {
        this.setState({
            startDestination: startCity,
            endDestination: endCity,
        });
    };

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

            <Search updateDestinations={this.updateDestinations}/>
            </React.Fragment>
        );
    };
};

export default Map;