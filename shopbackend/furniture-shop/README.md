# Furniture Shop Backend

Spring Boot REST API for the Furniture Shop e-commerce application. The backend provides product management, user authentication, cart and wishlist operations, orders, image uploads, and Razorpay payment support.

## Features

- REST APIs for furniture products and categories
- User registration and JWT-based login
- Role-based access for users and admins
- Cart and wishlist management
- Order creation, listing, cancellation, and updates
- Product image upload and static file serving
- Razorpay payment integration
- MySQL persistence with Spring Data JPA
- Request validation and Spring Security configuration

## Tech Stack

- Java 17
- Spring Boot 3.5.4
- Spring Web
- Spring Data JPA
- Spring Security
- MySQL
- JWT with JJWT 0.12.6
- Razorpay Java SDK
- Lombok
- Maven

## Project Structure

```text
src/main/java/furniture_shop/
  config/       Security and application configuration
  controller/   REST API controllers
  dto/          Request and response objects
  entity/       JPA entities
  jwt/          JWT authentication services and filters
  repository/   Spring Data repositories
  service/      Business logic

src/main/resources/
  application.properties
  static/       Uploaded/static resources
  templates/    Server-side templates, if required
```

## Requirements

- JDK 17 or newer
- Maven, or the included Maven Wrapper
- MySQL 8 or compatible MySQL server
- A database named `furniture_shop`

## Database Setup

Create the database before starting the application:

```sql
CREATE DATABASE furniture_shop;
```

Update the local database settings in `src/main/resources/application.properties` or provide them through a secure environment-specific configuration. Do not commit real database passwords, JWT secrets, or payment credentials.

The application uses Hibernate with `ddl-auto=update`, so tables are updated automatically when the application starts.

## Configuration

The backend runs on port `8081` by default. Important settings include:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/furniture_shop
server.port=8081
jwt.expiration=86400000
razorpay.key.id=${RAZORPAY_KEY_ID:}
razorpay.key.secret=${RAZORPAY_KEY_SECRET:}
```

Set Razorpay credentials before using payment features:

```powershell
$env:RAZORPAY_KEY_ID="your_key_id"
$env:RAZORPAY_KEY_SECRET="your_key_secret"
```

Keep credentials outside source control and use test credentials during development.

## Running the Application

Using the Maven Wrapper on Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Using Maven:

```bash
mvn spring-boot:run
```

The API will be available at:

```text
http://localhost:8081
```

## Build and Test

```bash
mvn clean package
mvn test
```

The packaged JAR is generated in the `target` directory.

## Main API Groups

| Base path | Purpose |
| --- | --- |
| `/auth` | Login and JWT token generation |
| `/users` | User registration and profile operations |
| `/products` | Public product browsing and admin product management |
| `/categories` | Product category operations |
| `/cart` | Authenticated cart operations |
| `/wishlist` | Authenticated wishlist operations |
| `/orders` | Order creation, history, updates, and cancellation |
| `/payment` | Razorpay payment operations |

### Product Examples

```text
GET    /products
GET    /products/{id}
POST   /products
PUT    /products/{id}
DELETE /products/{id}
POST   /products/{id}/image
```

Product creation, update, delete, and image upload require admin authorization.

### Authentication Example

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

Use the returned JWT token on protected requests:

```http
Authorization: Bearer <jwt-token>
```

### Order Examples

```text
POST /orders
GET  /orders
GET  /orders/my
GET  /orders/{id}
PUT  /orders/{id}/cancel
PUT  /orders/group/{orderNumber}/cancel
```

## Frontend Integration

The React frontend runs separately, normally on `http://localhost:5173`, and proxies `/api` requests to this backend on port `8081`.

Start both applications during development:

```text
Backend:  http://localhost:8081
Frontend: http://localhost:5173
```

## Important Security Notes

- Replace development database credentials before deployment.
- Use a strong, private JWT secret.
- Never commit Razorpay keys or other secrets.
- Restrict admin endpoints using the configured roles.
- Use HTTPS and production database settings when deploying.
