package pe.utec.fullstack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import pe.utec.fullstack.config.JwtService;
import pe.utec.fullstack.controller.request.AuthRequest;
import pe.utec.fullstack.controller.request.AuthResponse;
import pe.utec.fullstack.controller.request.RegistroUsuarioRequest;
import pe.utec.fullstack.domain.UsuarioService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void registrarUsuario(@Valid @RequestBody RegistroUsuarioRequest request) {
        this.usuarioService.registrarUsuario(request.getCorreoElectronico(), request.getPassword());
    }

    @PostMapping("/login")
    public AuthResponse authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUserName(), authRequest.getPassword()));
        if (authentication.isAuthenticated()) {
            return new AuthResponse(
                    jwtService.generateSpecialToken(authRequest.getUserName(), authentication));
        } else {
            throw new UsernameNotFoundException("La solicitud de usuario no es válida.");
        }
    }
}
