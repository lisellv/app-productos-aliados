package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioDatosHistorialSolicitud extends JpaRepository<EntidadHistorialSolicitud, Integer> {

    List<EntidadHistorialSolicitud> findByAlta(Short alta);

    List<EntidadHistorialSolicitud> findBySolicitudIdOrderByCreadoAtDesc(Integer solicitudId);
}
