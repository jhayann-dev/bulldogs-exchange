Client–Server Integration
The client and server are two independent applications that communicate over HTTP using a REST API.
•	Server runs on http://localhost:5000 (Express app, entry point app.js), exposing routes such as /api/auth, /api/v1/product, /api/cart, /api/orders, etc., defined in the Routes/ folder and implemented in Controllers/.
•	Client runs on http://localhost:5173 (Vite dev server) and never talks to the database directly. Instead, all network calls are centralized in src/config/api.js, which defines a single API_BASE_URL constant (http://localhost:5000/api) and exports functions like registerUser, loginUser, and getProducts that wrap the native fetch API.

Libraries Used — Client (santos-client)
Package
•	react / react-dom
•	react-router-dom
•	tailwindcss + @tailwindcss/vite
•	vite + @vitejs/plugin-react
•	eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals
•	@types/react, @types/react-dom

Libraries Used — Server (santos-server)
Package
•	express
•	mongoose
•	jsonwebtoken
•	bcryptjs
•	cors
•	dotenv
•	nodemon (dev)

Design Patterns — Client
1.	Component-Based Architecture – UI is decomposed into reusable components (Button.jsx, NavBar.jsx, Footer.jsx, ProductCard.jsx, ProductList.jsx) composed into full pages.
2.	Page/Container Pattern – pages/ is subdivided by feature domain (AuthPages, AccountPages, AdminPages, LandingPages), separating route-level "screens" from reusable presentational components.
3.	Provider Pattern (Context API) – authContext.jsx provides global authentication state (user/token) to the component tree without prop-drilling.
4.	Higher-Order/Guard Component Pattern – ProtectedRoute.jsx wraps routes that require authentication, redirecting unauthenticated users.
5.	Service Layer / Facade Pattern – config/api.js centralizes all API communication behind simple function calls (loginUser(), getProducts()), hiding fetch/URL/error-handling details from components.
6.	Declarative Routing Pattern – react-router-dom maps URL paths to page components declaratively in App.jsx.

Design Patterns — Server
1.	MVC (Model–View–Controller), adapted for REST APIs – Models/ (data schema + persistence logic), Controllers/ (business logic per resource), and Routes/ (URL-to-controller mapping) replace the "View" with JSON responses.
2.	Middleware Pattern – authMiddleware.js intercepts requests to verify JWTs before they reach protected controllers, a core Express design pattern for cross-cutting concerns.
3.	Modular Router Pattern – Each resource (authRoutes.js, productRoutes.js, cartRoutes.js, etc.) is an isolated Express Router mounted onto the main app in app.js, keeping routing concerns decoupled per domain.
4.	Repository-like Data Access (via Mongoose Models) – Each model file encapsulates schema definition and query logic for its collection, separating data access from controller logic.
5.	Singleton Configuration Pattern – config/ centralizes one-time setups (DB connection, environment loading) so they're initialized once and reused app-wide.

bulldogs-exchange/
├── santos-client/                     # React (Vite) frontend
│   ├── src/
│   │   ├── assets/
│   │   │   └── vite.svg
│   │   ├── components/                # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductList.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── config/
│   │   │   └── api.js                 # Centralized API/service layer
│   │   ├── context/
│   │   │   └── authContext.jsx        # Global auth state (Provider pattern)
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── AccountPages/
│   │   │   │   ├── OrdersPage.jsx
│   │   │   │   └── ProfilePage.jsx
│   │   │   ├── AdminPages/
│   │   │   │   ├── AdminDashboardPage.jsx
│   │   │   │   ├── AdminOrdersPage.jsx
│   │   │   │   ├── AdminProductsPage.jsx
│   │   │   │   ├── AdminReviewsPage.jsx
│   │   │   │   └── AdminUsersPage.jsx
│   │   │   ├── AuthPages/
│   │   │   │   ├── SignInPage.jsx
│   │   │   │   └── SignUpPage.jsx
│   │   │   └── LandingPages/
│   │   │       ├── AboutPage.jsx
│   │   │       ├── HomePage.jsx
│   │   │       ├── ProductListPage.jsx
│   │   │       ├── ProductPage.jsx
│   │   │       └── NotFoundPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── santos-server/                     # Express backend (REST API)
    ├── config/                        # DB connection, env setup
    ├── Controllers/                   # Business logic per resource
    │   ├── authController.js
    │   ├── cartController.js
    │   ├── categoryController.js
    │   ├── orderController.js
    │   ├── productController.js
    │   ├── reviewController.js
    │   └── userController.js
    ├── middleware/
    │   └── authMiddleware.js          # JWT verification middleware
    ├── Models/                        # Mongoose schemas
    │   ├── cartModel.js
    │   ├── categoryModel.js
    │   ├── orderModel.js
    │   ├── productModel.js
    │   ├── reviewModel.js
    │   └── userModel.js
    ├── Routes/                        # Express routers per resource
    │   ├── authRoutes.js
    │   ├── cartRoutes.js
    │   ├── categoryRoutes.js
    │   ├── orderRoutes.js
    │   ├── productRoutes.js
    │   ├── reviewRoutes.js
    │   └── userRoutes.js
    ├── .env
    ├── app.js                         # Server entry point
    └── package.json
<img width="468" height="657" alt="image" src="https://github.com/user-attachments/assets/2810211e-2847-4806-8bd6-cc036dff2c9f" />
