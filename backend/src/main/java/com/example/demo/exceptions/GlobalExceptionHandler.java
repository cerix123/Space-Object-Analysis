package com.example.demo.exceptions;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        ErrorResponse error = new ErrorResponse(true, ex.getMessage());
        return ResponseEntity.ok(error);
    }
	
	@ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handle404(NoHandlerFoundException ex) {
        return ResponseEntity.ok(new ErrorResponse(true, "Nie znaleziono zasobu pod podanym adresem."));
    }

    public static class ErrorResponse {
        private boolean error;
        private String message;

        public ErrorResponse(boolean error, String message) {
            this.error = error;
            this.message = message;
        }

        public boolean isError() {
            return error;
        }

        public String getMessage() {
            return message;
        }
    }
}
