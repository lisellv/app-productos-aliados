package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.ReglaPrecalificacion;
import pe.utec.fullstack.domain.ReglaPrecalificacionService;
import pe.utec.fullstack.controller.request.CreateReglaPrecalificacionRequest;
import pe.utec.fullstack.controller.request.UpdateReglaPrecalificacionRequest;

import java.util.List;

@RestController
@RequestMapping("/api/reglas-precalificacion")
public class ReglaPrecalificacionController {

    private final ReglaPrecalificacionService reglaPrecalificacionService;
    private final RequestMapper mapper;

    public ReglaPrecalificacionController(ReglaPrecalificacionService reglaPrecalificacionService,
                                           RequestMapper mapper) {
        this.reglaPrecalificacionService = reglaPrecalificacionService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ReglaPrecalificacion> listar() {
        return this.reglaPrecalificacionService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ReglaPrecalificacion obtener(@PathVariable Integer id) {
        return this.reglaPrecalificacionService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReglaPrecalificacion crear(@Valid @RequestBody CreateReglaPrecalificacionRequest request) {
        return this.reglaPrecalificacionService.crear(this.mapper.toDomain(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ReglaPrecalificacion actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateReglaPrecalificacionRequest request) {
        return this.reglaPrecalificacionService.actualizar(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.reglaPrecalificacionService.eliminar(id);
    }
}
