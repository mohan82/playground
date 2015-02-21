/*
 * Copyright (c) 2015.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
"use strict";
var oauthApp = angular.module("OAuthApp", ["ngRoute"]);
console.log("Initialising");
oauthApp.constant("CONST", {
    partialsDir: "partials/"

});

oauthApp.config(['$routeProvider', 'CONST', function ($routeProvider, CONST) {
    $routeProvider.when("/", {
        templateUrl: CONST.partialsDir + "login.html",
        controller: "loginController"

    }).when("/home", {
        templateUrl: CONST.partialsDir + "home.html",
        controller: "homeController"

    }).otherwise({
        redirectTo: '/'

    });

}]);

oauthApp.controller('loginController', ["$scope", function ($scope) {
    console.log("Initialising Login Controller");
    $scope.message = "Login";

}]);
oauthApp.controller("homeController", ["$scope", function ($scope) {
    console.log("Initialising Home Controller");
    $scope.message = "Home";

}]);