package pe.utec.fullstack.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService servicioJwt;

    @Override
    protected void doFilterInternal(HttpServletRequest solicitud, HttpServletResponse respuesta,
            FilterChain cadenaFiltros)
            throws ServletException, IOException {

        final String cabeceraAutorizacion = solicitud.getHeader("Authorization");

        String nombreUsuario = null;
        String tokenJwt = null;

        if (cabeceraAutorizacion != null && cabeceraAutorizacion.startsWith("Bearer ")) {
            tokenJwt = cabeceraAutorizacion.substring(7);
            try {
                nombreUsuario = servicioJwt.extractUsername(tokenJwt);
            } catch (JwtException | IllegalArgumentException errorJwt) {
                SecurityContextHolder.clearContext();
            }
        }

        if (nombreUsuario != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            if (servicioJwt.validateToken(tokenJwt)) {

                UsernamePasswordAuthenticationToken tokenAutenticacion = new UsernamePasswordAuthenticationToken(
                        servicioJwt.extractUserDetails(tokenJwt), null, servicioJwt.extractRoles(tokenJwt));
                tokenAutenticacion
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(solicitud));
                SecurityContextHolder.getContext().setAuthentication(tokenAutenticacion);
            }
        }
        cadenaFiltros.doFilter(solicitud, respuesta);
    }
}
