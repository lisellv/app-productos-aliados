package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.ListaInteres;


import java.util.List;
import java.util.Optional;

@Repository
public class ListaInteresRepository {

    private final ListaInteresJpaRepository listaInteresJpaRepository;
    private final PersistenceMapper mapper;

    public ListaInteresRepository(ListaInteresJpaRepository listaInteresJpaRepository, PersistenceMapper mapper) {
        this.listaInteresJpaRepository = listaInteresJpaRepository;
        this.mapper = mapper;
    }
    public ListaInteres guardar(ListaInteres listaInteres) {
        return this.mapper.toDomain(
                this.listaInteresJpaRepository.saveAndFlush(this.mapper.toEntity(listaInteres))
        );
    }
    public Optional<ListaInteres> buscarPorId(Integer id) {
        return this.listaInteresJpaRepository.findById(id).map(this.mapper::toDomain);
    }
    public List<ListaInteres> listarActivos() {
        return this.listaInteresJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
    public boolean existePorClienteYProducto(Integer clienteId, Integer productoId) {
        return this.listaInteresJpaRepository.existsByClienteIdAndProductoId(clienteId, productoId);
    }
}
