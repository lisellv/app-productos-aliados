package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepositorioDatosUsuario extends JpaRepository<EntidadUsuario, Integer> {

    List<EntidadUsuario> findByAlta(Short alta);

    Optional<EntidadUsuario> findByCorreoElectronicoAndAltaAndActivo(
            String correoElectronico, Short alta, Boolean activo);
}
