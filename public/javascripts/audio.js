 navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

/*
function gotStream(stream) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();

    // Create an AudioNode from the stream
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to destination to hear yourself
    // or any other node for processing!
    mediaStreamSource.connect(audioContext.destination);
}

navigator.getUserMedia({audio:true}, gotStream);
*/

//var localVid = document.getElementById("")

navigator.getUserMedia({audio: true, video: true}, function(stream){
        // Set your video displays
        $('#localVideo').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;        
}

var peer = new Peer({key: 'n0ti0wcjdu7919k9'});

