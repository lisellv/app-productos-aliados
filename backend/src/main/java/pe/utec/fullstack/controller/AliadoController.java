package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.Aliado;
import pe.utec.fullstack.domain.AliadoService;
import pe.utec.fullstack.controller.request.CreateAliadoRequest;
import pe.utec.fullstack.controller.request.UpdateAliadoRequest;

import java.util.List;

@RestController
@RequestMapping("/api/aliados")
public class AliadoController {

    private final AliadoService aliadoService;
    private final RequestMapper mapper;

    public AliadoController(AliadoService aliadoService, RequestMapper mapper) {
        this.aliadoService = aliadoService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Aliado> listar() {
        return this.aliadoService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Aliado obtener(@PathVariable Integer id) {
        return this.aliadoService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Aliado crear(@Valid @RequestBody CreateAliadoRequest request) {
        return this.aliadoService.crear(this.mapper.toDomain(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Aliado actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateAliadoRequest request) {
        return this.aliadoService.actualizar(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.aliadoService.eliminar(id);
    }
}
