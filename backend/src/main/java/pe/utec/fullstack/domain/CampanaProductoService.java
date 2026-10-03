package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.CampanaProducto;

import pe.utec.fullstack.repository.CampanaProductoRepository;

import java.util.List;

@Service
public class CampanaProductoService {

    private final CampanaProductoRepository campanaProductoRepository;

    public CampanaProductoService(CampanaProductoRepository campanaProductoRepository) {
        this.campanaProductoRepository = campanaProductoRepository;
    }
    public CampanaProducto crear(CampanaProducto campanaProducto) {
        campanaProducto.setAlta((short) 1);
        return this.campanaProductoRepository.guardar(campanaProducto);
    }
    public CampanaProducto obtenerPorClave(Integer campanaId, Integer productoId) {
        return this.campanaProductoRepository.buscarPorClave(campanaId, productoId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Relación campaña-producto no encontrada: " + campanaId + "/" + productoId));
    }
    public List<CampanaProducto> listar() {
        return this.campanaProductoRepository.listarActivos();
    }
    public CampanaProducto actualizar(Integer campanaId, Integer productoId, CampanaProducto campanaProducto) {
        CampanaProducto existente = this.obtenerPorClave(campanaId, productoId);
        existente.setBeneficio(campanaProducto.getBeneficio());
        existente.setCondicionesComerciales(campanaProducto.getCondicionesComerciales());
        return this.campanaProductoRepository.guardar(existente);
    }
    public void eliminar(Integer campanaId, Integer productoId) {
        CampanaProducto existente = this.obtenerPorClave(campanaId, productoId);
        existente.setAlta((short) 0);
        this.campanaProductoRepository.guardar(existente);
    }
}
