package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.CampanaProducto;
import pe.utec.fullstack.domain.CampanaProductoService;
import pe.utec.fullstack.controller.request.CreateCampanaProductoRequest;
import pe.utec.fullstack.controller.request.UpdateCampanaProductoRequest;

import java.util.List;

@RestController
@RequestMapping("/api/campana-producto")
public class CampanaProductoController {

    private final CampanaProductoService campanaProductoService;
    private final RequestMapper mapper;

    public CampanaProductoController(CampanaProductoService campanaProductoService, RequestMapper mapper) {
        this.campanaProductoService = campanaProductoService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<CampanaProducto> listar() {
        return this.campanaProductoService.listar();
    }

    @GetMapping("/{campanaId}/{productoId}")
    @ResponseStatus(HttpStatus.OK)
    public CampanaProducto obtener(@PathVariable Integer campanaId, @PathVariable Integer productoId) {
        return this.campanaProductoService.obtenerPorClave(campanaId, productoId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CampanaProducto crear(@Valid @RequestBody CreateCampanaProductoRequest request) {
        return this.campanaProductoService.crear(this.mapper.toDomain(request));
    }

    @PutMapping("/{campanaId}/{productoId}")
    @ResponseStatus(HttpStatus.OK)
    public CampanaProducto actualizar(@PathVariable Integer campanaId, @PathVariable Integer productoId,
                                       @Valid @RequestBody UpdateCampanaProductoRequest request) {
        return this.campanaProductoService.actualizar(campanaId, productoId, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{campanaId}/{productoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer campanaId, @PathVariable Integer productoId) {
        this.campanaProductoService.eliminar(campanaId, productoId);
    }
}
