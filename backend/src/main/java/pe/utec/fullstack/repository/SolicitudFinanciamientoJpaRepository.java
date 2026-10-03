package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudFinanciamientoJpaRepository extends JpaRepository<SolicitudFinanciamientoJpaEntity, Integer> {

    List<SolicitudFinanciamientoJpaEntity> findByAlta(Short alta);
}
