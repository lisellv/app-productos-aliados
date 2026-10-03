package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.DerivacionBanco;


import java.util.List;
import java.util.Optional;

@Repository
public class DerivacionBancoRepository {

    private final DerivacionBancoJpaRepository derivacionBancoJpaRepository;
    private final PersistenceMapper mapper;

    public DerivacionBancoRepository(DerivacionBancoJpaRepository derivacionBancoJpaRepository,
                                              PersistenceMapper mapper) {
        this.derivacionBancoJpaRepository = derivacionBancoJpaRepository;
        this.mapper = mapper;
    }
    public DerivacionBanco guardar(DerivacionBanco derivacionBanco) {
        return this.mapper.toDomain(
                this.derivacionBancoJpaRepository.saveAndFlush(this.mapper.toEntity(derivacionBanco))
        );
    }
    public Optional<DerivacionBanco> buscarPorId(Integer id) {
        return this.derivacionBancoJpaRepository.findById(id).map(this.mapper::toDomain);
    }
    public List<DerivacionBanco> listarActivos() {
        return this.derivacionBancoJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
    public boolean existePorSolicitud(Integer solicitudId) {
        return this.derivacionBancoJpaRepository.existsBySolicitudId(solicitudId);
    }
}
