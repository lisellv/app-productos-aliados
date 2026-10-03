package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampanaJpaRepository extends JpaRepository<CampanaJpaEntity, Integer> {

    List<CampanaJpaEntity> findByAlta(Short alta);
}
