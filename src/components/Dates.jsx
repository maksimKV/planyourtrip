import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class Dates extends Component {
    constructor(props) {
        super(props);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.handleDateSubmit = this.handleDateSubmit.bind(this);
    };

    state = {
        startDate: new Date(),
        endDate: new Date(),
    };

    setStartDate(date) {
        this.setState({
            startDate: date,
        });
    };

    setEndDate(date) {
        this.setState({
            endDate: date,
        });
    };

    handleDateSubmit(event) {
        event.preventDefault();

        if(this.state.startDate instanceof Date && this.state.endDate instanceof Date)
        {
            this.props.updateDates(this.state.startDate, this.state.endDate);
        }
    };

    render() {
        return (
            <div className="datePicker">
                <h3>Pick a starting date for your vacation</h3>
                <div className="react-datepicker-wrapper">
                <DatePicker
                    selected={this.state.startDate}
                    onChange={date => this.setStartDate(date)}
                    isClearable
                    placeholderText="I have been cleared!"
                    />
                </div>
                <h3 style={{marginTop: "20px"}}>Pick an end date for your vacation</h3>
                <DatePicker
                    selected={this.state.endDate}
                    onChange={date => this.setEndDate(date)}
                    isClearable
                    placeholderText="I have been cleared!"
                    />
                
                <form onSubmit={this.handleDateSubmit} className="date-form">
                    <input type="submit" value="Save"></input>
                </form>
            </div>
        );
    };
};

export default Dates;