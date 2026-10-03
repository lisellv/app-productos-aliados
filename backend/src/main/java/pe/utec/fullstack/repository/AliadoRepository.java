package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.Aliado;


import java.util.List;
import java.util.Optional;

@Repository
public class AliadoRepository {

    private final AliadoJpaRepository aliadoJpaRepository;
    private final PersistenceMapper mapper;

    public AliadoRepository(AliadoJpaRepository aliadoJpaRepository, PersistenceMapper mapper) {
        this.aliadoJpaRepository = aliadoJpaRepository;
        this.mapper = mapper;
    }
    public Aliado guardar(Aliado aliado) {
        return this.mapper.toDomain(
                this.aliadoJpaRepository.saveAndFlush(this.mapper.toEntity(aliado))
        );
    }
    public Optional<Aliado> buscarPorId(Integer id) {
        return this.aliadoJpaRepository.findById(id).map(this.mapper::toDomain);
    }
    public List<Aliado> listarActivos() {
        return this.aliadoJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
