package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.Campana;

import pe.utec.fullstack.repository.CampanaRepository;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class CampanaService {

    private final CampanaRepository campanaRepository;

    public CampanaService(CampanaRepository campanaRepository) {
        this.campanaRepository = campanaRepository;
    }
    public Campana crear(Campana campana, Integer usuarioCreadorId) {
        this.validarFechas(campana);
        campana.setCreadoPorId(usuarioCreadorId);
        campana.setEstado("planificada");
        campana.setAlta((short) 1);
        campana.setCreadoAt(OffsetDateTime.now());
        campana.setActualizadoAt(OffsetDateTime.now());
        return this.campanaRepository.guardar(campana);
    }
    public Campana obtenerPorId(Integer id) {
        return this.campanaRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Campaña no encontrada: " + id));
    }
    public List<Campana> listar() {
        return this.campanaRepository.listarActivas();
    }
    public Campana actualizar(Integer id, Campana campana) {
        Campana existente = this.obtenerPorId(id);
        existente.setNombre(campana.getNombre());
        existente.setDescripcion(campana.getDescripcion());
        existente.setFechaInicio(campana.getFechaInicio());
        existente.setFechaFin(campana.getFechaFin());
        if (campana.getEstado() != null) {
            existente.setEstado(campana.getEstado());
        }
        this.validarFechas(existente);
        existente.setActualizadoAt(OffsetDateTime.now());
        return this.campanaRepository.guardar(existente);
    }
    public void eliminar(Integer id) {
        Campana existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        existente.setEstado("cancelada");
        existente.setActualizadoAt(OffsetDateTime.now());
        this.campanaRepository.guardar(existente);
    }

    private void validarFechas(Campana campana) {
        if (campana.getFechaFin().isBefore(campana.getFechaInicio())) {
            throw new IllegalArgumentException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }
    }
}
