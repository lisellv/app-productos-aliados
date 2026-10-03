package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.TipoFinanciamiento;

import pe.utec.fullstack.repository.TipoFinanciamientoRepository;

import java.util.List;

@Service
public class TipoFinanciamientoService {

    private final TipoFinanciamientoRepository tipoFinanciamientoRepository;

    public TipoFinanciamientoService(TipoFinanciamientoRepository tipoFinanciamientoRepository) {
        this.tipoFinanciamientoRepository = tipoFinanciamientoRepository;
    }
    public TipoFinanciamiento crear(TipoFinanciamiento tipoFinanciamiento) {
        tipoFinanciamiento.setActivo(true);
        tipoFinanciamiento.setAlta((short) 1);
        return this.tipoFinanciamientoRepository.guardar(tipoFinanciamiento);
    }
    public TipoFinanciamiento obtenerPorId(Integer id) {
        return this.tipoFinanciamientoRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Tipo de financiamiento no encontrado: " + id));
    }
    public List<TipoFinanciamiento> listar() {
        return this.tipoFinanciamientoRepository.listarActivos();
    }
    public TipoFinanciamiento actualizar(Integer id, TipoFinanciamiento tipoFinanciamiento) {
        TipoFinanciamiento existente = this.obtenerPorId(id);
        existente.setNombre(tipoFinanciamiento.getNombre());
        existente.setDescripcion(tipoFinanciamiento.getDescripcion());
        if (tipoFinanciamiento.getActivo() != null) {
            existente.setActivo(tipoFinanciamiento.getActivo());
        }
        return this.tipoFinanciamientoRepository.guardar(existente);
    }
    public void eliminar(Integer id) {
        TipoFinanciamiento existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        existente.setActivo(false);
        this.tipoFinanciamientoRepository.guardar(existente);
    }
}
