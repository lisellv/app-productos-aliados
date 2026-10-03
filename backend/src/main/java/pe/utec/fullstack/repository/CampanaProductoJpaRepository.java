package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampanaProductoJpaRepository extends JpaRepository<CampanaProductoJpaEntity, CampanaProductoId> {

    List<CampanaProductoJpaEntity> findByAlta(Short alta);

    Optional<CampanaProductoJpaEntity> findByCampanaIdAndProductoId(Integer campanaId, Integer productoId);
}
