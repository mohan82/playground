/**
 * Created by mohana on 20/02/2015.
 */
"use strict";
var oauthApp = angular.module("oauthApp", ['ngRoute']);

oauthApp.constant('ROUTES', {

    routeLogin: '/login',
    routeLogOut: '/logout',
    home: '/home'
});

oauthApp.config(['$routeProvider', '$locationProvider', 'ROUTES', function ($routeProvider, $locationProvider, ROUTES) {
    $routeProvider.when('/', {
        templateUrl: 'partials/login.html',
        controller: 'loginController'

    }).when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'loginController'

    }).when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'homeController'

    }).when('/logout', {
        templateUrl: 'partials/logout.html',
        controller: 'logoutController'

    }).otherwise({
        templateUrl: 'partials/login.html',
        controller: 'loginController'

    });
}]);

oauthApp.controller("homeController", ['$scope', function ($scope) {
    $scope.message = "Home";

}]);

oauthApp.controller("loginController", ['$scope', function ($scope) {

    $scope.message = "Login";
}]);

oauthApp.controller("logoutController", ['$scope', function ($scope) {

    $scope.message = "LogOut";
}]);

