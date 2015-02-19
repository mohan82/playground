/*
 * Copyright (c) 2015.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package org.test.controller;

import java.io.Serializable;

import com.google.common.base.Objects;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/hello")
public class HelloWorldController {

    @RequestMapping(value = "/world")
    @ResponseBody
    public Hello hello() throws Exception {
      return  new Hello("Hello World","hw");
    }

    public static class Hello implements Serializable {

        private String text;
        private String code;

        public Hello(final String text, final String code) {
            this.text = text;
            this.code = code;
        }

        public String getText() {
            return text;
        }

        public void setText(final String text) {
            this.text = text;
        }

        public String getCode() {
            return code;
        }

        public void setCode(final String code) {
            this.code = code;
        }

        @Override
        public int hashCode() {
            return Objects.hashCode(text, code);
        }

        @Override
        public boolean equals(final Object obj) {
            if (this == obj) {
                return true;
            }
            if (obj == null || getClass() != obj.getClass()) {
                return false;
            }
            final Hello other = (Hello) obj;
            return Objects.equal(this.text, other.text)
                    && Objects.equal(this.code, other.code);
        }

        @Override
        public String toString() {
            return Objects.toStringHelper(this)
                    .add("text", text)
                    .add("code", code)
                    .toString();
        }
    }

}
