/*
 * Copyright (c) 2015.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
"use strict";

var oauthApp = angular.module("OAuthApp", ["ngRoute", "OAuth2Provider"]);
console.log("Initialising");
oauthApp.constant("APP_CONST", {
    PARTIALS_DIR: "partials/",
    OAUTH_SERVER: "http://localhost:8080/oauth-server",
    RESOURCE_SERVER: "http:/localhost:8081/resource-server",
    AUTHENTICATION_ENDPOINT: "/oauth/token",
    GRANT_TYPE_URL: "grant_type=password",
    CLIENT_ID: "test"
});

oauthApp.config(["$routeProvider", "$httpProvider", "APP_CONST", function ($routeProvider, $httpProvider, APP_CONST) {
    $routeProvider.when("/", {
        templateUrl: APP_CONST.PARTIALS_DIR + "login.html",
        controller: "loginController"

    }).when("/home", {
        templateUrl: APP_CONST.PARTIALS_DIR + "home.html",
        controller: "homeController"

    }).otherwise({
        redirectTo: "/"

    });


}]);

oauthApp.controller("loginController", ["$scope", "loginService",
    "OAUTH_CONSTANT", "$log", function ($scope, loginService, OAUTH_CONSTANT, $log) {
        $log.log("Initialising Login Controller" + OAUTH_CONSTANT.OAUTH_SERVER);
        $log.log("Auth info is " + $scope.user.oauthInfo.isLoggedIn + $scope.user.oauthInfo.accessToken + $scope.user.oauthInfo.refreshToken);
        $scope.message = "Login";
        $scope.username = "";
        $scope.password = "";
        $scope.login = function () {

            loginService.login($scope.username, $scope.password);
        };

    }]);


oauthApp.service("loginService", ["$http", "$log", "APP_CONST", "$location", function ($http, $log, APP_CONST, $location) {
    var self = this;
    //TODO:window.btoa is not supported in IE 9
    var BASIC_HEADER_VALUE = window.btoa(APP_CONST.CLIENT_ID + ":" + "");

    this.login = function (username, password) {
        var url = this.buildAuthUrl(username, password);

        $log.log("Login Url :%s" + url);
        var encodedBasic = this.getBaseAuthenticationHeader();
        var req = {
            method: 'POST',
            url: url,
            headers: encodedBasic
        };
        $http(req).success(function (data, status, headers, config) {
            $log.log("Success :%s ,status :%s", data, status);
            $location.path("/home");


        }).error(function (data, status) {

            $log.log("Error :%s ,status :%s", data, status);
        });

    };

    this.getBaseAuthenticationHeader = function () {
        return {
            'Authorization': 'Basic ' + BASIC_HEADER_VALUE

        };

    };

    this.buildAuthUrl = function (username, password) {

        return APP_CONST.OAUTH_SERVER + APP_CONST.AUTHENTICATION_ENDPOINT + "?" +
            APP_CONST.GRANT_TYPE_URL +
            "&" + "username=" + username + "&" + "password=" + password;

    };

}]);


oauthApp.controller("homeController", ["$scope", "$log", function ($scope, $log) {
    $log.log("Initialising Home Controller");
    $scope.message = "Home";

}]);
