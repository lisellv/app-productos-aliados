package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.Categoria;

import pe.utec.fullstack.repository.CategoriaRepository;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }
    public Categoria crear(Categoria categoria) {
        categoria.setActivo(true);
        categoria.setAlta((short) 1);
        return this.categoriaRepository.guardar(categoria);
    }
    public Categoria obtenerPorId(Integer id) {
        return this.categoriaRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada: " + id));
    }
    public List<Categoria> listar() {
        return this.categoriaRepository.listarActivas();
    }
    public Categoria actualizar(Integer id, Categoria categoria) {
        Categoria existente = this.obtenerPorId(id);
        existente.setNombre(categoria.getNombre());
        existente.setDescripcion(categoria.getDescripcion());
        if (categoria.getActivo() != null) {
            existente.setActivo(categoria.getActivo());
        }
        return this.categoriaRepository.guardar(existente);
    }
    public void eliminar(Integer id) {
        Categoria existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        existente.setActivo(false);
        this.categoriaRepository.guardar(existente);
    }
}
