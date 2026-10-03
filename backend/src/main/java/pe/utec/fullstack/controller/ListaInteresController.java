package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.ListaInteres;
import pe.utec.fullstack.domain.ListaInteresService;
import pe.utec.fullstack.controller.request.CreateListaInteresRequest;

import java.util.List;

@RestController
@RequestMapping("/api/lista-interes")
public class ListaInteresController {

    private final ListaInteresService listaInteresService;
    private final RequestMapper mapper;

    public ListaInteresController(ListaInteresService listaInteresService, RequestMapper mapper) {
        this.listaInteresService = listaInteresService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ListaInteres> listar() {
        return this.listaInteresService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ListaInteres obtener(@PathVariable Integer id) {
        return this.listaInteresService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ListaInteres crear(@Valid @RequestBody CreateListaInteresRequest request) {
        return this.listaInteresService.crear(this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.listaInteresService.eliminar(id);
    }
}
