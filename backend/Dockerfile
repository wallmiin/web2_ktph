# Dockerfile của backend
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY pom.xml ./
COPY src ./src
COPY mvnw ./
COPY .mvn ./.mvn
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests
COPY target/*.jar app.jar

# Thêm wait-for-it script
ADD https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Sử dụng wait-for-it để chờ MySQL
CMD ["/wait-for-it.sh", "mysql:3306", "--timeout=30", "--", "java", "-jar", "app.jar"]