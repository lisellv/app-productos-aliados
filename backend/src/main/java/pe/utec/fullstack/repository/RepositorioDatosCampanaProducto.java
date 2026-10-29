package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepositorioDatosCampanaProducto extends JpaRepository<EntidadCampanaProducto, CampanaProductoId> {

    List<EntidadCampanaProducto> findByAlta(Short alta);

    Optional<EntidadCampanaProducto> findByCampanaIdAndProductoId(Integer campanaId, Integer productoId);
}
