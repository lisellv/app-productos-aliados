package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.Usuario;


import pe.utec.fullstack.repository.UsuarioRepository;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
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
