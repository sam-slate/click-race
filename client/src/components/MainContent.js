import React from 'react';
import io from "socket.io-client";
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Container from "react-bootstrap/Container"

class MainContent extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            total_num_clicks: 0,
            name: "Enter Name",
            scores: {}
        }

        this.button_clicked = this.button_clicked.bind(this)
        this.create_scores_array = this.create_scores_array.bind(this)

        // Initialize socket

        // Uncomment for heroku/production
        this.socket = io();
        // this.socket = io("http://localhost:8080/")

        // Set up a listener for the data
        this.socket.on('UPDATE_DATA', data => {
            console.log("Recieved new data")
            console.log(data)

            // When getting updated num clicks data, change state
            this.setState({total_num_clicks: data["total_num_clicks"], scores: data["scores"]})
            console.log("Recieved num_clicks: " + data["total_num_clicks"])
        });
    }

    button_clicked(){
        this.socket.emit('SEND_CLICK', {
            name: this.state.name,
        });

        console.log("button clicked")
    }

    create_scores_array(){
         // Create scores array
         var scores_array = Object.keys(this.state.scores).map(key => {
            return [key, this.state.scores[key]];
        });
        
        // Sort the array based on the second element
        scores_array.sort(function(first, second) {
            return second[1] - first[1];
        });

        return scores_array
    }

    render(){
        return(
                <Container id="main-content-container">
                    <Row className="main-content-row justify-content-center">
                        <i>Enter your name, start clicking, and keep track on the scoreboard below</i>
                    </Row>  
                    <Row className="main-content-row justify-content-center">
                        <Form>
                            <Form.Group as={Row} >
                                <Form.Label column xs="auto" id="name-label">Name:</Form.Label>
                                <Col xs="auto">   
                                    <Form.Control id="name-form" size="sm" placeholder="Enter name" onChange={e => {this.setState({name: e.target.value})}}/>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Row>
                    <Row className="main-content-row justify-content-center">
                        <button type="button" id="click-me-button" className="btn btn-primary btn-lg" onClick={this.button_clicked}>Click Me</button>
                    </Row>
                    <Row className="main-content-row justify-content-center">
                        <p>Total number of clicks: {this.state.total_num_clicks}</p>
                    </Row>
                    <Row className="main-content-row justify-content-center">
                        <div>
                            <b>Scoreboard:</b>
                            <ol>
                                {this.create_scores_array().map((value, index) => {
                                    return <li key={index}>{value[0]}: {value[1]}</li>
                                })}
                            </ol>
                        </div>
                    </Row>
                </Container>
        )
    }
}

export default MainContent