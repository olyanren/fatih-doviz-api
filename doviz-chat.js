const socketIO = require('socket.io-client');


const socket = socketIO('https://socket_piyasa.paratic.com', {transports : ["websocket"]});
var arrOfCodesCache=["SGBP","SEUR"];

socket.on('connect', () => {

  // or with emit() and custom event names
  socket.emit("joinStream", {codes : arrOfCodesCache});
});
socket.on('reconnect_attempt', () => {
  socket.emit("joinStream", {codes : arrOfCodesCache})
});
// handle the event sent with socket.send()
socket.on("fb_changes", data => {
  console.log(data);
});
socket.on('error', data => {
  console.log(data);
});
// handle the event sent with socket.emit()
socket.on('greetings', (elem1, elem2, elem3) => {
  console.log(elem1, elem2, elem3);
});

socket.on("blink", function(data){

})
socket.on("hisse_senetleri", function(data) {
  if (data == "hisse senetleri err...") {
    return true;
  }
})
socket.on("spot_pariteler", function(data){
  console.log(data);
});

socket.on("serbest_piyasa", function(data){
  console.log(data);
});

socket.on("emtialar", function(data){
  console.log(data);
});
