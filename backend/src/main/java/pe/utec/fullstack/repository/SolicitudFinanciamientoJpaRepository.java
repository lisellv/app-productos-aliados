package pe.utec.fullstack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudFinanciamientoJpaRepository extends JpaRepository<SolicitudFinanciamientoJpaEntity, Integer> {

    List<SolicitudFinanciamientoJpaEntity> findByAlta(Short alta);

    List<SolicitudFinanciamientoJpaEntity> findByAltaAndCreadoPorUsuarioId(Short alta, Integer creadoPorUsuarioId);
}
