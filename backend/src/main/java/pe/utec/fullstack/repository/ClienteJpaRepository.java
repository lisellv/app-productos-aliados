package pe.utec.fullstack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteJpaRepository extends JpaRepository<ClienteJpaEntity, Integer> {

    List<ClienteJpaEntity> findByAlta(Short alta);

    Optional<ClienteJpaEntity> findByTipoDocumentoAndNumeroDocumento(
            pe.utec.fullstack.domain.business.TipoDocumento tipoDocumento,
            String numeroDocumento);
}
