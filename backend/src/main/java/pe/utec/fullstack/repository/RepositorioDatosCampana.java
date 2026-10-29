package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioDatosCampana extends JpaRepository<EntidadCampana, Integer> {

    List<EntidadCampana> findByAlta(Short alta);
}
