package pe.utec.fullstack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorioDatosSolicitudFinanciamiento extends JpaRepository<EntidadSolicitudFinanciamiento, Integer> {

    List<EntidadSolicitudFinanciamiento> findByAlta(Short alta);

    List<EntidadSolicitudFinanciamiento> findByAltaAndCreadoPorUsuarioId(Short alta, Integer creadoPorUsuarioId);
}
