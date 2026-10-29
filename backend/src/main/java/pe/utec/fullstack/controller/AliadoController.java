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
import pe.utec.fullstack.controller.request.CreateAliadoRequest;
import pe.utec.fullstack.controller.request.UpdateAliadoRequest;
import pe.utec.fullstack.controller.response.AliadoCatalogoResponse;
import pe.utec.fullstack.domain.AliadoService;
import pe.utec.fullstack.domain.business.Aliado;

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

    @GetMapping("/catalogo")
    @ResponseStatus(HttpStatus.OK)
    public List<AliadoCatalogoResponse> listarCatalogo() {
        return this.aliadoService.listar().stream()
                .map(aliado -> new AliadoCatalogoResponse(aliado.getId(), aliado.getRazonSocial()))
                .toList();
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
