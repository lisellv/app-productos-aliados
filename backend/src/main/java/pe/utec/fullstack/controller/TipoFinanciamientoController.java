package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.TipoFinanciamiento;
import pe.utec.fullstack.domain.TipoFinanciamientoService;
import pe.utec.fullstack.controller.request.CreateTipoFinanciamientoRequest;
import pe.utec.fullstack.controller.request.UpdateTipoFinanciamientoRequest;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-financiamiento")
public class TipoFinanciamientoController {

    private final TipoFinanciamientoService tipoFinanciamientoService;
    private final RequestMapper mapper;

    public TipoFinanciamientoController(TipoFinanciamientoService tipoFinanciamientoService, RequestMapper mapper) {
        this.tipoFinanciamientoService = tipoFinanciamientoService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<TipoFinanciamiento> listar() {
        return this.tipoFinanciamientoService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TipoFinanciamiento obtener(@PathVariable Integer id) {
        return this.tipoFinanciamientoService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TipoFinanciamiento crear(@Valid @RequestBody CreateTipoFinanciamientoRequest request) {
        return this.tipoFinanciamientoService.crear(this.mapper.toDomain(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TipoFinanciamiento actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateTipoFinanciamientoRequest request) {
        return this.tipoFinanciamientoService.actualizar(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.tipoFinanciamientoService.eliminar(id);
    }
}
