import React, { Component } from 'react';

class Search extends Component {
    constructor(props) {
        super(props);
        this.searchForCity = this.searchForCity.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.searchForAirports = this.searchForAirports.bind(this);
    };

    state = {
        startDestinations: [],
        endDestinations: [],
        startAirport: {},
        endAirport: {},
    };

    handleSubmit(event) {
        event.preventDefault();

        let startCity = this.state.startDestinations.find(c => c.display_name === event.target[0].value);
        let endCity = this.state.endDestinations.find(c => c.display_name === event.target[1].value);

        let startDestination = {
            long: startCity.lon,
            lat: startCity.lat,
            desc: "You are travelling from " + startCity.display_name,
        };

        let endDestination = {
            long: endCity.lon,
            lat: endCity.lat,
            desc: "You are travelling to " + endCity.display_name,
        };

        this.searchForAirports(startDestination, endDestination);
        this.props.updateDestinations(startDestination, endDestination);
    }

    searchForCity(startDestination) {
        let searchValue = document.getElementById("startDestination").value;
        let searchUrl = "https://nominatim.openstreetmap.org/search?city=" + searchValue + "&format=json";;
        let cityCheck = this.state.startDestinations.some(c => c.display_name === searchValue);

        if(!startDestination)
        {
            searchValue = document.getElementById("endDestination").value;
            searchUrl = "https://nominatim.openstreetmap.org/search?city=" + searchValue + "&format=json";
    
            cityCheck = this.state.endDestinations.some(c => c.display_name === searchValue);
        }

        if(!cityCheck)
        {
            fetch(searchUrl)
            .then(res => res.json())
                .then((result) => {
                    if(startDestination)
                        {
                        this.setState({
                            startDestinations: result
                                        });
                        }
                    else {
                        this.setState({
                            endDestinations: result
                                        });
                        }                   
                    })
                .catch((err) => {
                    if(startDestination)
                        {
                        this.setState({
                            error: err,
                            startDestinations: []
                            });
                        }
                    else {
                        this.setState({
                            error: err,
                            endDestinations: []
                        });
                    }   
                })
        }
    };

    searchForAirports(startDestination, endDestination)
    {
        fetch("https://ourairport-data-search.p.rapidapi.com/nearest/" + startDestination.lat + "," + startDestination.long + "?maxResults=1", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "ourairport-data-search.p.rapidapi.com",
                "x-rapidapi-key": process.env.REACT_APP_AIRPORTS_KEY
            }
        }).then(res => res.json())
        .then((result) => {
            this.setState({
                startAirport: result
                });
            })
        .catch((err) => {
            this.setState({
                error: err,
                startAirport: {}
                });   
        });
        
        fetch("https://ourairport-data-search.p.rapidapi.com/nearest/" + endDestination.lat + "," + endDestination.long + "?maxResults=1", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "ourairport-data-search.p.rapidapi.com",
                "x-rapidapi-key": process.env.REACT_APP_AIRPORTS_KEY
            }
        }).then(res => res.json())
        .then((result) => {
            this.setState({
                endAirport: result
                });

                this.props.updateAirports(this.state.startAirport, this.state.endAirport);
            })
        .catch((err) => {
            this.setState({
                error: err,
                endAirport: {}
                });   
        });
    };

    render() {
        return(
            <div className="startMenu">
            <h3>Choose location</h3>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="startDestination">Traveling from: </label>
                    <input type="search" id="startDestination" name="startDestination" onKeyUp={() => this.searchForCity(true)} list="startDestinations" autoComplete="off"/>

                    <datalist id="startDestinations">
                        {this.state.startDestinations.map((city, key) =>
                            <option key={key} value={city.display_name} />
                        )}
                    </datalist>

                    <label htmlFor="endDestination">Traveling to: </label>
                    <input type="search" id="endDestination" name="endDestination" onKeyUp={() => this.searchForCity(false)} list="endDestinations" autoComplete="off"/>

                    <datalist id="endDestinations">
                        {this.state.endDestinations.map((city, key) =>
                            <option key={key} value={city.display_name} />
                        )}
                    </datalist>

                    <input type="submit" value="Search"></input>
                </form>
            </div>
        );
    };
};

export default Search;