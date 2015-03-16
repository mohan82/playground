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

    authProvider.factory("bearerTokenInterceptor", ["authInfoService", function (authInfoService) {
        this.request = function (config) {

            if (authInfoService.hasAccessToken() && authInfoService.getAuthInfo().expires) {
                config.headers.Authorization = 'Bearer ' + authInfoService.getAuthInfo().accessToken;
            }

            return config;

        };

        return this;

    }]);

    authProvider.factory("refreshTokenInterceptor", ["authInfoService", "$injector",
        "$q", function (authInfoService, $injector, $q) {

            var self = this;
            //Work around Circular Dependency issue

            var HTTP_UNAUTHORIZED = 401,
                OAUTH_UNAUTHORIZED_CODE = "unauthorized";

            //TODO: Get From local storage
            var urlInfo = {
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
                    //refreshTokenService.refreshToken()


                } else {
                    console.log(" Token not refreshable Status ", rejection.status, rejection.data.error);
                }
                return $q.reject(rejection);

            };

            return this;

        }]);
})();