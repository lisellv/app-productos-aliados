package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.Categoria;
import pe.utec.fullstack.domain.CategoriaService;
import pe.utec.fullstack.controller.request.CreateCategoriaRequest;
import pe.utec.fullstack.controller.request.UpdateCategoriaRequest;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
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
