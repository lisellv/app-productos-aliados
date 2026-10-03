package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReglaPrecalificacionJpaRepository extends JpaRepository<ReglaPrecalificacionJpaEntity, Integer> {

    List<ReglaPrecalificacionJpaEntity> findByAlta(Short alta);
}
