package pe.utec.fullstack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioDatosArticuloCarrito extends JpaRepository<EntidadArticuloCarrito, Integer> {

    List<EntidadArticuloCarrito> findAllByUsuarioIdOrderById(Integer usuarioId);

    Optional<EntidadArticuloCarrito> findByUsuarioIdAndProductoId(Integer usuarioId, Integer productoId);

    Optional<EntidadArticuloCarrito> findByIdAndUsuarioId(Integer id, Integer usuarioId);

    void deleteByIdAndUsuarioId(Integer id, Integer usuarioId);

    void deleteAllByUsuarioId(Integer usuarioId);
}
