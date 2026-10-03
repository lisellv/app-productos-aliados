package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoFinanciamientoJpaRepository extends JpaRepository<TipoFinanciamientoJpaEntity, Integer> {

    List<TipoFinanciamientoJpaEntity> findByAlta(Short alta);
}
