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

    oauthApp.controller("loginController", ["$scope", "loginService",
        "OAUTH_CONSTANT", "$log", "$location", function ($scope, loginService, OAUTH_CONSTANT, $log, $location) {
            $scope.message = "Login";
            $scope.username = "";
            $scope.password = "";
            $scope.login = function () {
                var loginPromise = loginService.login($scope.username, $scope.password);
                loginPromise.then(function (response) {
                    $log.log("Controller AccessToken:%s", response.accessToken);
                    $scope.$emit(OAUTH_CONSTANT.EVENTS.LOGIN_CONFIRMED, response);
                    $location.path("/home");
                }, function (error) {

                    $log.log("Error :%s reason :%s, http status :%s", error.data.error, error.data.error_description, error.status);
                });
            };

        }]);

    oauthApp.service('encodeService', function () {
        /* global window,base64 */
        this.encodeData = function (data) {
            if (window.btoa) {
                return window.btoa(data);
            }
            else {
                return base64.encode(data);
            }
        };

    });

    oauthApp.service("loginService", ["$http", "$q", "$log", "APP_CONST", "encodeService",
        function ($http, $q, $log, APP_CONST, encodeService) {
            var self = this;

            this.login = function (username, password) {
                var url = this.buildAuthUrl(username, password);
                $log.log("Login Url :%s" + url);
                var encodedBasic = this.getBaseAuthenticationHeader();
                var req = {
                    method: 'POST',
                    url: url,
                    headers: encodedBasic
                };
                var deferred = $q.defer();
                $http(req).success(function (data) {
                    $log.log("Service AccessToken:%s", data.access_token);
                    var result = {
                        "accessToken": data.access_token,
                        "refreshToken": data.refresh_token,
                        "expires": data.expires_in,
                        "scope": data.scope
                    };
                    deferred.resolve(result);
                }).error(function (data, status) {
                    var errorObj = {
                        data: data,
                        status: status
                    };
                    deferred.reject(errorObj);
                });

                return deferred.promise;

            };

            this.getBaseAuthenticationHeader = function () {
                var BASIC_HEADER_VALUE = encodeService.encodeData(APP_CONST.CLIENT_ID + ":" + "");
                return {
                    'Authorization': 'Basic ' + BASIC_HEADER_VALUE

                };

            };

            this.buildAuthUrl = function (username, password) {

                return APP_CONST.OAUTH_SERVER + APP_CONST.TOKEN_URL + "?" +
                    APP_CONST.PASSWORD_GRANT_TYPE +
                    "&" + "username=" + username + "&" + "password=" + password;

            };

        }]);


    oauthApp.controller("homeController", ["$scope", "$log", "helloService", function ($scope, $log, helloService) {
        $log.log("Initialising Home Controller");
        $scope.message = "Home";
        $scope.getHello = function () {

            helloService.getHello().then(function (response) {
                $log.log(response);
                $scope.hello = response.data;
            }, function (error) {
                $log.log(error);
                $log.log("Error :%s reason :%s, http status :%s", error);

            });

        };
        $scope.getHello();

    }]);

    oauthApp.service('helloService', ["$http", "$log", "APP_CONST", "encodeService", "authInfoService",
        function ($http, $log, APP_CONST, encodeService, authInfoService) {
            var self = this;

            this.getHello = function () {
                var req = {
                    method: 'POST',
                    url: self._buildHelloUrl(),
                    headers: self.getBearerHeader()
                };

                return $http(req);
            };
            this._buildHelloUrl = function () {
                return APP_CONST.RESOURCE_SERVER + "/hello";
            };
            this.getBearerHeader = function () {

                var encodedToken = authInfoService.getAuthInfo().accessToken;
                $log.log("Encoded Token %s", encodedToken);
                return {
                    'Authorization': 'Bearer ' + encodedToken

                };
            };
        }
    ]);
})();