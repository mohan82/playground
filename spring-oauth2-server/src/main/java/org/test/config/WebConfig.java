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
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebMvc
@EnableWebSecurity
public class WebConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .inMemoryAuthentication()
                .withUser("user").password("password").roles("USER");
    }

    /**
     * Spring does expose default authentication manager for some
     * reason we have to expose ourself
     * @return
     * @throws Exception
     */
    @Bean(name = "authenticationManager")
    public AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    @Configuration
    @EnableAuthorizationServer
    public static class OAuthConfig extends AuthorizationServerConfigurerAdapter {



        private AuthenticationManager authenticationManager;
        @Autowired
        public  void init(AuthenticationManager authenticationManager){

             this.authenticationManager =authenticationManager;
        }

        @Override
        public void configure(final AuthorizationServerSecurityConfigurer security) throws Exception {
            super.configure(security);
        }

        @Override
        public void configure(final ClientDetailsServiceConfigurer clients) throws Exception {
            clients.inMemory().withClient("test").secret("secret")
                    .authorizedGrantTypes("password").scopes("read","write");
        }

        @Override
        public void configure(final AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
            endpoints.authenticationManager(authenticationManager);
        }
    }
}
