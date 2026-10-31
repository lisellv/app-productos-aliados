package pe.utec.fullstack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorioDatosProducto extends JpaRepository<EntidadProducto, Integer> {

    List<EntidadProducto> findByAlta(Short alta);

    List<EntidadProducto> findByAliadoIdAndAlta(Integer aliadoId, Short alta);

    Optional<EntidadProducto> findByIdAndAliadoIdAndAlta(Integer id, Integer aliadoId, Short alta);

    List<EntidadProducto> findAllByIdInAndAltaAndEstado(List<Integer> ids, Short alta, String estado);
}
