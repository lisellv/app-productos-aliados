package pe.utec.fullstack.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.controller.auth.UserInfoDetails;

import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {

    public static final String SECRET = "5367566859703373367639792F423F452848284D6251655468576D5A71347437";

    public String generateToken(String username) { // Use email as username
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    public String generateSpecialToken(String username, Authentication authentication) {
        Map<String, Object> claims = new HashMap<>();

        UserInfoDetails auth = (UserInfoDetails) authentication.getPrincipal();
        claims.put("id", auth.getId());
        claims.put("roles", authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.joining(",")));

        return createToken(claims, username);

    }

    private String createToken(Map<String, Object> claims, String username) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public Boolean validateToken(String token) {
        final String username = extractUsername(token);
        return username != null;
    }

    public String refreshToken(String jwt) {
        Claims old = Jwts.parser()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(jwt)
                .getBody();

        return Jwts.builder()
                .setClaims(old)
                .setSubject(old.getSubject())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Collection<? extends GrantedAuthority> extractRoles(String token) {
        Claims claims = extractAllClaims(token);

        String roles = claims.get("roles", String.class);
        if (roles == null || roles.isBlank()) {
            return List.of();
        }
        return Arrays.stream(roles.split(","))
                .filter(role -> !role.isBlank())
                .map(org.springframework.security.core.authority.SimpleGrantedAuthority::new)
                .toList();
    }

    public UserInfoDetails extractUserDetails(String token) {
        Claims claims = extractAllClaims(token);

        return new UserInfoDetails(
                claims.get("id", Integer.class),
                claims.getSubject(),
                null,
                extractRoles(token));
    }
}
