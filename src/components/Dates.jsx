import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class Dates extends Component {
    constructor(props) {
        super(props);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.handleDateSubmit = this.handleDateSubmit.bind(this);
        this.validateDate = this.validateDate.bind(this);
    };

    state = {
        startDate: new Date(),
        endDate: new Date(),

        startDateValid: true,
        endDateValid: true,
    };

    setStartDate(date) {
        let check = this.validateDate(date);

        this.setState({
            startDate: date,
            startDateValid: check,
        });
    };

    setEndDate(date) {
        let check = this.validateDate(date);

        this.setState({
            endDate: date,
            endDateValid: check,
        });
    };

    handleDateSubmit(event) {
        event.preventDefault();

        if(this.state.startDate instanceof Date && this.state.endDate instanceof Date
            && this.state.startDateValid && this.state.endDateValid)
        {
            this.props.updateDates(this.state.startDate, this.state.endDate);
        }
    };

    validateDate(date) {     
        let now = new Date();
        now.setHours(0,0,0,0);

        let check = false;

        if (date > now) {
            check = true;
        } 

        return check;
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
                <h4 className={this.state.startDateValid ? "validationPass" : "validationError"}>Start date is invalid!</h4>


                <h3 style={{marginTop: "20px"}}>Pick an end date for your vacation</h3>
                <DatePicker
                    selected={this.state.endDate}
                    onChange={date => this.setEndDate(date)}
                    isClearable
                    placeholderText="I have been cleared!"
                    />
                <h4 className={this.state.endDateValid ? "validationPass" : "validationError"}>End date is invalid!</h4>
                
                <form onSubmit={this.handleDateSubmit} className="date-form">
                    <input type="submit" value="Save"></input>
                </form>
            </div>
        );
    };
};

export default Dates;