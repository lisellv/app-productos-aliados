package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoFinanciamientoJpaRepository extends JpaRepository<ProductoFinanciamientoJpaEntity, Integer> {

    List<ProductoFinanciamientoJpaEntity> findByAlta(Short alta);
}
