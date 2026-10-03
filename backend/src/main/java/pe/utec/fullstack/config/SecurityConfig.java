package pe.utec.fullstack.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import pe.utec.fullstack.controller.auth.UsuarioDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private UsuarioDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/actuator/health/**").permitAll()

                    .requestMatchers(
                        "/swagger", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**",
                        "/v3/api-docs.yaml").permitAll()
                        .requestMatchers(
                                "/api/roles/**", "/api/usuarios/**", "/api/aliados/**", "/api/clientes/**",
                                "/api/categorias/**", "/api/productos/**", "/api/tipos-financiamiento/**",
                                "/api/productos-financiamiento/**", "/api/campanas/**",
                                "/api/solicitudes-financiamiento/**",
                                "/api/campana-producto/**", "/api/reglas-precalificacion/**", "/api/lista-interes/**",
                                "/api/historial-solicitud/**", "/api/derivacion-banco/**")
                        .hasAuthority("ROLE_ADMIN")
                        /*
                         * .requestMatchers("/persons/**").hasAuthority("ROLE_PERSONS")
                         * .requestMatchers("/me/**").hasAuthority("ROLE_ADMIN")
                         */
                        .anyRequest().denyAll())
                .authenticationProvider(authenticationProvider())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:[*]", "http://127.0.0.1:[*]"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(encoder);
        return provider;
    }
}
