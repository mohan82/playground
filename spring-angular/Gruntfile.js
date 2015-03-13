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

    function concat() {
        return {
            build: {
                src: SOURCE_DIR,
                dest: "build/<%=pkg.name %>.js"
            }
        };
    }

    function uglify() {
        return {
            compress: {
                src: "<%=concat.build.dest%>",
                dest: "build/<%=pkg.name %>.min.js",
                drop_console: true
            },
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap: true,
                sourceMapName: "build/<%pkg.name %>.sourcemap.map",
                mangle: true
            }

        };
    }


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: jshint(),
        concat: concat(),
        uglify: uglify(),
        watch: {
            files: lintableFolders(),
            tasks: ["jshint", "concat", "uglify"]
        }
    });
};