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
     *  Our implementation will use $rootScope to store
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
        this.toString = function () {
            return "accessToken:" + _authInfo.accessToken +
                "isLoggedIn :" + _authInfo.isLoggedIn +
                "refreshToken:" + _authInfo.refreshToken +
                "expires:" + _authInfo.expires +
                "scope:" + _authInfo.scope;
        };
        return this;
    });

    authProvider.run(["$rootScope", "authInfoService", "OAUTH_CONSTANT", "$log", function ($rootScope, authInfoService,
                                                                                           OAUTH_CONSTANT, $log) {

        $rootScope.$on(OAUTH_CONSTANT.EVENTS.LOGIN_CONFIRMED, function (event, data) {
            $log.log(data.accessToken);
            authInfoService.setAuthInfo(data);
            authInfoService.getAuthInfo().isLoggedIn = true;
            $log.log(authInfoService.toString());
        });

    }]);
})();