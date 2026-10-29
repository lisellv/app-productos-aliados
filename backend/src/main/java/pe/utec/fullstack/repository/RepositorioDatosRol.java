package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioDatosRol extends JpaRepository<EntidadRol, Integer> {

    List<EntidadRol> findByAlta(Short alta);

    java.util.Optional<EntidadRol> findByIdAndAlta(Integer id, Short alta);
}
