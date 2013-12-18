var app = angular.module("app", ['ngSanitize']).config (function($routeProvider){
    $routeProvider.when('/login', {
      templateUrl: '/templates/login.html',
      controller: 'LoginController'
    });
    $routeProvider.when('/home', {
      templateUrl: '/templates/home.html',
      controller: 'HomeController'
    });
    $routeProvider.otherwise({
      redirectTo: '/login'
    });
});

app.factory("AuthenticationService", function($location){
  return {
    login: function (credentials) {
      if (credentials.username == "ralph"){
        $location.path('/home');
      }
    },
    logout: function () {
      $location.path('/login');
    }
  };
});


app.controller('LoginController', function($scope, $location, AuthenticationService){
  $scope.credentials = { username: "", password: "" };
  $scope.login = function() {
    AuthenticationService.login($scope.credentials);
  }
});
app.controller('HomeController', function($scope, AuthenticationService){
  $scope.title = "Home";
  $scope.message = "mouse over the images to see a directive in action.";
  $scope.logout = function () {
    AuthenticationService.logout();
  }
  
});

app.directive('showMessageOnMouseover', function(){
  return {
    restrict: "A", //A = Attribute, C = Classname, E = Element, M = HTML Comment
    link: function (scope, element, attributes){
      var originalMessage = scope.message;
      element.bind("mouseover", function() { //jQuery equiv = element.on('mouseover', function(){});
        scope.message = attributes.message;
        scope.$apply();
      });
      element.bind("mouseout", function() {
        scope.message = originalMessage;
        scope.$apply();
      });
    }
  };
});