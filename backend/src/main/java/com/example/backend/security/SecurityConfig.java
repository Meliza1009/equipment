package com.example.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .ignoringRequestMatchers(new AntPathRequestMatcher("/h2-console/**")) // Disable CSRF for H2 console
                .disable()
            )
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin()) // Allow H2 console frames
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no authentication required
                .requestMatchers(new AntPathRequestMatcher("/auth/login")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/auth/register")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll() // Allow H2 console access
                .requestMatchers(new AntPathRequestMatcher("/health")).permitAll() // Allow health check
                
                // Equipment endpoints - require authentication for reads and authenticated write
                // Previously GET was permitted to all; change to authenticated so equipment
                // details are only available to signed-in users.
                .requestMatchers(new AntPathRequestMatcher("/equipment", "GET")).authenticated()
                .requestMatchers(new AntPathRequestMatcher("/equipment/**", "GET")).authenticated()
                // Protect QR scan and QR code endpoints as they can expose equipment details
                .requestMatchers(new AntPathRequestMatcher("/api/qr-scan/**")).authenticated()
                .requestMatchers(new AntPathRequestMatcher("/qr/**")).authenticated()
                .requestMatchers(new AntPathRequestMatcher("/equipment", "POST")).hasAnyRole("OPERATOR", "ADMIN")
                .requestMatchers(new AntPathRequestMatcher("/equipment/**", "POST")).hasAnyRole("OPERATOR", "ADMIN")
                .requestMatchers(new AntPathRequestMatcher("/equipment/**", "PUT")).hasAnyRole("OPERATOR", "ADMIN")
                .requestMatchers(new AntPathRequestMatcher("/equipment/**", "DELETE")).hasAnyRole("OPERATOR", "ADMIN")
                .requestMatchers(new AntPathRequestMatcher("/equipment/**", "PATCH")).hasAnyRole("OPERATOR", "ADMIN")
                
                // Admin endpoints - admin only
                .requestMatchers(new AntPathRequestMatcher("/admin/**")).hasRole("ADMIN")
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5174"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
