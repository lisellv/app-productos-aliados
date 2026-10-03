package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.Usuario;


import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioRepository {

    private final UsuarioJpaRepository usuarioJpaRepository;
    private final PersistenceMapper mapper;

    public UsuarioRepository(UsuarioJpaRepository usuarioJpaRepository, PersistenceMapper mapper) {
        this.usuarioJpaRepository = usuarioJpaRepository;
        this.mapper = mapper;
    }
    public Usuario guardar(Usuario usuario) {
        return this.mapper.toDomain(
                this.usuarioJpaRepository.saveAndFlush(this.mapper.toEntity(usuario))
        );
    }
    public Optional<Usuario> buscarPorId(Integer id) {
        return this.usuarioJpaRepository.findById(id).map(this.mapper::toDomain);
    }
    public List<Usuario> listarActivos() {
        return this.usuarioJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
