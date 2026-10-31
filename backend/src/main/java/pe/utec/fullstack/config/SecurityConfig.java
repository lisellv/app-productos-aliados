package pe.utec.fullstack.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

        @Value("${app.cors.allowed-origin-patterns}")
        private String allowedOriginPatterns;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers("/actuator/health/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/productos", "/api/productos/**",
                                                                "/api/categorias", "/api/categorias/**",
                                                                "/api/categories", "/api/categories/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/aliados/catalogo").permitAll()
                                                .requestMatchers("/api/aliados/mi-perfil/**")
                                                .hasAuthority("ROLE_ALIADO")
                                                .requestMatchers(HttpMethod.GET, "/api/clientes/mi-perfil")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.GET, "/api/productos-financiamiento/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/clientes/registro").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/solicitudes-financiamiento")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/solicitudes-financiamiento")
                                                .authenticated()
                                                .requestMatchers("/api/cart", "/api/cart/**")
                                                .hasAnyAuthority("ROLE_USER", "ROLE_USUARIO")
                                                .requestMatchers(HttpMethod.GET, "/api/orders/my")
                                                .hasAnyAuthority("ROLE_USER", "ROLE_USUARIO")
                                                .requestMatchers(HttpMethod.POST, "/api/orders")
                                                .hasAnyAuthority("ROLE_USER", "ROLE_USUARIO")
                                                .requestMatchers("/api/orders", "/api/orders/**")
                                                .hasAuthority("ROLE_ADMIN")

                                                .requestMatchers(
                                                                "/swagger", "/swagger-ui.html", "/swagger-ui/**",
                                                                "/v3/api-docs/**",
                                                                "/v3/api-docs.yaml")
                                                .permitAll()
                                                .requestMatchers(
                                                                "/api/roles/**", "/api/usuarios/**", "/api/aliados/**",
                                                                "/api/clientes/**",
                                                                "/api/categorias/**", "/api/productos/**",
                                                                "/api/tipos-financiamiento/**",
                                                                "/api/productos-financiamiento/**", "/api/campanas/**",
                                                                "/api/solicitudes-financiamiento/**",
                                                                "/api/campana-producto/**",
                                                                "/api/reglas-precalificacion/**",
                                                                "/api/lista-interes/**",
                                                                "/api/historial-solicitud/**",
                                                                "/api/derivacion-banco/**",
                                                                "/api/categories/**", "/api/users", "/api/users/**")
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
                configuration.setAllowedOriginPatterns(Arrays.stream(allowedOriginPatterns.split(";"))
                                .map(String::trim)
                                .filter(origen -> !origen.isEmpty())
                                .toList());
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
