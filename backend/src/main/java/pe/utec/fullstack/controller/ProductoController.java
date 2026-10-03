package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.Producto;
import pe.utec.fullstack.domain.ProductoService;
import pe.utec.fullstack.controller.request.CreateProductoRequest;
import pe.utec.fullstack.controller.request.UpdateProductoRequest;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;
    private final RequestMapper mapper;

    public ProductoController(ProductoService productoService, RequestMapper mapper) {
        this.productoService = productoService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Producto> listar() {
        return this.productoService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Producto obtener(@PathVariable Integer id) {
        return this.productoService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Producto crear(@Valid @RequestBody CreateProductoRequest request) {
        return this.productoService.crear(this.mapper.toDomain(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Producto actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateProductoRequest request) {
        return this.productoService.actualizar(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.productoService.eliminar(id);
    }
}
