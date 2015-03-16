/*
 * Copyright (c) 2015.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

"use strict";

module.exports = function (grunt) {

    var SOURCE_DIR = ['app/js/**/*.js'];
    var TEST_DIR = ['tests/**/*.js', '!tests/karma.conf.js'];

    /*global require */
    require('load-grunt-tasks')(grunt);


    /**
     * Scannable folders for linting
     * @returns {*[]}
     */
    function lintableFolders() {
        return ['Gruntfile.js', SOURCE_DIR, TEST_DIR, '!app/js/lib/**/*.js'];

    }

    function jshint() {
        return {
            options: {
                "jshintrc": ".jshintrc"
            },
            files: {
                src: lintableFolders()
            }
        };
    }


    function karma() {
        return {
            options: {
                configFile: "tests/karma.conf.js"
            },
            unit: {
                port: 9019,
                background: true
            },
            continuous: {
                singleRun: true
            }
        };

    }

    function useMinPrepare() {
        return {
            html: "app/index.html",
            options: {
                dest: "dist/"
            }
        };

    }

    function useMin() {
        return {
            html: "dist/index.html"
        };
    }

    function copyIndex() {
        return {
            copyIndex: {
                files: [
                    {
                        expand: 'true',
                        cwd: "app",
                        src: '**',
                        dest: 'dist/'
                    }
                ]
            }
        };
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: jshint(),
        karma: karma(),
        useminPrepare: useMinPrepare(),
        watch: {
            files: lintableFolders(),
            tasks: ["jshint", "karma"]
        },
        usemin: useMin(),
        copy: copyIndex()
    });
    grunt.registerTask("package", "Prepares the concat/uglified package " +
    "with updated index.html", ["copy:copyIndex",
        "useminPrepare",
        "concat", "uglify", "cssmin", "usemin"]);
};