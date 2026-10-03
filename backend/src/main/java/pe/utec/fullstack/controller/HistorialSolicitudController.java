package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.HistorialSolicitud;
import pe.utec.fullstack.domain.HistorialSolicitudService;
import pe.utec.fullstack.controller.request.CreateHistorialSolicitudRequest;

import java.util.List;

@RestController
@RequestMapping("/api/historial-solicitud")
public class HistorialSolicitudController {

    private final HistorialSolicitudService historialSolicitudService;
    private final RequestMapper mapper;

    public HistorialSolicitudController(HistorialSolicitudService historialSolicitudService, RequestMapper mapper) {
        this.historialSolicitudService = historialSolicitudService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<HistorialSolicitud> listar() {
        return this.historialSolicitudService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public HistorialSolicitud obtener(@PathVariable Integer id) {
        return this.historialSolicitudService.obtenerPorId(id);
    }

    @GetMapping("/solicitud/{solicitudId}")
    @ResponseStatus(HttpStatus.OK)
    public List<HistorialSolicitud> listarPorSolicitud(@PathVariable Integer solicitudId) {
        return this.historialSolicitudService.listarPorSolicitud(solicitudId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HistorialSolicitud registrar(@Valid @RequestBody CreateHistorialSolicitudRequest request) {
        return this.historialSolicitudService.registrar(this.mapper.toDomain(request));
    }
}
