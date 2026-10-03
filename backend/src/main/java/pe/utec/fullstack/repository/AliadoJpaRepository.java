package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AliadoJpaRepository extends JpaRepository<AliadoJpaEntity, Integer> {

    List<AliadoJpaEntity> findByAlta(Short alta);
}
