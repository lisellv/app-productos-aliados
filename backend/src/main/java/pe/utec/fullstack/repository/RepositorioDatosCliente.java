package pe.utec.fullstack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorioDatosCliente extends JpaRepository<EntidadCliente, Integer> {

    List<EntidadCliente> findByAlta(Short alta);

    Optional<EntidadCliente> findByTipoDocumentoAndNumeroDocumento(
            pe.utec.fullstack.domain.business.TipoDocumento tipoDocumento,
            String numeroDocumento);

    Optional<EntidadCliente> findFirstByUsuarioIdAndAlta(Integer usuarioId, Short alta);
}
