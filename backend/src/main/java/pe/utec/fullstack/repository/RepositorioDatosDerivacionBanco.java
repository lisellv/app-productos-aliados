package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioDatosDerivacionBanco extends JpaRepository<EntidadDerivacionBanco, Integer> {

    List<EntidadDerivacionBanco> findByAlta(Short alta);

    boolean existsBySolicitudId(Integer solicitudId);
}
