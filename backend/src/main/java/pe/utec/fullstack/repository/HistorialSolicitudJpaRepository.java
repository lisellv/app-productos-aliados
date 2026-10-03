package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialSolicitudJpaRepository extends JpaRepository<HistorialSolicitudJpaEntity, Integer> {

    List<HistorialSolicitudJpaEntity> findByAlta(Short alta);

    List<HistorialSolicitudJpaEntity> findBySolicitudIdOrderByCreadoAtDesc(Integer solicitudId);
}
