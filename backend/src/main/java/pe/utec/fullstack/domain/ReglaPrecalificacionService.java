package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.ReglaPrecalificacion;

import pe.utec.fullstack.repository.ReglaPrecalificacionRepository;

import java.util.List;

@Service
public class ReglaPrecalificacionService {

    private final ReglaPrecalificacionRepository reglaPrecalificacionRepository;

    public ReglaPrecalificacionService(ReglaPrecalificacionRepository reglaPrecalificacionRepository) {
        this.reglaPrecalificacionRepository = reglaPrecalificacionRepository;
    }
    public ReglaPrecalificacion crear(ReglaPrecalificacion regla) {
        this.validarRangos(regla);
        regla.setActivo(true);
        regla.setAlta((short) 1);
        return this.reglaPrecalificacionRepository.guardar(regla);
    }
    public ReglaPrecalificacion obtenerPorId(Integer id) {
        return this.reglaPrecalificacionRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Regla de precalificación no encontrada: " + id));
    }
    public List<ReglaPrecalificacion> listar() {
        return this.reglaPrecalificacionRepository.listarActivas();
    }
    public ReglaPrecalificacion actualizar(Integer id, ReglaPrecalificacion regla) {
        ReglaPrecalificacion existente = this.obtenerPorId(id);
        existente.setEdadMinima(regla.getEdadMinima());
        existente.setEdadMaxima(regla.getEdadMaxima());
        existente.setIngresoMinimo(regla.getIngresoMinimo());
        existente.setMontoMinimo(regla.getMontoMinimo());
        existente.setMontoMaximo(regla.getMontoMaximo());
        existente.setPlazoMinimoMeses(regla.getPlazoMinimoMeses());
        existente.setPlazoMaximoMeses(regla.getPlazoMaximoMeses());
        if (regla.getActivo() != null) {
            existente.setActivo(regla.getActivo());
        }
        this.validarRangos(existente);
        return this.reglaPrecalificacionRepository.guardar(existente);
    }
    public void eliminar(Integer id) {
        ReglaPrecalificacion existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        existente.setActivo(false);
        this.reglaPrecalificacionRepository.guardar(existente);
    }

    private void validarRangos(ReglaPrecalificacion regla) {
        if (regla.getEdadMinima() < 18) {
            throw new IllegalArgumentException("La edad mínima debe ser al menos 18");
        }
        if (regla.getEdadMaxima() < regla.getEdadMinima()) {
            throw new IllegalArgumentException("La edad máxima no puede ser menor que la edad mínima");
        }
        if (regla.getMontoMaximo().compareTo(regla.getMontoMinimo()) < 0) {
            throw new IllegalArgumentException("El monto máximo no puede ser menor que el monto mínimo");
        }
        if (regla.getPlazoMaximoMeses() < regla.getPlazoMinimoMeses()) {
            throw new IllegalArgumentException("El plazo máximo no puede ser menor que el plazo mínimo");
        }
    }
}
