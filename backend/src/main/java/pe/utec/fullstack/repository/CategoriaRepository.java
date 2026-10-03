package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.Categoria;


import java.util.List;
import java.util.Optional;

@Repository
public class CategoriaRepository {

    private final CategoriaJpaRepository categoriaJpaRepository;
    private final PersistenceMapper mapper;

    public CategoriaRepository(CategoriaJpaRepository categoriaJpaRepository, PersistenceMapper mapper) {
        this.categoriaJpaRepository = categoriaJpaRepository;
        this.mapper = mapper;
    }
    public Categoria guardar(Categoria categoria) {
        return this.mapper.toDomain(
                this.categoriaJpaRepository.saveAndFlush(this.mapper.toEntity(categoria))
        );
    }
    public Optional<Categoria> buscarPorId(Integer id) {
        return this.categoriaJpaRepository.findById(id).map(this.mapper::toDomain);
    }
    public List<Categoria> listarActivas() {
        return this.categoriaJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
