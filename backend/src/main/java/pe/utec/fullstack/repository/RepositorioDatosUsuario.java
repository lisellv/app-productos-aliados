package pe.utec.fullstack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorioDatosUsuario extends JpaRepository<EntidadUsuario, Integer> {

    List<EntidadUsuario> findByAlta(Short alta);

    boolean existsByCorreoElectronico(String correoElectronico);

    Optional<EntidadUsuario> findByCorreoElectronicoAndAltaAndActivo(
            String correoElectronico, Short alta, Boolean activo);
}
