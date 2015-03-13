/*
 * Copyright (c) 2015.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Created by mohana on 10/03/2015.
 */
"use strict";

describe("Test OAuth2Provider Module", function () {
    var $httpProvider;
    beforeEach(module("OAuth2Provider", function (_$httpProvider_) {
        $httpProvider = _$httpProvider_;

    }));

    describe("Test AuthInfoService Factory", function () {
        var authInfoService;
        beforeEach(inject(function (_authInfoService_) {
            authInfoService = _authInfoService_;

        }));


        it("expect AuthInfoService to be defined", function () {
            expect(authInfoService).toBeDefined();
        });

        it("expect hasToken to be Falsy when not set", function () {
            expect(authInfoService.hasAccessToken()).toBeFalsy();
        });

        it("expect hasToken to be Falsy when not set", function () {
            var authInfo = {};
            authInfo.accessToken = "TEST TOKEN";
            authInfoService.setAuthInfo(authInfo);
            expect(authInfoService.hasAccessToken()).toBeTruthy();
        });
    });

    describe("Test bearerTokenInterceptor", function () {
        var bearerTokenInterceptor;
        var authInfoService;
        var $httpBackend;
        var $http;
        var TEST_URL = "http:/test.com";
        var TEST_TOKEN = "TEST_TOKEN";

        beforeEach(inject(function (_authInfoService_, _$httpBackend_, _$http_, _bearerTokenInterceptor_) {
            authInfoService = _authInfoService_;
            bearerTokenInterceptor = _bearerTokenInterceptor_;
            $httpBackend = _$httpBackend_;
            $http = _$http_;

        }));

        it("Expect BearerToken Interceptor to be initialise", function () {
            expect(bearerTokenInterceptor).toBeDefined();

        });

        it("Expect httpProvider to be initialised", function () {
            expect($httpProvider).toBeDefined();
            expect($httpBackend).toBeDefined();
        });

        it("Expect httpProvider to contain Bearer Token Interceptor", function () {
            expect($httpProvider.interceptors).not.toBeNull();
            expect($httpProvider.interceptors).toContain("bearerTokenInterceptor");
        });


        function setUpToken() {
            var authInfo = {};
            authInfo.accessToken = "TEST_TOKEN";
            authInfoService.setAuthInfo(authInfo);
        }


        it("given a accessToken bearerTokenInterceptor should set token header", function () {
            setUpToken();
            var config = {headers: {}};
            bearerTokenInterceptor.request(config);
            expect(config.headers.Authorization).toContain(TEST_TOKEN);
        });

        it("given no accessToken bearerTokenInterceptor should not set token header", function () {
            var config = {headers: {}};
            bearerTokenInterceptor.request(config);
            expect(config.headers.Authorization).toBeUndefined();
        });
        it("given no header with access token bearerTokenInterceptor should throw", function () {
            setUpToken();
            expect(function () {
                bearerTokenInterceptor.request({});
            }).toThrow();
        });

        it("given accessToken and a valid request url bearerTokenInterceptor should set the token in header ", function () {
            setUpToken();
            $httpBackend.whenGET(TEST_URL).respond(200, "OK");
            $http.get(TEST_URL).success(function (data, status, headers, config) {
                expect(config.headers).toBeDefined();
                expect(config.headers.Authorization).toBeDefined();
                expect(config.headers.Authorization).toContain(TEST_TOKEN);

            });
            $httpBackend.flush();
        });

    });

    describe("Test refreshTokenInterceptor",function(){
        var authInfoService;
        var refreshTokenInterceptor;

        beforeEach(inject(function(_authInfoService_,_refreshTokenInterceptor_){
            authInfoService = _authInfoService_;
            refreshTokenInterceptor =_refreshTokenInterceptor_;
        }));

        function setUpRefreshToken() {
            var authInfo = {};
            authInfo.refreshToken = "TEST_TOKEN";
            authInfoService.setAuthInfo(authInfo);
        }

        function setUpErrorMsg(){
            return {"error":"unauthorized"};
        }

        it("Test initialisation",function(){
            expect(authInfoService).toBeDefined();
            expect(refreshTokenInterceptor).toBeDefined();

        });

        it("Expect httpProvider to contain Refresh Token Interceptor", function () {
            expect($httpProvider.interceptors).not.toBeNull();
            expect($httpProvider.interceptors).toContain("refreshTokenInterceptor");
        });
        it("given null/undefined value isTokenRefreshable should return falsy ",function(){

            expect(refreshTokenInterceptor.isTokenRefreshable(null,null)).toBeFalsy();
            expect(refreshTokenInterceptor.isTokenRefreshable(undefined,undefined)).toBeFalsy();

        });
        it("given refresh token and 200 status isTokenRefreshable should be falsy",function(){
            setUpRefreshToken();
            expect(refreshTokenInterceptor.isTokenRefreshable(200,setUpErrorMsg())).toBeFalsy();
        });

        it("given refresh token and 401 status isTokenRefreshable should be truthy",function(){
            setUpRefreshToken();
            expect(refreshTokenInterceptor.isTokenRefreshable(401,setUpErrorMsg())).toBeTruthy();
        });
    });

});