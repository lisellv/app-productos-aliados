package pe.utec.fullstack.domain;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import pe.utec.fullstack.domain.business.Rol;
import pe.utec.fullstack.domain.business.Usuario;
import pe.utec.fullstack.repository.RolRepository;
import pe.utec.fullstack.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, RolRepository rolRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario crear(Usuario usuario, String passwordPlano) {
        usuario.setPasswordHash(this.passwordEncoder.encode(passwordPlano));
        usuario.setActivo(true);
        usuario.setAlta((short) 1);
        usuario.setCreadoAt(OffsetDateTime.now());
        usuario.setActualizadoAt(OffsetDateTime.now());
        return this.usuarioRepository.guardar(usuario);
    }

    public Usuario registrarUsuario(String correoElectronico, String passwordPlano) {
        String correoNormalizado = correoElectronico.trim().toLowerCase(Locale.ROOT);
        if (this.usuarioRepository.existePorCorreo(correoNormalizado)) {
            throw new IllegalArgumentException("Este correo ya tiene una cuenta.");
        }
        Rol rolUsuario = this.rolRepository.listarActivos().stream()
                .filter(rol -> "usuario".equalsIgnoreCase(rol.getNombreRol()))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("El rol de usuario no está configurado."));
        Usuario usuario = Usuario.builder()
                .rolId(rolUsuario.getId())
                .aliadoId(null)
                .correoElectronico(correoNormalizado)
                .build();
        return this.crear(usuario, passwordPlano);
    }

    public Usuario obtenerPorId(Integer id) {
        return this.usuarioRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + id));
    }

    public List<Usuario> listar() {
        return this.usuarioRepository.listarActivos();
    }

    public Usuario actualizar(Integer id, Usuario usuario, String nuevaPasswordPlano) {
        Usuario existente = this.obtenerPorId(id);
        existente.setRolId(usuario.getRolId());
        existente.setAliadoId(usuario.getAliadoId());
        existente.setCorreoElectronico(usuario.getCorreoElectronico());
        if (usuario.getActivo() != null) {
            existente.setActivo(usuario.getActivo());
        }
        if (nuevaPasswordPlano != null && !nuevaPasswordPlano.isBlank()) {
            existente.setPasswordHash(this.passwordEncoder.encode(nuevaPasswordPlano));
        }
        existente.setActualizadoAt(OffsetDateTime.now());
        return this.usuarioRepository.guardar(existente);
    }

    public void eliminar(Integer id) {
        Usuario existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        existente.setActivo(false);
        existente.setActualizadoAt(OffsetDateTime.now());
        this.usuarioRepository.guardar(existente);
    }
}
