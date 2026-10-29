package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioDatosProductoFinanciamiento extends JpaRepository<EntidadProductoFinanciamiento, Integer> {

    List<EntidadProductoFinanciamiento> findByAlta(Short alta);
}
