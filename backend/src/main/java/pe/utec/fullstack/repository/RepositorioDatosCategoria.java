package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioDatosCategoria extends JpaRepository<EntidadCategoria, Integer> {

    List<EntidadCategoria> findByAlta(Short alta);
}
