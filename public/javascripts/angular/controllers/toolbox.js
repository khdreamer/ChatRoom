app.controller('toolbox', function ($scope, $state, $stateParams, $location, $rootScope) {

  $scope.voiceOn = false;
  
  $scope.toggleVoice = function(){

    $scope.voiceOn = !$scope.voiceOn;
    if($scope.voiceOn) $rootScope.$broadcast("turn_on_voice");
    else $rootScope.$broadcast("turn_off_voice");
    
  }

  $scope.leave = function(){

    $state.go("rooms");

  }

});