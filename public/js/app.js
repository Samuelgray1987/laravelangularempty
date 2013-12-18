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

app.run(function($rootScope, $location, AuthenticationService){
  var routesThatRequireAuth = ['/home'];

  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if(_(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
      $location.path('/login');
    }
  });
});

app.factory('SessionService', function(){
  return {
    get: function(key) {
      return sessionStorage.getItem(key);
    },
    set: function(key, val) {
      return sessionStorage.setItem(key, val);
    },
    unset: function(key) {
      return sessionStorage.removeItem(key);
    }
  }
});
app.factory("AuthenticationService", function($http, $location, SessionService){ //http is the equivalent of $.ajax()
  var cacheSession = function() {
    SessionService.set('authenticated', true);
  };
  var unchacheSession = function() {
    SessionService.unset('authenticated');
  };
  return {
    login: function (credentials) {
      var login = $http.post("/auth/login", credentials);
      login.success(cacheSession);      
      return login;
    },
    logout: function () {
      var logout =  $http.get("/auth/logout");
      logout.success(unchacheSession);
      return logout;
    },
    isLoggedIn: function () {
      return SessionService.get('authenticated');
    }
  };
});


app.controller('LoginController', function($scope, $location, AuthenticationService){
  $scope.credentials = { email: "", password: "" };
  $scope.login = function() {
    AuthenticationService.login($scope.credentials).success(function(){
      $location.path('/home');
    });
  }
});
app.controller('HomeController', function($scope, AuthenticationService, $location){
  $scope.title = "Home";
  $scope.message = "mouse over the images to see a directive in action.";
  $scope.logout = function () {
    AuthenticationService.logout().success(function(){
      $location.path('/login');
    });
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