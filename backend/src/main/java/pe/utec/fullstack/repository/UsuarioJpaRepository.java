package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioJpaRepository extends JpaRepository<UsuarioJpaEntity, Integer> {

    List<UsuarioJpaEntity> findByAlta(Short alta);

    Optional<UsuarioJpaEntity> findByCorreoElectronicoAndAltaAndActivo(
            String correoElectronico, Short alta, Boolean activo);
}
