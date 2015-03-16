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

    var authProvider = angular.module('OAuth2Provider', []);
    /****
     *  Our implementation will use ng-storage to store
     *  client auth info and use events to interact
     *  with  client modules
     */
    authProvider.constant('OAUTH_CONSTANT', {
        "EVENTS": {
            "LOGIN_CONFIRMED": "event:oauth:login-confirmed"
        }
    });

    authProvider.factory("authInfoService", function () {

        var _authInfo = {
            accessToken: "",
            isLoggedIn: false,
            refreshToken: "",
            expires: 0,
            scope: ""
        };

        this.getAuthInfo = function () {
            return _authInfo;
        };
        this.setAuthInfo = function (authInfo) {
            _authInfo = authInfo;
        };

        this.hasAccessToken = function () {
            return _authInfo.accessToken;
        };

        this.hasRefreshToken = function () {
            return _authInfo.refreshToken;
        };

        this.toString = function () {
            return "accessToken:" + _authInfo.accessToken +
                "isLoggedIn :" + _authInfo.isLoggedIn +
                "refreshToken:" + _authInfo.refreshToken +
                "expires:" + _authInfo.expires +
                "scope:" + _authInfo.scope;
        };
        return this;
    });

    authProvider.service("encodeService", function () {
        /* global window,base64 */
        this.encodeData = function (data) {
            if (window.btoa) {
                return window.btoa(data);
            }
            else {
                return base64.encode(data);
            }
        };

        this.decodeData = function (data) {
            if (window.atob) {
                return window.atob(data);
            } else {
                return base64.decode(data);
            }
        };

    });

    authProvider.service("oAuthHelper",["encodeService",function(encodeService){

        this.getBaseAuthenticationHeader = function (urlInfo) {
            var BASIC_HEADER_VALUE = encodeService.encodeData(urlInfo.CLIENT_ID + ":" + "");
            return {
                "Authorization": "Basic " + BASIC_HEADER_VALUE

            };

        };

        this.buildAuthUrl = function (username, password, urlInfo) {

            return urlInfo.OAUTH_SERVER + urlInfo.TOKEN_URL + "?" +
                urlInfo.PASSWORD_GRANT_TYPE +
                "&" + "username=" + username + "&" + "password=" + password;

        };
        this.buildRefreshTokenUrl = function(refreshToken,urlInfo){

            return urlInfo.OAUTH_SERVER + urlInfo.TOKEN_URL + "?" +
                urlInfo.REFRESH_GRANT_TYPE +
                "&" + "refreshToken=" + refreshToken;
        };
        this.processAuthResponse = function(data){
            return {
                "accessToken": data.access_token,
                "refreshToken": data.refresh_token,
                "expires": data.expires_in,
                "scope": data.scope
            };
        };

        this.processError = function(data,status){
            return {
                data: data,
                status: status
            };
        };


    }]);

    authProvider.service("refreshTokenService",["$http","q","$log","oAuthHelper"],
    function($http,$q,$log,oAuthHelper){
        this.refreshToken = function(refreshToken,urlInfo){
            var url = oAuthHelper.buildRefreshTokenUrl(refreshToken,urlInfo);
            var req = {
                method: "POST",
                url: url,
                headers: oAuthHelper.getBaseAuthenticationHeader(urlInfo)
            };
            var deferred = $q.defer();
            $http(req).success(function (data) {

                deferred.resolve(oAuthHelper.processAuthResponse(data));
            }).error(function (data, status) {
                deferred.reject(oAuthHelper.processError(data,status));
            });

            return deferred.promise;

        };
    });

    authProvider.service("loginService", ["$http", "$q", "$log", "oAuthHelper",
        function ($http, $q, $log, oAuthHelper) {

            this.login = function (username, password, urlInfo) {
                var url = oAuthHelper.buildAuthUrl(username, password, urlInfo);
                $log.log("Login Url :%s" + url);
                var encodedBasic = oAuthHelper.getBaseAuthenticationHeader(urlInfo);
                var req = {
                    method: "POST",
                    url: url,
                    headers: encodedBasic
                };
                var deferred = $q.defer();
                $http(req).success(function (data) {
                    $log.log("Service AccessToken:%s", data.access_token);
                    deferred.resolve(oAuthHelper.processAuthResponse(data));
                }).error(function (data, status) {
                    deferred.reject(oAuthHelper.processError(data,status));
                });

                return deferred.promise;

            };



        }]);

    authProvider.factory("bearerTokenInterceptor", ["authInfoService", function (authInfoService) {
        this.request = function (config) {

            if (authInfoService.hasAccessToken()) {
                config.headers['Authorization'] = 'Bearer ' + authInfoService.getAuthInfo().accessToken;
            }

            return config;

        };

        return this;

    }]);

    authProvider.factory("refreshTokenInterceptor", ["authInfoService","refreshTokenService", "$q", function (authInfoService,refreshTokenService,$q) {

        var self = this;

        var HTTP_UNAUTHORIZED = 401,
            OAUTH_UNAUTHORIZED_CODE = "unauthorized";

        //TODO: Get From local storage
        var urlInfo ={
            PARTIALS_DIR: "partials/",
            OAUTH_SERVER: "http://localhost:8080/oauth-server",
            RESOURCE_SERVER: "http://localhost:8081/resource-server",
            TOKEN_URL: "/oauth/token",
            PASSWORD_GRANT_TYPE: "grant_type=password",
            REFRESH_GRANT_TYPE: "grant_type=refresh_token",
            CLIENT_ID: "test"
        };

        this.isTokenRefreshable = function (status, data) {
            return (authInfoService.hasRefreshToken() &&
            status === HTTP_UNAUTHORIZED && data.error === OAUTH_UNAUTHORIZED_CODE);
        };

        this.responseError = function (rejection) {

            if (self.isTokenRefreshable(rejection.status, rejection.data)) {
                console.log("Token Refreshable Status :%s Data :%s", rejection.status, rejection.data.error);
                return refreshTokenService.refreshToken(authInfoService.getAuthInfo().refreshToken,urlInfo).then(function(data){
                    authInfoService.setAuthInfo(data);
                },function(error){
                     authInfoService.setAuthInfo(null);
                    return $q.reject(rejection);
                });


            } else {
                console.log(" Token not refreshable Status ", rejection.status, rejection.data.error);
            }
            return $q.reject(rejection);

        };

        return this;

    }]);

    authProvider.run(["$rootScope", "authInfoService", "OAUTH_CONSTANT", "$log", function ($rootScope, authInfoService,
                                                                                           OAUTH_CONSTANT, $log) {

        $rootScope.$on(OAUTH_CONSTANT.EVENTS.LOGIN_CONFIRMED, function (event, data) {
            $log.log(data.accessToken);
            authInfoService.setAuthInfo(data);
            authInfoService.getAuthInfo().isLoggedIn = true;
            $log.log(authInfoService.toString());
        });

    }]);

    authProvider.config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push("bearerTokenInterceptor");
        $httpProvider.interceptors.push("refreshTokenInterceptor");

    }])

})();
