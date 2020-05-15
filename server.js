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

// Set up number of clicks to be 0
var total_num_clicks = 0

var scores = {}

// Make connection
io.on('connection', (socket) => {
    console.log("socket id is: " + socket.id)

    // As soon as connection is made, emit data
    emit_data = {"scores": scores, "total_num_clicks": total_num_clicks}
    io.emit('UPDATE_DATA', emit_data);

    console.log("Connected");

    // Set up a listener to a send click emit
    socket.on('SEND_CLICK', function(data){
      // When a click is sent, add to score table and emit data again
      total_num_clicks += 1
      if (!(data["name"] in  scores)){
        scores[data["name"]] = 1
      } else {
        scores[data["name"]] += 1
      }

      emit_data["scores"] = scores
      emit_data["total_num_clicks"] = total_num_clicks
      io.emit('UPDATE_DATA', emit_data);
      console.log(data)
      console.log(scores)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
