FROM maven:3-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src src
# Testes ficam fora do build: o contextLoads precisa do banco, que não existe aqui
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
COPY --from=build /app/target/*.jar /app.jar
# O Render injeta $PORT; o application.properties lê server.port=${PORT:8080}
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "/app.jar"]
