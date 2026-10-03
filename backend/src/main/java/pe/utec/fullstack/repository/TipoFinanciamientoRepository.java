package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.TipoFinanciamiento;


import java.util.List;
import java.util.Optional;

@Repository
public class TipoFinanciamientoRepository {

    private final TipoFinanciamientoJpaRepository tipoFinanciamientoJpaRepository;
    private final PersistenceMapper mapper;

    public TipoFinanciamientoRepository(TipoFinanciamientoJpaRepository tipoFinanciamientoJpaRepository,
                                                 PersistenceMapper mapper) {
        this.tipoFinanciamientoJpaRepository = tipoFinanciamientoJpaRepository;
        this.mapper = mapper;
    }
    public TipoFinanciamiento guardar(TipoFinanciamiento tipoFinanciamiento) {
        return this.mapper.toDomain(
                this.tipoFinanciamientoJpaRepository.saveAndFlush(this.mapper.toEntity(tipoFinanciamiento))
        );
    }
    public Optional<TipoFinanciamiento> buscarPorId(Integer id) {
        return this.tipoFinanciamientoJpaRepository.findById(id).map(this.mapper::toDomain);
    }
    public List<TipoFinanciamiento> listarActivos() {
        return this.tipoFinanciamientoJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
