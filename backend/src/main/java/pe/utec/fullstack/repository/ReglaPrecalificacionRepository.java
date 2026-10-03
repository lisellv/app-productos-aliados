package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.ReglaPrecalificacion;


import java.util.List;
import java.util.Optional;

@Repository
public class ReglaPrecalificacionRepository {

    private final ReglaPrecalificacionJpaRepository reglaPrecalificacionJpaRepository;
    private final PersistenceMapper mapper;

    public ReglaPrecalificacionRepository(ReglaPrecalificacionJpaRepository reglaPrecalificacionJpaRepository,
                                                   PersistenceMapper mapper) {
        this.reglaPrecalificacionJpaRepository = reglaPrecalificacionJpaRepository;
        this.mapper = mapper;
    }
    public ReglaPrecalificacion guardar(ReglaPrecalificacion regla) {
        return this.mapper.toDomain(
                this.reglaPrecalificacionJpaRepository.saveAndFlush(this.mapper.toEntity(regla))
        );
    }
    public Optional<ReglaPrecalificacion> buscarPorId(Integer id) {
        return this.reglaPrecalificacionJpaRepository.findById(id).map(this.mapper::toDomain);
    }
    public List<ReglaPrecalificacion> listarActivas() {
        return this.reglaPrecalificacionJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
