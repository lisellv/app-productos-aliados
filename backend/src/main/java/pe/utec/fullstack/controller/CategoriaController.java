package pe.utec.fullstack.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import pe.utec.fullstack.controller.request.CreateCategoriaRequest;
import pe.utec.fullstack.controller.request.UpdateCategoriaRequest;
import pe.utec.fullstack.domain.CategoriaService;
import pe.utec.fullstack.domain.business.Categoria;

@RestController
@RequestMapping({ "/api/categorias", "/api/categories" })
public class CategoriaController {

    private final CategoriaService categoriaService;
    private final RequestMapper mapper;

    public CategoriaController(CategoriaService categoriaService, RequestMapper mapper) {
        this.categoriaService = categoriaService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Categoria> listar() {
        return this.categoriaService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Categoria obtener(@PathVariable Integer id) {
        return this.categoriaService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Categoria crear(@Valid @RequestBody CreateCategoriaRequest request) {
        return this.categoriaService.crear(this.mapper.toDomain(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Categoria actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateCategoriaRequest request) {
        return this.categoriaService.actualizar(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.categoriaService.eliminar(id);
    }
}
