package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.ProductoFinanciamiento;

import pe.utec.fullstack.repository.ProductoFinanciamientoRepository;

import java.util.List;

@Service
public class ProductoFinanciamientoService {

    private final ProductoFinanciamientoRepository productoFinanciamientoRepository;

    public ProductoFinanciamientoService(ProductoFinanciamientoRepository productoFinanciamientoRepository) {
        this.productoFinanciamientoRepository = productoFinanciamientoRepository;
    }
    public ProductoFinanciamiento crear(ProductoFinanciamiento productoFinanciamiento) {
        this.validarRangos(productoFinanciamiento);
        productoFinanciamiento.setActivo(true);
        productoFinanciamiento.setAlta((short) 1);
        return this.productoFinanciamientoRepository.guardar(productoFinanciamiento);
    }
    public ProductoFinanciamiento obtenerPorId(Integer id) {
        return this.productoFinanciamientoRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto financiamiento no encontrado: " + id));
    }
    public List<ProductoFinanciamiento> listar() {
        return this.productoFinanciamientoRepository.listarActivos();
    }
    public ProductoFinanciamiento actualizar(Integer id, ProductoFinanciamiento productoFinanciamiento) {
        ProductoFinanciamiento existente = this.obtenerPorId(id);
        existente.setTipoTasa(productoFinanciamiento.getTipoTasa());
        existente.setTasaAnual(productoFinanciamiento.getTasaAnual());
        existente.setPlazoMinimoMeses(productoFinanciamiento.getPlazoMinimoMeses());
        existente.setPlazoMaximoMeses(productoFinanciamiento.getPlazoMaximoMeses());
        existente.setMontoMinimo(productoFinanciamiento.getMontoMinimo());
        existente.setMontoMaximo(productoFinanciamiento.getMontoMaximo());
        existente.setVigenteDesde(productoFinanciamiento.getVigenteDesde());
        existente.setVigenteHasta(productoFinanciamiento.getVigenteHasta());
        if (productoFinanciamiento.getActivo() != null) {
            existente.setActivo(productoFinanciamiento.getActivo());
        }
        this.validarRangos(existente);
        return this.productoFinanciamientoRepository.guardar(existente);
    }
    public void eliminar(Integer id) {
        ProductoFinanciamiento existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        existente.setActivo(false);
        this.productoFinanciamientoRepository.guardar(existente);
    }

    private void validarRangos(ProductoFinanciamiento pf) {
        if (pf.getPlazoMaximoMeses() < pf.getPlazoMinimoMeses()) {
            throw new IllegalArgumentException("El plazo máximo no puede ser menor que el plazo mínimo");
        }
        if (pf.getMontoMaximo().compareTo(pf.getMontoMinimo()) < 0) {
            throw new IllegalArgumentException("El monto máximo no puede ser menor que el monto mínimo");
        }
        if (pf.getVigenteHasta() != null && pf.getVigenteHasta().isBefore(pf.getVigenteDesde())) {
            throw new IllegalArgumentException("La fecha de vigencia final no puede ser anterior a la inicial");
        }
    }
}
