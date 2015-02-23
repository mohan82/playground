/*
 * Copyright (c) 2015.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
"use strict";

var authProvider = angular.module('OAuth2Provider', []);
/****
 *  Our implementation will use $rootScope to store
 *  client auth info and use events to interact
 *  with  client modules
 */
authProvider.constant('OAUTH_CONSTANT', {});


authProvider.run(["$rootScope", function ($rootScope) {
    $rootScope.user = $rootScope.user || {};
    $rootScope.user.oauthInfo = {
        accessToken: "access",
        isLoggedIn: false,
        refreshToken: "refresh"
    };

}]);