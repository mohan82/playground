/*
 * Copyright: Copyright (c) 2015
 * Company: The Roads and Traffic Authority, New South Wales
 * Last Modified By: $Author: $
 * Version: $Id: $
 */
package org.test.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;

@Configuration
@EnableAuthorizationServer
@EnableWebSecurity
public class WebConfig extends AuthorizationServerConfigurerAdapter {

    @Bean
    @Autowired
    public AuthenticationManager createAuthenticationManager( AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder
                .inMemoryAuthentication().withUser("test")
                .password("test").roles("USER").and()
                .withUser("admin").roles("USER", "ADMIN");
        return authenticationManagerBuilder.build();
    }

    @Override
    public void configure(final AuthorizationServerSecurityConfigurer security) throws Exception {
        super.configure(security);
    }

    @Override
    public void configure(final ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory().withClient("test")
                .authorizedGrantTypes("password");
    }

    @Override
    public void configure(final AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        //endpoints.authenticationManager(createAuthenticationManager());
    }
}
