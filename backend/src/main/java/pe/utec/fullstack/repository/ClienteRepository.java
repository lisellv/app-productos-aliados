package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.Cliente;


import java.util.List;
import java.util.Optional;

@Repository
public class ClienteRepository {

    private final ClienteJpaRepository clienteJpaRepository;
    private final PersistenceMapper mapper;

    public ClienteRepository(ClienteJpaRepository clienteJpaRepository, PersistenceMapper mapper) {
        this.clienteJpaRepository = clienteJpaRepository;
        this.mapper = mapper;
    }
    public Cliente guardar(Cliente cliente) {
        return this.mapper.toDomain(
                this.clienteJpaRepository.saveAndFlush(this.mapper.toEntity(cliente))
        );
    }
    public Optional<Cliente> buscarPorId(Integer id) {
        return this.clienteJpaRepository.findById(id).map(this.mapper::toDomain);
    }
    public List<Cliente> listarActivos() {
        return this.clienteJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
