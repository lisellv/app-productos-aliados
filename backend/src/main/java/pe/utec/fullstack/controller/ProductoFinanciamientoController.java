package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.ProductoFinanciamiento;
import pe.utec.fullstack.domain.ProductoFinanciamientoService;
import pe.utec.fullstack.controller.request.CreateProductoFinanciamientoRequest;
import pe.utec.fullstack.controller.request.UpdateProductoFinanciamientoRequest;

import java.util.List;

@RestController
@RequestMapping("/api/productos-financiamiento")
public class ProductoFinanciamientoController {

    private final ProductoFinanciamientoService productoFinanciamientoService;
    private final RequestMapper mapper;

    public ProductoFinanciamientoController(ProductoFinanciamientoService productoFinanciamientoService,
                                             RequestMapper mapper) {
        this.productoFinanciamientoService = productoFinanciamientoService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProductoFinanciamiento> listar() {
        return this.productoFinanciamientoService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProductoFinanciamiento obtener(@PathVariable Integer id) {
        return this.productoFinanciamientoService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoFinanciamiento crear(@Valid @RequestBody CreateProductoFinanciamientoRequest request) {
        return this.productoFinanciamientoService.crear(this.mapper.toDomain(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProductoFinanciamiento actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateProductoFinanciamientoRequest request) {
        return this.productoFinanciamientoService.actualizar(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.productoFinanciamientoService.eliminar(id);
    }
}
