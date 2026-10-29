package pe.utec.fullstack.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class WebRestErrorHandler {

    @ExceptionHandler
    public ResponseEntity<Exception> handleGenericException(Exception excepcion) {

        excepcion.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(excepcion);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ExceptionResponse> handleAuthenticationException(AuthenticationException excepcion) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ExceptionResponse.builder()
                        .code("AUTH_01")
                        .message("Credenciales inválidas")
                        .validations(new ArrayList<>())
                        .build());
    }

    @ExceptionHandler
    public ResponseEntity<ExceptionResponse> handleEntityNotFound(
            jakarta.persistence.EntityNotFoundException excepcion) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ExceptionResponse.builder()
                        .code("GEN_ALL_02")
                        .message(excepcion.getMessage())
                        .validations(new ArrayList<>())
                        .build());
    }

    @ExceptionHandler
    public ResponseEntity<ExceptionResponse> handleIllegalArgument(IllegalArgumentException excepcion) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ExceptionResponse.builder()
                        .code("GEN_ALL_03")
                        .message(excepcion.getMessage())
                        .validations(new ArrayList<>())
                        .build());
    }

    @ExceptionHandler
    public ResponseEntity<ExceptionResponse> handleFormError(
            MethodArgumentNotValidException excepcionValidacion) {
        List<ValidationResponse> errores = new ArrayList<>();
        for (FieldError errorCampo : excepcionValidacion.getBindingResult().getFieldErrors()) {
            errores.add(ValidationResponse.builder()
                    .field(errorCampo.getField())
                    .message(errorCampo.getDefaultMessage())
                    .build());
        }
        for (ObjectError errorGeneral : excepcionValidacion.getBindingResult().getGlobalErrors()) {
            errores.add(ValidationResponse.builder()
                    .field(errorGeneral.getObjectName())
                    .message(errorGeneral.getDefaultMessage())
                    .build());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ExceptionResponse.builder()
                        .code("GEN_ALL_01")
                        .message("Your request has some validation errors")
                        .validations(errores)
                        .build());
    }
}
