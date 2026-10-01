# Amazon Marketplace Clone - React Frontend

Welcome to the React frontend for the **Amazon Marketplace Clone**! This project is built using **Vite**, **React Router DOM (v6)**, and **Vanilla CSS** with rich animations and responsive layouts.

---

## 🚀 Getting Started

### 1. Install Dependencies
Ensure you are in the `frontend/` directory and run:
```bash
npm install
```

### 2. Configure the Backend Proxy
Vite is pre-configured to proxy all API requests to the backend server (port `5000`) during local development. This prevents CORS errors.
You can view or edit this in [`vite.config.js`](file:///E:/Amazon-Clone/frontend/vite.config.js).

### 3. Run the Development Server
Start the frontend server locally:
```bash
npm run dev
```
By default, the server will open on:
👉 **[http://localhost:3000/](http://localhost:3000/)**

---

## 🎨 Premium Features & UI States

1. **Simulated Payment Gateway**:
   When checking out with the "Online Payment" option, a custom **Razorpay Sandbox** modal opens. This simulates the checkout signature validation and communicates success or failure to the backend database without needing real payment keys.
2. **Dynamic Role Views**:
   Logging in as a Customer, Seller, or Admin automatically adjusts the navbar menus and protects administrative paths.
3. **Mongoose Database Hook Synchronization**:
   Submitting reviews instantly aggregates star averages on the Product Details page. Creating orders reduces stock amounts and credits seller revenue dashboard metrics.
4. **Clean CSS Custom Tokens**:
   All colors, shadows, animations, and typography variables are declared globally in [`src/index.css`](file:///E:/Amazon-Clone/frontend/src/index.css) to make stylesheet alterations easy.

---

## 📁 Key Directories & Codes

* **[`src/App.jsx`](file:///E:/Amazon-Clone/frontend/src/App.jsx)**: Global routes and route guards setup.
* **`src/context/`**: Auth, Cart, and Wishlist session contexts.
* **`src/components/`**: Navbar dropdowns, footers, card grids, and review forms.
* **`src/pages/`**: Home layouts, search sidebars, seller charts, and admin panels.
* **`src/utils/api.jsx`**: Axios client configured with JWT header interceptors.
