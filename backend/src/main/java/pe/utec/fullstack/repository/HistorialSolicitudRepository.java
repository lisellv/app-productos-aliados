package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.HistorialSolicitud;


import java.util.List;
import java.util.Optional;

@Repository
public class HistorialSolicitudRepository {

    private final HistorialSolicitudJpaRepository historialSolicitudJpaRepository;
    private final PersistenceMapper mapper;

    public HistorialSolicitudRepository(HistorialSolicitudJpaRepository historialSolicitudJpaRepository,
                                                 PersistenceMapper mapper) {
        this.historialSolicitudJpaRepository = historialSolicitudJpaRepository;
        this.mapper = mapper;
    }
    public HistorialSolicitud guardar(HistorialSolicitud historial) {
        return this.mapper.toDomain(
                this.historialSolicitudJpaRepository.saveAndFlush(this.mapper.toEntity(historial))
        );
    }
    public Optional<HistorialSolicitud> buscarPorId(Integer id) {
        return this.historialSolicitudJpaRepository.findById(id).map(this.mapper::toDomain);
    }
    public List<HistorialSolicitud> listarActivos() {
        return this.historialSolicitudJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
    public List<HistorialSolicitud> listarPorSolicitud(Integer solicitudId) {
        return this.historialSolicitudJpaRepository.findBySolicitudIdOrderByCreadoAtDesc(solicitudId).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
