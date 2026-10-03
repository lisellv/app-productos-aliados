package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolJpaRepository extends JpaRepository<RolJpaEntity, Integer> {

    List<RolJpaEntity> findByAlta(Short alta);

    java.util.Optional<RolJpaEntity> findByIdAndAlta(Integer id, Short alta);
}
