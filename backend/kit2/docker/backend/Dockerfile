# Backend Spring Boot (Gradle, Java 21) · copiar a la raíz del repo del backend
# Para proyectos Maven usa Dockerfile.maven (renómbralo a Dockerfile).

# ---------- Etapa 1: compilar ----------
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Primero solo los archivos de Gradle: si no cambian, Docker reutiliza
# la capa con las dependencias descargadas
COPY gradlew settings.gradle* build.gradle* ./
COPY gradle gradle
# Quita saltos de línea de Windows (CRLF) y da permiso de ejecución
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew \
 && ./gradlew dependencies --no-daemon > /dev/null 2>&1 || true

COPY src src
RUN ./gradlew bootJar -x test --no-daemon \
 && find build/libs -name "*.jar" ! -name "*-plain.jar" -exec cp {} /app/app.jar \;

# ---------- Etapa 2: ejecutar ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Usuario sin privilegios (UID numérico: Kubernetes lo exige con runAsNonRoot)
RUN groupadd -r -g 1001 spring && useradd -r -u 1001 -g spring spring
COPY --from=build --chown=1001:1001 /app/app.jar app.jar
USER 1001

EXPOSE 8080
# La JVM usa como máximo el 75 % de la memoria asignada al contenedor
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
