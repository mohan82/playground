/*
 * Copyright (c) 2015.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
"use strict";

module.exports = function(config){
    config.set({

        basePath : './',

        files : [
            '../app/bower_components/angular/angular.js',
            '../app/bower_components/angular-route/angular-route.js',
            '../app/bower_components/angular-mocks/angular-mocks.js',
            '../app/js/**/*.js' ,
            //test directory
            'app/*.js'
        ],

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['Chrome'],

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
        ],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};