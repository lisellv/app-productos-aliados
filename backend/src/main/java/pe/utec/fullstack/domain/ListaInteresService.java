package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.ListaInteres;

import pe.utec.fullstack.repository.ListaInteresRepository;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class ListaInteresService {

    private final ListaInteresRepository listaInteresRepository;

    public ListaInteresService(ListaInteresRepository listaInteresRepository) {
        this.listaInteresRepository = listaInteresRepository;
    }
    public ListaInteres crear(ListaInteres listaInteres) {
        if (this.listaInteresRepository.existePorClienteYProducto(listaInteres.getClienteId(), listaInteres.getProductoId())) {
            throw new IllegalArgumentException("El producto ya está en la lista de interés del cliente");
        }
        listaInteres.setAlta((short) 1);
        listaInteres.setCreadoAt(OffsetDateTime.now());
        return this.listaInteresRepository.guardar(listaInteres);
    }
    public ListaInteres obtenerPorId(Integer id) {
        return this.listaInteresRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Registro de lista de interés no encontrado: " + id));
    }
    public List<ListaInteres> listar() {
        return this.listaInteresRepository.listarActivos();
    }
    public void eliminar(Integer id) {
        ListaInteres existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        this.listaInteresRepository.guardar(existente);
    }
}
