/*
 * Copyright (c) 2015.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

(function () {
    "use strict";

    var oauthApp = angular.module("OAuthApp", ["ngRoute", "OAuth2Provider"]);
    console.log("Initialising");
    oauthApp.constant("APP_CONST", {
        PARTIALS_DIR: "partials/",
        OAUTH_SERVER: "http://localhost:8080/oauth-server",
        RESOURCE_SERVER: "http://localhost:8081/resource-server",
        TOKEN_URL: "/oauth/token",
        PASSWORD_GRANT_TYPE: "grant_type=password",
        REFRESH_GRANT_TYPE: "grant_type=refresh_token",
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

    oauthApp.controller("loginController", ["$scope", "loginService", "APP_CONST",
        "OAUTH_CONSTANT", "$log", "$location", function ($scope, loginService, APP_CONST, OAUTH_CONSTANT, $log, $location) {
            $scope.message = "Login";
            $scope.username = "";
            $scope.password = "";
            $scope.login = function () {
                var loginPromise = loginService.login($scope.username, $scope.password, APP_CONST);
                loginPromise.then(function (response) {
                    $log.log("Controller AccessToken:%s", response.accessToken);
                    $scope.$emit(OAUTH_CONSTANT.EVENTS.LOGIN_CONFIRMED, response);
                    $location.path("/home");
                }, function (error) {

                    $log.log("Error :%s reason :%s, http status :%s", error.data.error, error.data.error_description, error.status);
                });
            };

        }]);


    oauthApp.controller("homeController", ["$scope", "$log", "$interval", "helloService", "refreshTokenService", "authInfoService", "APP_CONST",
        function ($scope, $log, $interval, helloService, refreshTokenService, authInfoService, APP_CONST) {
            $log.log("Initialising Home Controller");
            $scope.message = "Home";
            var i = 0;
            $scope.getHello = function () {

                helloService.getHello().then(function (response) {
                    $log.log(response);
                    response.data.code = response.data.code + "Refresh :" + i;
                    $scope.hello = response.data;
                    i++;
                }, function (error) {
                    $log.log(error);
                    $log.log("Error :%s reason :%s, http status :%s", error);

                });

            };
            function refresh() {
                console.log("Trying to refresh token after 30 seconds");
                authInfoService.expireToken();
                refreshTokenService.refreshToken(authInfoService.getAuthInfo().refreshToken, APP_CONST).then(function (authInfo) {
                    authInfoService.refresh(authInfo.accessToken, authInfo.expires);
                    $scope.getHello();
                }, function (error) {
                    console.error(error);

                });

            }

            $scope.refreshHello = function () {

                if (authInfoService.hasRefreshToken()) {
                    console.log("Will try in 30 seconds");
                    $interval(refresh, 3 * 1000, 1);
                }
            };
            $scope.getHello();

        }]);

    oauthApp.service("helloService", ["$http", "$log", "APP_CONST",
        function ($http, $log, APP_CONST) {
            var self = this;

            this.getHello = function () {
                var req = {
                    method: "POST",
                    url: self._buildHelloUrl()
                };

                return $http(req);
            };
            this._buildHelloUrl = function () {
                return APP_CONST.RESOURCE_SERVER + "/hello";
            };
        }
    ]);
})();