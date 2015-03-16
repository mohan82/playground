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
    var authProvider = angular.module("OAuth2Provider");
    authProvider.service("oAuthHelper", ["encodeService", function (encodeService) {

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
        this.buildRefreshTokenUrl = function (refreshToken, urlInfo) {

            return urlInfo.OAUTH_SERVER + urlInfo.TOKEN_URL + "?" +
                urlInfo.REFRESH_GRANT_TYPE +
                "&" + "refresh_token=" + refreshToken;
        };
        this.processAuthResponse = function (data) {
            return {
                "accessToken": data.access_token,
                "refreshToken": data.refresh_token,
                "expires": data.expires_in,
                "scope": data.scope
            };
        };

        this.processError = function (data, status) {
            return {
                data: data,
                status: status
            };
        };


    }]);

    authProvider.service("refreshTokenService", ["$http", "$q", "$log", "oAuthHelper", function ($http, $q, $log, oAuthHelper) {
        this.refreshToken = function (refreshToken, urlInfo) {
            var url = oAuthHelper.buildRefreshTokenUrl(refreshToken, urlInfo);
            var encodedBasic = oAuthHelper.getBaseAuthenticationHeader(urlInfo);

            var req = {
                method: "POST",
                url: url,
                headers: encodedBasic
            };
            var deferred = $q.defer();
            $http(req).success(function (data) {

                deferred.resolve(oAuthHelper.processAuthResponse(data));
            }).error(function (data, status) {
                deferred.reject(oAuthHelper.processError(data, status));
            });

            return deferred.promise;

        };
    }]);

    authProvider.service("loginService", ["$http", "oAuthHelper", "$q", "$log", "encodeService",
        function ($http, oAuthHelper, $q, $log) {

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
                    deferred.reject(oAuthHelper.processError(data, status));
                });

                return deferred.promise;

            };

        }]);

    authProvider.factory("authInfoService", function () {

        var _authInfo = {
            accessToken: "",
            isLoggedIn: false,
            refreshToken: "",
            expires: 0,
            scope: ""
        };

        this.configure = function (authInfo) {
            _authInfo = authInfo;
        };

        this.getAuthInfo = function () {
            return _authInfo;
        };

        this.hasAccessToken = function () {
            return _authInfo.accessToken;
        };

        this.hasRefreshToken = function () {
            return _authInfo.refreshToken;
        };

        this.refresh = function (accessToken, expires) {
            _authInfo.accessToken = accessToken;
            _authInfo.expires = expires;
            _authInfo.isLoggedIn = true;
        };

        this.expireToken = function () {
            _authInfo.accessToken = null;
            _authInfo.isLoggedIn = false;
            _authInfo.expires = 0;
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


})();
