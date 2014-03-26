app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to landing
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('rooms', {
      url: "/",
      templateUrl: "/javascripts/angular/views/rooms.html"
    })
    .state('draw', {
      url: "/room/:roomName",
      templateUrl: "/javascripts/angular/views/chat.html"
    })
    .state('draw_test', {
      url: "/draw",
      templateUrl: "/javascripts/angular/views/draw_test.html"
    })
    .state('upload', {
      url: "/upload",
      templateUrl: "/javascripts/angular/views/upload.html"
    })
    .state('video', {
      url: "/video/:roomName",
      templateUrl: "/javascripts/angular/views/voice.html"
    })
     
});

// app.run(function ($rootScope, $state, $stateParams) {
//   $rootScope.$state = $state;
//   $rootScope.$stateParams = $stateParams;
// });
