package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.SolicitudFinanciamiento;
import pe.utec.fullstack.domain.SolicitudFinanciamientoService;
import pe.utec.fullstack.controller.request.CreateSolicitudFinanciamientoRequest;
import pe.utec.fullstack.controller.request.UpdateSolicitudFinanciamientoRequest;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes-financiamiento")
public class SolicitudFinanciamientoController {

    private final SolicitudFinanciamientoService solicitudFinanciamientoService;
    private final RequestMapper mapper;

    public SolicitudFinanciamientoController(SolicitudFinanciamientoService solicitudFinanciamientoService,
                                              RequestMapper mapper) {
        this.solicitudFinanciamientoService = solicitudFinanciamientoService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<SolicitudFinanciamiento> listar() {
        return this.solicitudFinanciamientoService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public SolicitudFinanciamiento obtener(@PathVariable Integer id) {
        return this.solicitudFinanciamientoService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SolicitudFinanciamiento crear(@Valid @RequestBody CreateSolicitudFinanciamientoRequest request) {
        return this.solicitudFinanciamientoService.crear(this.mapper.toDomain(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public SolicitudFinanciamiento actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateSolicitudFinanciamientoRequest request) {
        return this.solicitudFinanciamientoService.actualizar(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.solicitudFinanciamientoService.eliminar(id);
    }
}
