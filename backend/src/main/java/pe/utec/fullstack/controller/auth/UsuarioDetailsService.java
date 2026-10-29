package pe.utec.fullstack.controller.auth;

import java.util.List;
import java.util.Locale;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import pe.utec.fullstack.repository.RepositorioDatosRol;
import pe.utec.fullstack.repository.RepositorioDatosUsuario;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final RepositorioDatosUsuario usuarioRepository;
    private final RepositorioDatosRol rolRepository;

    public UsuarioDetailsService(RepositorioDatosUsuario usuarioRepository, RepositorioDatosRol rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String correoElectronico) throws UsernameNotFoundException {
        var usuario = usuarioRepository.findByCorreoElectronicoAndAltaAndActivo(
                correoElectronico, (short) 1, true)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        var rol = rolRepository.findByIdAndAlta(usuario.getRolId(), (short) 1)
                .orElseThrow(() -> new UsernameNotFoundException("Rol de usuario no encontrado"));
        String nombreRol = rol.getNombreRol().toUpperCase(Locale.ROOT);
        if ("ADMINISTRADOR".equals(nombreRol)) {
            nombreRol = "ADMIN";
        }

        return new UserInfoDetails(
                usuario.getId(),
                usuario.getCorreoElectronico(),
                usuario.getPasswordHash(),
                List.of(new SimpleGrantedAuthority("ROLE_" + nombreRol)));
    }
}
