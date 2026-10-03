package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.Producto;

import pe.utec.fullstack.repository.ProductoRepository;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }
    public Producto crear(Producto producto) {
        if (producto.getMoneda() == null) {
            producto.setMoneda("PEN");
        }
        producto.setEstado("activo");
        producto.setAlta((short) 1);
        producto.setCreadoAt(OffsetDateTime.now());
        producto.setActualizadoAt(OffsetDateTime.now());
        return this.productoRepository.guardar(producto);
    }
    public Producto obtenerPorId(Integer id) {
        return this.productoRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado: " + id));
    }
    public List<Producto> listar() {
        return this.productoRepository.listarActivos();
    }
    public Producto actualizar(Integer id, Producto producto) {
        Producto existente = this.obtenerPorId(id);
        existente.setCategoriaId(producto.getCategoriaId());
        existente.setNombre(producto.getNombre());
        existente.setDescripcion(producto.getDescripcion());
        existente.setPrecioLista(producto.getPrecioLista());
        existente.setIncluyeIgv(producto.getIncluyeIgv());
        existente.setImagenUrl(producto.getImagenUrl());
        if (producto.getEstado() != null) {
            existente.setEstado(producto.getEstado());
        }
        existente.setActualizadoAt(OffsetDateTime.now());
        return this.productoRepository.guardar(existente);
    }
    public void eliminar(Integer id) {
        Producto existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        existente.setEstado("inactivo");
        existente.setActualizadoAt(OffsetDateTime.now());
        this.productoRepository.guardar(existente);
    }
}
