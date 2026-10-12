package pe.utec.fullstack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import pe.utec.fullstack.domain.business.SolicitudFinanciamiento;

@Repository
public class SolicitudFinanciamientoRepository {

    private final SolicitudFinanciamientoJpaRepository solicitudFinanciamientoJpaRepository;
    private final PersistenceMapper mapper;

    public SolicitudFinanciamientoRepository(SolicitudFinanciamientoJpaRepository solicitudFinanciamientoJpaRepository,
            PersistenceMapper mapper) {
        this.solicitudFinanciamientoJpaRepository = solicitudFinanciamientoJpaRepository;
        this.mapper = mapper;
    }

    public SolicitudFinanciamiento guardar(SolicitudFinanciamiento solicitud) {
        return this.mapper.toDomain(
                this.solicitudFinanciamientoJpaRepository.saveAndFlush(this.mapper.toEntity(solicitud)));
    }

    public Optional<SolicitudFinanciamiento> buscarPorId(Integer id) {
        return this.solicitudFinanciamientoJpaRepository.findById(id).map(this.mapper::toDomain);
    }

    public List<SolicitudFinanciamiento> listarActivas() {
        return this.solicitudFinanciamientoJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }

    public List<SolicitudFinanciamiento> listarActivasPorUsuario(Integer usuarioId) {
        return this.solicitudFinanciamientoJpaRepository
                .findByAltaAndCreadoPorUsuarioId((short) 1, usuarioId).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
