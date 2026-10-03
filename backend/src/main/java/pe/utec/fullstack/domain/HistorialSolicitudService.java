package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.HistorialSolicitud;

import pe.utec.fullstack.repository.HistorialSolicitudRepository;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class HistorialSolicitudService {

    private final HistorialSolicitudRepository historialSolicitudRepository;

    public HistorialSolicitudService(HistorialSolicitudRepository historialSolicitudRepository) {
        this.historialSolicitudRepository = historialSolicitudRepository;
    }
    public HistorialSolicitud registrar(HistorialSolicitud historial) {
        historial.setAlta((short) 1);
        historial.setCreadoAt(OffsetDateTime.now());
        return this.historialSolicitudRepository.guardar(historial);
    }
    public HistorialSolicitud obtenerPorId(Integer id) {
        return this.historialSolicitudRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Historial de solicitud no encontrado: " + id));
    }
    public List<HistorialSolicitud> listar() {
        return this.historialSolicitudRepository.listarActivos();
    }
    public List<HistorialSolicitud> listarPorSolicitud(Integer solicitudId) {
        return this.historialSolicitudRepository.listarPorSolicitud(solicitudId);
    }
}
