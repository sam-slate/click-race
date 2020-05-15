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
            name: "Enter Name",
            playing: false, 
            seconds: 60,
            scores: {}
        }

        this.button_clicked = this.button_clicked.bind(this)
        this.create_scores_array = this.create_scores_array.bind(this)
        this.name_changed = this.name_changed.bind(this)
        this.start_clicked = this.start_clicked.bind(this)

    }

    componentDidMount(){
        // Initialize socket

        this.socket = io();

        // Set up a listener for scores as an object
        this.socket.on('UPDATE_SCORES', scores => {
            console.log("Recieved new scores:")
            console.log(scores)

            // When getting updated num clicks data, change state
            this.setState({scores: scores})
        });

        // Set up listener for the start
        // Data should be a number of seconds and scores as an object
        this.socket.on('START', (seconds, scores) => {
            console.log("Recieved start with seconds of: " + seconds + "and scores of: ")
            console.log(scores)

            // Change seconds, scores, and playing in state
            this.setState({seconds: seconds, scores: scores, playing: true})
        })

        // Set up listener for the finish
        // Data should be scores as an object
        this.socket.on('FINISH', scores => {
            console.log("Recieved finish with scores:")
            console.log(scores)

            this.setState({scores: scores, playing: false})
        })
    }

    name_changed(e){
        this.setState({name: e.target.value})

        this.socket.emit('CHANGE_NAME', e.target.value)
    }

    button_clicked(){
        this.socket.emit('SEND_CLICK');

        console.log("button clicked")
    }

    start_clicked(){
        this.socket.emit('START_CLICK', this.state.seconds)

        console.log('start button clicked')
    }

    create_scores_array(){
         // Create scores array
         var scores_array = Object.keys(this.state.scores).map(key => {
            return [this.state.scores[key]["name"], this.state.scores[key]["score"]];
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
                                    <Form.Control id="name-form" size="sm" placeholder="Enter name" onChange={this.name_changed}/>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Row>
                    <Row className="main-content-row justify-content-center">
                        <Form>
                            <Form.Group as={Row} >
                                <Form.Label column xs="auto" id="name-label">Seconds:</Form.Label>
                                <Col xs="auto">   
                                    <Form.Control id="name-form" size="sm" value={this.state.seconds} onChange={e => {this.setState({seconds: e.target.value})}}/>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Row>
                    <Row className="main-content-row justify-content-center">
                        <button type="button" id="start-button" className="btn btn-success btn-sm" onClick={this.start_clicked}>Start</button>
                    </Row>
                    <Row className="main-content-row justify-content-center">
                        <button type="button" id="click-me-button" className="btn btn-primary btn-lg" onClick={this.button_clicked}>Click Me</button>
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