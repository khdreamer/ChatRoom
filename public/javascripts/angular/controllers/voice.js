app.controller('voice', function ($scope, $state, $stateParams, $location, $rootScope) {

  var webrtc;

  $rootScope.$on('turn_on_voice', function(){

    console.log("voice on");

    if(!webrtc){

      webrtc = new SimpleWebRTC({

        localVideoEl: 'localVideo',
        remoteVideosEl: '',
        autoRequestMedia: true,
        media: {
          audio: true,
          video: false
        },
        debug: false,
        detectSpeakingEvents: false,
        autoAdjustMic: false

      });

      var room = $stateParams.roomName;

      webrtc.on('readyToCall', function () {
        if(room) webrtc.joinRoom(room);
      });

      function showVolume(el, volume) {

        if (!el) return;
        if (volume < -45) { // vary between -45 and -20
          el.style.height = '0px';
        }
        else if (volume > -20) {
          el.style.height = '100%';
        }
        else {
          el.style.height = '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%';
        }
      }

      webrtc.on('channelMessage', function (peer, label, data) {
        if (data.type == 'volume') {
          showVolume(document.getElementById('volume_' + peer.id), data.volume);
        }
      });

      webrtc.on('videoAdded', function (video, peer) {
        console.log('video added', peer);
        var remotes = document.getElementById('remotes');
        if (remotes) {
          var d = document.createElement('div');
          d.className = 'videoContainer';
          d.id = 'container_' + webrtc.getDomId(peer);
          d.appendChild(video);
          var vol = document.createElement('div');
          vol.id = 'volume_' + peer.id;
          vol.className = 'volume_bar';
          video.onclick = function () {
            video.style.width = video.videoWidth + 'px';
            video.style.height = video.videoHeight + 'px';
          };
          d.appendChild(vol);
          remotes.appendChild(d);
        }
      });

      webrtc.on('videoRemoved', function (video, peer) {
        console.log('video removed ', peer);
        var remotes = document.getElementById('remotes');
        var el = document.getElementById('container_' + webrtc.getDomId(peer));
        if (remotes && el) {
          remotes.removeChild(el);
        }
      });

      webrtc.on('volumeChange', function (volume, treshold) {
        showVolume(document.getElementById('localVolume'), volume);
      });
    
    }
    else {

      webrtc.resume();

    }

  });

  $rootScope.$on('turn_off_voice', function(){

    console.log("voice off");

    webrtc.pause();

  });

});