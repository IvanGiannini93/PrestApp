package com.prestapp.infrastructure.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuración de Spring Security.
 * <p>
 * Define las reglas de acceso a los endpoints, configura la autenticación
 * stateless con JWT y registra el filtro de autenticación.
 * </p>
 *
 * @author PrestApp Team
 * @version 1.0.0
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Configura la cadena de filtros de seguridad.
     *
     * @param http configurador de seguridad HTTP
     * @return cadena de filtros configurada
     * @throws Exception si ocurre un error de configuración
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/login").permitAll()
                        .requestMatchers("/api/v1/auth/cambiar-password").authenticated()
                        .requestMatchers("/api/v1/clientes/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/prestamos/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/cuotas/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/reportes/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/mi-prestamo/**").hasRole("CLIENTE")
                        .requestMatchers("/api/v1/mis-cuotas/**").hasRole("CLIENTE")
                        .requestMatchers("/api/v1/mi-historial/**").hasRole("CLIENTE")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Bean de codificación de contraseñas con BCrypt.
     *
     * @return encoder BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
