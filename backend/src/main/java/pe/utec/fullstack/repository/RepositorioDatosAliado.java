package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioDatosAliado extends JpaRepository<EntidadAliado, Integer> {

    List<EntidadAliado> findByAlta(Short alta);
}
