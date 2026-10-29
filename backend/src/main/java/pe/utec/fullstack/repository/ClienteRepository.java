package pe.utec.fullstack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import pe.utec.fullstack.domain.business.Cliente;
import pe.utec.fullstack.domain.business.TipoDocumento;

@Repository
public class ClienteRepository {

    private final RepositorioDatosCliente clienteJpaRepository;
    private final PersistenceMapper mapper;

    public ClienteRepository(RepositorioDatosCliente clienteJpaRepository, PersistenceMapper mapper) {
        this.clienteJpaRepository = clienteJpaRepository;
        this.mapper = mapper;
    }

    public Cliente guardar(Cliente cliente) {
        return this.mapper.toDomain(
                this.clienteJpaRepository.saveAndFlush(this.mapper.toEntity(cliente)));
    }

    public Optional<Cliente> buscarPorId(Integer id) {
        return this.clienteJpaRepository.findById(id).map(this.mapper::toDomain);
    }

    public Optional<Cliente> buscarPorDocumento(TipoDocumento tipoDocumento, String numeroDocumento) {
        return this.clienteJpaRepository.findByTipoDocumentoAndNumeroDocumento(tipoDocumento, numeroDocumento)
                .map(this.mapper::toDomain);
    }

    public Optional<Cliente> buscarPorUsuarioId(Integer usuarioId) {
        return this.clienteJpaRepository.findFirstByUsuarioIdAndAlta(usuarioId, (short) 1)
                .map(this.mapper::toDomain);
    }

    public List<Cliente> listarActivos() {
        return this.clienteJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
