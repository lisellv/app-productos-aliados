package pe.utec.fullstack.repository;

import org.mapstruct.Mapper;

import pe.utec.fullstack.domain.business.Aliado;
import pe.utec.fullstack.domain.business.Campana;
import pe.utec.fullstack.domain.business.CampanaProducto;
import pe.utec.fullstack.domain.business.Categoria;
import pe.utec.fullstack.domain.business.Cliente;
import pe.utec.fullstack.domain.business.DerivacionBanco;
import pe.utec.fullstack.domain.business.HistorialSolicitud;
import pe.utec.fullstack.domain.business.ListaInteres;
import pe.utec.fullstack.domain.business.Producto;
import pe.utec.fullstack.domain.business.ProductoFinanciamiento;
import pe.utec.fullstack.domain.business.ReglaPrecalificacion;
import pe.utec.fullstack.domain.business.Rol;
import pe.utec.fullstack.domain.business.SolicitudFinanciamiento;
import pe.utec.fullstack.domain.business.TipoFinanciamiento;
import pe.utec.fullstack.domain.business.Usuario;

@Mapper(componentModel = "spring")
public interface PersistenceMapper {

    Aliado toDomain(EntidadAliado entity);

    EntidadAliado toEntity(Aliado domain);

    Campana toDomain(EntidadCampana entity);

    EntidadCampana toEntity(Campana domain);

    CampanaProducto toDomain(EntidadCampanaProducto entity);

    EntidadCampanaProducto toEntity(CampanaProducto domain);

    Categoria toDomain(EntidadCategoria entity);

    EntidadCategoria toEntity(Categoria domain);

    Cliente toDomain(EntidadCliente entity);

    EntidadCliente toEntity(Cliente domain);

    DerivacionBanco toDomain(EntidadDerivacionBanco entity);

    EntidadDerivacionBanco toEntity(DerivacionBanco domain);

    HistorialSolicitud toDomain(EntidadHistorialSolicitud entity);

    EntidadHistorialSolicitud toEntity(HistorialSolicitud domain);

    ListaInteres toDomain(EntidadListaInteres entity);

    EntidadListaInteres toEntity(ListaInteres domain);

    ProductoFinanciamiento toDomain(EntidadProductoFinanciamiento entity);

    EntidadProductoFinanciamiento toEntity(ProductoFinanciamiento domain);

    Producto toDomain(EntidadProducto entity);

    EntidadProducto toEntity(Producto domain);

    ReglaPrecalificacion toDomain(EntidadReglaPrecalificacion entity);

    EntidadReglaPrecalificacion toEntity(ReglaPrecalificacion domain);

    Rol toDomain(EntidadRol entity);

    EntidadRol toEntity(Rol domain);

    SolicitudFinanciamiento toDomain(EntidadSolicitudFinanciamiento entity);

    EntidadSolicitudFinanciamiento toEntity(SolicitudFinanciamiento domain);

    TipoFinanciamiento toDomain(EntidadTipoFinanciamiento entity);

    EntidadTipoFinanciamiento toEntity(TipoFinanciamiento domain);

    Usuario toDomain(EntidadUsuario entity);

    EntidadUsuario toEntity(Usuario domain);
}
