/*
 * Copyright (c) 2015.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

"use strict";
var fs = require("fs");

module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                "jshintrc": ".jshintrc"
            },
            files: {
                src: ['Gruntfile.js', 'app/js/**/*.js', 'tests/**/*.js',
                    //ignored  lib and karma conf
                    '!app/js/lib/**/*.js', '!tests/karma.conf.js']
            }
        }
    });
    grunt.registerTask("default", function () {
        var message = 'Deployment on ' + new Date();
        fs.appendFileSync('deploy.log', message + '\n');
        grunt.log.writeln('Appended "' + message + '"');
    });
    grunt.registerMultiTask("dumpfile", function () {

    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
};