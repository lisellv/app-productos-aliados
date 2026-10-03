package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.DerivacionBanco;
import pe.utec.fullstack.domain.DerivacionBancoService;
import pe.utec.fullstack.controller.request.CreateDerivacionBancoRequest;
import pe.utec.fullstack.controller.request.UpdateDerivacionBancoRequest;

import java.util.List;

@RestController
@RequestMapping("/api/derivacion-banco")
public class DerivacionBancoController {

    private final DerivacionBancoService derivacionBancoService;
    private final RequestMapper mapper;

    public DerivacionBancoController(DerivacionBancoService derivacionBancoService, RequestMapper mapper) {
        this.derivacionBancoService = derivacionBancoService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<DerivacionBanco> listar() {
        return this.derivacionBancoService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public DerivacionBanco obtener(@PathVariable Integer id) {
        return this.derivacionBancoService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DerivacionBanco crear(@Valid @RequestBody CreateDerivacionBancoRequest request) {
        return this.derivacionBancoService.crear(this.mapper.toDomain(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public DerivacionBanco actualizarRespuesta(@PathVariable Integer id, @Valid @RequestBody UpdateDerivacionBancoRequest request) {
        return this.derivacionBancoService.actualizarRespuesta(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.derivacionBancoService.eliminar(id);
    }
}
