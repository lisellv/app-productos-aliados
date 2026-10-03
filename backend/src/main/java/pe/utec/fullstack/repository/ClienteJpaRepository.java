package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteJpaRepository extends JpaRepository<ClienteJpaEntity, Integer> {

    List<ClienteJpaEntity> findByAlta(Short alta);
}
