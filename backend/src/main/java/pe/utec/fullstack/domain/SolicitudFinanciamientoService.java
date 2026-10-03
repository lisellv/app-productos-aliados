package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.EstadoSolicitud;
import pe.utec.fullstack.domain.business.ResultadoPrecalificacion;
import pe.utec.fullstack.domain.business.SolicitudFinanciamiento;

import pe.utec.fullstack.repository.SolicitudFinanciamientoRepository;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class SolicitudFinanciamientoService {

    private final SolicitudFinanciamientoRepository solicitudFinanciamientoRepository;

    public SolicitudFinanciamientoService(SolicitudFinanciamientoRepository solicitudFinanciamientoRepository) {
        this.solicitudFinanciamientoRepository = solicitudFinanciamientoRepository;
    }
    public SolicitudFinanciamiento crear(SolicitudFinanciamiento solicitud) {
        if (solicitud.getConsentimientoAt() == null) {
            throw new IllegalArgumentException("Se requiere el consentimiento del cliente (Ley N.° 29733)");
        }
        if (solicitud.getMoneda() == null) {
            solicitud.setMoneda("PEN");
        }
        solicitud.setResultadoPrecalificacion(ResultadoPrecalificacion.pendiente);
        solicitud.setEstado(EstadoSolicitud.precalificado);
        solicitud.setAlta((short) 1);
        solicitud.setCreadoAt(OffsetDateTime.now());
        solicitud.setActualizadoAt(OffsetDateTime.now());
        return this.solicitudFinanciamientoRepository.guardar(solicitud);
    }
    public SolicitudFinanciamiento obtenerPorId(Integer id) {
        return this.solicitudFinanciamientoRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Solicitud de financiamiento no encontrada: " + id));
    }
    public List<SolicitudFinanciamiento> listar() {
        return this.solicitudFinanciamientoRepository.listarActivas();
    }
    public SolicitudFinanciamiento actualizar(Integer id, SolicitudFinanciamiento solicitud) {
        SolicitudFinanciamiento existente = this.obtenerPorId(id);
        if (solicitud.getEstado() != null) {
            existente.setEstado(solicitud.getEstado());
        }
        if (solicitud.getResultadoPrecalificacion() != null) {
            existente.setResultadoPrecalificacion(solicitud.getResultadoPrecalificacion());
        }
        existente.setActualizadoAt(OffsetDateTime.now());
        return this.solicitudFinanciamientoRepository.guardar(existente);
    }
    public void eliminar(Integer id) {
        SolicitudFinanciamiento existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        existente.setEstado(EstadoSolicitud.cancelado);
        existente.setActualizadoAt(OffsetDateTime.now());
        this.solicitudFinanciamientoRepository.guardar(existente);
    }
}
