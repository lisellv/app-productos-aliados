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

    Aliado toDomain(AliadoJpaEntity entity);

    AliadoJpaEntity toEntity(Aliado domain);

    Campana toDomain(CampanaJpaEntity entity);

    CampanaJpaEntity toEntity(Campana domain);

    CampanaProducto toDomain(CampanaProductoJpaEntity entity);

    CampanaProductoJpaEntity toEntity(CampanaProducto domain);

    Categoria toDomain(CategoriaJpaEntity entity);

    CategoriaJpaEntity toEntity(Categoria domain);

    Cliente toDomain(ClienteJpaEntity entity);

    ClienteJpaEntity toEntity(Cliente domain);

    DerivacionBanco toDomain(DerivacionBancoJpaEntity entity);

    DerivacionBancoJpaEntity toEntity(DerivacionBanco domain);

    HistorialSolicitud toDomain(HistorialSolicitudJpaEntity entity);

    HistorialSolicitudJpaEntity toEntity(HistorialSolicitud domain);

    ListaInteres toDomain(ListaInteresJpaEntity entity);

    ListaInteresJpaEntity toEntity(ListaInteres domain);

    ProductoFinanciamiento toDomain(ProductoFinanciamientoJpaEntity entity);

    ProductoFinanciamientoJpaEntity toEntity(ProductoFinanciamiento domain);

    Producto toDomain(ProductoJpaEntity entity);

    ProductoJpaEntity toEntity(Producto domain);

    ReglaPrecalificacion toDomain(ReglaPrecalificacionJpaEntity entity);

    ReglaPrecalificacionJpaEntity toEntity(ReglaPrecalificacion domain);

    Rol toDomain(RolJpaEntity entity);

    RolJpaEntity toEntity(Rol domain);

    SolicitudFinanciamiento toDomain(SolicitudFinanciamientoJpaEntity entity);

    SolicitudFinanciamientoJpaEntity toEntity(SolicitudFinanciamiento domain);

    TipoFinanciamiento toDomain(TipoFinanciamientoJpaEntity entity);

    TipoFinanciamientoJpaEntity toEntity(TipoFinanciamiento domain);

    Usuario toDomain(UsuarioJpaEntity entity);

    UsuarioJpaEntity toEntity(Usuario domain);
}
