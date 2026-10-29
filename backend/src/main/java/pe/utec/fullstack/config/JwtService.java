package pe.utec.fullstack.config;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import pe.utec.fullstack.controller.auth.UserInfoDetails;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretoJwt;

    public String generateToken(String nombreUsuario) {
        Map<String, Object> afirmaciones = new HashMap<>();
        return createToken(afirmaciones, nombreUsuario);
    }

    public String generateSpecialToken(String nombreUsuario, Authentication autenticacion) {
        Map<String, Object> afirmaciones = new HashMap<>();

        UserInfoDetails usuarioAutenticado = (UserInfoDetails) autenticacion.getPrincipal();
        afirmaciones.put("id", usuarioAutenticado.getId());
        afirmaciones.put("roles", autenticacion.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.joining(",")));

        return createToken(afirmaciones, nombreUsuario);

    }

    private String createToken(Map<String, Object> afirmaciones, String nombreUsuario) {
        return Jwts.builder()
                .setClaims(afirmaciones)
                .setSubject(nombreUsuario)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        byte[] bytesClave = Decoders.BASE64.decode(secretoJwt);
        return Keys.hmacShaKeyFor(bytesClave);
    }

    public String extractUsername(String tokenJwt) {
        return extractClaim(tokenJwt, Claims::getSubject);
    }

    public Date extractExpiration(String tokenJwt) {
        return extractClaim(tokenJwt, Claims::getExpiration);
    }

    public <T> T extractClaim(String tokenJwt, Function<Claims, T> resolverAfirmacion) {
        final Claims afirmaciones = extractAllClaims(tokenJwt);
        return resolverAfirmacion.apply(afirmaciones);
    }

    private Claims extractAllClaims(String tokenJwt) {
        return Jwts.parser()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(tokenJwt)
                .getBody();
    }

    private Boolean isTokenExpired(String tokenJwt) {
        return extractExpiration(tokenJwt).before(new Date());
    }

    public Boolean validateToken(String tokenJwt, UserDetails detallesUsuario) {
        final String nombreUsuario = extractUsername(tokenJwt);
        return (nombreUsuario.equals(detallesUsuario.getUsername()) && !isTokenExpired(tokenJwt));
    }

    public Boolean validateToken(String tokenJwt) {
        final String nombreUsuario = extractUsername(tokenJwt);
        return nombreUsuario != null;
    }

    public String refreshToken(String tokenJwt) {
        Claims afirmacionesAnteriores = Jwts.parser()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(tokenJwt)
                .getBody();

        return Jwts.builder()
                .setClaims(afirmacionesAnteriores)
                .setSubject(afirmacionesAnteriores.getSubject())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Collection<? extends GrantedAuthority> extractRoles(String tokenJwt) {
        Claims afirmaciones = extractAllClaims(tokenJwt);

        String nombresRoles = afirmaciones.get("roles", String.class);
        if (nombresRoles == null || nombresRoles.isBlank()) {
            return List.of();
        }
        return Arrays.stream(nombresRoles.split(","))
                .filter(nombreRol -> !nombreRol.isBlank())
                .map(org.springframework.security.core.authority.SimpleGrantedAuthority::new)
                .toList();
    }

    public UserInfoDetails extractUserDetails(String tokenJwt) {
        Claims afirmaciones = extractAllClaims(tokenJwt);

        return new UserInfoDetails(
                afirmaciones.get("id", Integer.class),
                afirmaciones.getSubject(),
                null,
                extractRoles(tokenJwt));
    }
}
