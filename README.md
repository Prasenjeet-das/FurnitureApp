Furniture Shop
Furniture Shop is a full-stack furniture e-commerce application. The React frontend provides the customer and administrator interfaces, while the Spring Boot backend exposes the REST API, authentication, persistence, image storage, order management, and Razorpay payment integration.

What The Project Includes
Customer experience
Home and about pages
Product browsing with search, category filtering, price filtering, and sorting
Product detail pages with images, descriptions, prices, and stock quantities
Cart and wishlist management
Account registration, JWT login, and profile management
Checkout and Razorpay payment verification
Order history, order details, and order cancellation
Responsive desktop, tablet, and mobile layouts
Administrator experience
Protected administrator dashboard
Product creation, editing, deletion, and image upload
Category management
Order listing and status updates
User administration through the protected user APIs
Architecture
Browser
	|
	| React Router pages and Axios requests
	v
shopfrontend (Vite, normally :5173)
	|
	| /api/* rewritten by Vite to /*
	v
shopbackend/furniture-shop (Spring Boot, :8081)
	|
	+--> MySQL database: furniture_shop
	+--> uploads/products/ for product images
	+--> Razorpay API for payment orders
The frontend uses /api as its Axios base URL. During development, Vite removes the /api prefix and forwards requests to http://localhost:8081. Uploaded images are also proxied from /uploads to the backend.

Technology Stack
Frontend
React 19
Vite
React Router 7
Axios
Bootstrap 5
ESLint
Backend
Java 17
Spring Boot 3.5.4
Spring Web
Spring Data JPA and Hibernate
Spring Security with stateless JWT authentication
MySQL
JJWT 0.12.6
Razorpay Java SDK 1.4.8
Lombok
Maven
Repository Structure
FurnitureApp/
	reamdme.md                         This project guide
	Screenshoot/                       Project screenshots and reference images
	shopfrontend/                      React and Vite application
		public/                          Public frontend assets
		src/
			assets/                        Product and brand images
			components/                    Reusable UI components
			context/                       Cart and wishlist providers
			hooks/                         Cart and wishlist hooks
			pages/                         Customer and admin pages
			services/api.js                Axios client and JWT interceptor
	shopbackend/furniture-shop/        Spring Boot REST API
		src/main/java/furniture_shop/
			config/                        Security, CORS, storage, and web config
			controller/                    REST controllers
			dto/                           Authentication request/response types
			entity/                        JPA entities
			jwt/                           JWT service and authentication filter
			repository/                    Spring Data repositories
			service/                       Business logic
		src/main/resources/
			application.properties         Runtime configuration
Requirements
Node.js 18 or newer and npm
JDK 17 or newer
MySQL 8 or a compatible MySQL server
Razorpay test credentials for payment testing
Maven is optional because the backend includes mvnw and mvnw.cmd.

Database Setup
Create the database before starting the backend:

CREATE DATABASE furniture_shop;
The default local configuration connects to:

Host: localhost
Port: 3306
Database: furniture_shop
Username: root
Change the datasource username and password in shopbackend/furniture-shop/src/main/resources/application.properties for your local MySQL installation. Hibernate currently uses spring.jpa.hibernate.ddl-auto=update, so it creates or updates tables when the application starts.

Configuration
The backend runs on port 8081 by default. The important settings are in shopbackend/furniture-shop/src/main/resources/application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/furniture_shop
spring.datasource.username=root
spring.datasource.password=root
server.port=8081
jwt.expiration=86400000
razorpay.key.id=${RAZORPAY_KEY_ID:}
razorpay.key.secret=${RAZORPAY_KEY_SECRET:}
Before using payments, provide Razorpay credentials through the environment:

export RAZORPAY_KEY_ID=your_test_key_id
export RAZORPAY_KEY_SECRET=your_test_key_secret
Use test credentials during development. Do not commit database passwords, JWT secrets, or Razorpay secrets. The checked-in properties file contains development defaults; replace them for any shared or production environment.

Running Locally
Start MySQL first, then start the backend in one terminal:

cd shopbackend/furniture-shop
./mvnw spring-boot:run
On Windows, use:

cd shopbackend\furniture-shop
.\mvnw.cmd spring-boot:run
Start the frontend in a second terminal:

cd shopfrontend
npm install
npm run dev
Open http://localhost:5173. The backend is available directly at http://localhost:8081.

Frontend Commands
Run these commands from shopfrontend:

Command	Purpose
npm install	Install frontend dependencies
npm run dev	Start the Vite development server
npm run build	Create a production build in dist
npm run preview	Preview the production build
npm run lint	Run ESLint
Backend Commands
Run these commands from shopbackend/furniture-shop:

./mvnw test
./mvnw clean package
./mvnw spring-boot:run
The packaged JAR is created in target/.

Frontend Routes
Route	Access	Purpose
/	Public	Home page
/about	Public	About page
/products	Public	Browse products
/product/:id	Public	Product details
/login	Public	User login
/register	Public	Account registration
/cart	User	Shopping cart
/wishlist	User	Wishlist
/profile	User	Profile management
/checkout	User	Checkout and payment
/orders	User	Order history
/orders/:orderNumber	User	Order details
/admin	Admin	Administrator dashboard
/admin/products	Admin	Product management
/admin/orders	Admin	Order management
REST API
The backend endpoints are available directly from port 8081. When called by the frontend, prefix them with /api because of the Vite proxy.

Base path	Main purpose
/auth	Login and JWT token generation
/users	Registration, profiles, and admin user operations
/products	Public product browsing and admin product management
/categories	Admin category management
/cart	User cart operations
/wishlist	User wishlist operations
/orders	Order creation, history, updates, and cancellation
/payments	Razorpay order creation and payment verification
Common endpoint shapes include:

POST   /auth/login
POST   /users
GET    /products
GET    /products/{id}
POST   /products
PUT    /products/{id}
DELETE /products/{id}
POST   /products/{id}/image
GET    /categories
POST   /orders
GET    /orders/my
GET    /orders/{id}
PUT    /orders/{id}/cancel
PUT    /orders/group/{orderNumber}/cancel
POST   /payments/order
POST   /payments/verify
Protected requests use the JWT returned by login:

Authorization: Bearer <jwt-token>
Authentication And Roles
POST /auth/** is public.
POST /users is public for registration.
GET /products/** and product images are public.
Product writes, image uploads, categories, and administrative user operations require ROLE_ADMIN.
Cart and wishlist operations require ROLE_USER.
Profile, order, and payment operations require an authenticated user or administrator, as configured in SecurityConfig.
The frontend stores the token in browser local storage, and the Axios request interceptor adds it to outgoing API requests.
Images And Uploads
When the backend starts, it creates an uploads directory if necessary. Product images are stored in uploads/products/ and served at:

http://localhost:8081/uploads/products/{filename}
The configured maximum file size is 5 MB for both an individual file and a multipart request.

Payments
Checkout creates a Razorpay order through POST /payments/order. After Razorpay returns payment details, the frontend sends them to POST /payments/verify. The backend validates the HMAC-SHA256 signature before saving a successful payment record.

Payment requests require valid Razorpay credentials and an authenticated account. Use Razorpay test mode while developing.

Troubleshooting
Frontend cannot load products
Confirm that MySQL and the backend are running on port 8081. Also confirm the Vite development server is using the proxy configured in shopfrontend/vite.config.js.

Login or protected requests fail
Check that the token exists in browser local storage and that the account has the expected role. Restart the backend after changing JWT configuration.

Payments cannot be created
Set both RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET, use test credentials, and verify that the amount sent is greater than zero.

Images are missing
Check that the file exists under uploads/products/ relative to the backend working directory and that the image URL uses /uploads/products/.

Security And Production Notes
Replace the default MySQL password and JWT secret.
Keep Razorpay and database credentials in environment variables or a secrets manager.
Use HTTPS in production.
Review CORS origins before exposing the API publicly.
Replace ddl-auto=update with a controlled migration strategy for production data.
Configure a persistent, backed-up upload location instead of relying on a local application directory.
