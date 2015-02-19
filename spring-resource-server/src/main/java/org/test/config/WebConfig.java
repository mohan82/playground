/*
 * Copyright (c) 2015.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
package org.test.config;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
@EnableWebMvc
public class WebConfig extends WebMvcConfigurerAdapter {

    @Override
    public void configureMessageConverters(final List<HttpMessageConverter<?>> converters) {
        MappingJackson2HttpMessageConverter converter =new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(new ObjectMapper());
        converters.add(converter);
    }
}
