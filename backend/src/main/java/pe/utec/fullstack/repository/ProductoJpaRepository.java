package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoJpaRepository extends JpaRepository<ProductoJpaEntity, Integer> {

    List<ProductoJpaEntity> findByAlta(Short alta);
}
