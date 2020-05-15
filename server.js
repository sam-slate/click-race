var express = require('express');
var socket = require('socket.io');
var path = require('path')

var app = express();

var port = process.env.PORT || 8080;

server = app.listen(port, function(){
    console.log('server is running on port ' + port)
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}   


// Socket stuff

var socket = require('socket.io');
io = socket(server);


//Initialize variable to hold scores
var scores = {}

//Initialize bool to keep track of whether playing
var playing = true

// Make connection
io.on('connection', (socket) => {
    console.log("Connected with socket id of: " + socket.id)

    //Add id to the scores object
    scores[socket.id] = {score: 0, name: socket.id}

    // As soon as connection is made, emit data
    emit_data = {"scores": scores, "playing": playing}
    io.emit('UPDATE_DATA', emit_data);

    // Set up a listener to a send click emit
    socket.on('SEND_CLICK', function(data){
        // Log everything
        console.log("Received SEND_CLICK from " + socket.id + " with data of:")
        console.log(data)

        // Check if we are currently playing
        if (playing){
            // When a click is sent, add to score table and emit data again{
            scores[socket.id]["score"] += 1
        }
    
        emit_data["scores"] = scores
        io.emit('UPDATE_DATA', emit_data);

        console.log("Sending back emit data package of:")
        console.log(emit_data)
    })

    // Set up a listener to a change name emit
    // Expects data to be a string with a name
    socket.on('CHANGE_NAME', function(data){
        console.log("Received CHANGE_NAME from " + socket.id + " with data of:")
        console.log(data)

        scores[socket.id]["name"] = data

        emit_data["scores"] = scores
        io.emit('UPDATE_DATA', emit_data);

        console.log("Sending back emit data package of:")
        console.log(emit_data)
    })

    socket.on('disconnect', () => {
        //On disconnect, remove socket.id from scores data and emit data again
        delete scores[socket.id]
        
        emit_data["scores"] = scores
        io.emit('UPDATE_DATA', emit_data);

        console.log(socket.id + ' disconnected');
    });
});
