package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.Rol;


import java.util.List;
import java.util.Optional;

@Repository
public class RolRepository {

    private final RolJpaRepository rolJpaRepository;
    private final PersistenceMapper mapper;

    public RolRepository(RolJpaRepository rolJpaRepository, PersistenceMapper mapper) {
        this.rolJpaRepository = rolJpaRepository;
        this.mapper = mapper;
    }
    public Rol guardar(Rol rol) {
        return this.mapper.toDomain(
                this.rolJpaRepository.saveAndFlush(this.mapper.toEntity(rol))
        );
    }
    public Optional<Rol> buscarPorId(Integer id) {
        return this.rolJpaRepository.findById(id).map(this.mapper::toDomain);
    }
    public List<Rol> listarActivos() {
        return this.rolJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
