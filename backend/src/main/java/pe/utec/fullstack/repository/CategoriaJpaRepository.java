package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaJpaRepository extends JpaRepository<CategoriaJpaEntity, Integer> {

    List<CategoriaJpaEntity> findByAlta(Short alta);
}
