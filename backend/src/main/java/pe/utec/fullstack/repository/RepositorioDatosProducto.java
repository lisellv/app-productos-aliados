package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioDatosProducto extends JpaRepository<EntidadProducto, Integer> {

    List<EntidadProducto> findByAlta(Short alta);

    List<EntidadProducto> findAllByIdInAndAltaAndEstado(List<Integer> ids, Short alta, String estado);
}
