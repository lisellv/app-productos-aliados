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
    public ResponseEntity<Exception> handleGenericException(Exception ex) {

        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ex);
    }

        @ExceptionHandler(AuthenticationException.class)
        public ResponseEntity<ExceptionResponse> handleAuthenticationException(AuthenticationException ex) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(ExceptionResponse.builder()
                                                .code("AUTH_01")
                                                .message("Credenciales inválidas")
                                                .validations(new ArrayList<>())
                                                .build());
        }

    @ExceptionHandler
    public ResponseEntity<ExceptionResponse> handleEntityNotFound(jakarta.persistence.EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ExceptionResponse.builder()
                        .code("GEN_ALL_02")
                        .message(ex.getMessage())
                        .validations(new ArrayList<>())
                        .build());
    }

    @ExceptionHandler
    public ResponseEntity<ExceptionResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ExceptionResponse.builder()
                        .code("GEN_ALL_03")
                        .message(ex.getMessage())
                        .validations(new ArrayList<>())
                        .build());
    }


    @ExceptionHandler
    public ResponseEntity<ExceptionResponse> handleFormError(MethodArgumentNotValidException methodArgumentNotValidException) {
        List<ValidationResponse> errors = new ArrayList<>();
        for (FieldError error : methodArgumentNotValidException.getBindingResult().getFieldErrors()) {
            errors.add(ValidationResponse.builder()
                    .field(error.getField())
                    .message(error.getDefaultMessage())
                    .build());
        }
        for (ObjectError error : methodArgumentNotValidException.getBindingResult().getGlobalErrors()) {
            errors.add(ValidationResponse.builder()
                    .field(error.getObjectName())
                    .message(error.getDefaultMessage())
                    .build());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ExceptionResponse.builder()
                        .code("GEN_ALL_01")
                        .message("Your request has some validation errors")
                        .validations(errors)
                        .build());
    }
}
