# 🚀 Mini Delivery App

**Mini Delivery** — a pet project built with **NestJS**, featuring authentication, **Stripe** integration, and **PostgreSQL** + **Redis** support.  
It provides basic functionality to create products and place orders — the foundation for a delivery service.

---

## ✨ Features
- 🔑 User registration & authentication (JWT)
- 📦 Product management (create, view, order)
- 💳 **Stripe** payments integration
- ⚡ Caching with **Redis**
- 🗄️ Data storage in **PostgreSQL**
- 📡 Backend built with **NestJS**

---

## 📂 Tech Stack
- **NestJS** — backend framework  
- **TypeScript**  
- **PostgreSQL** — main database  
- **Redis** — caching  
- **Stripe API** — payments  

---

## 📦 Installation & Run
```bash
# Clone repository
git clone https://github.com/neoxore/mini_delivery_app.git

# Navigate to project
cd mini-delivery

# Install dependencies
npm install

# Configure environment variables (.env)
# POSTGRES_URL, REDIS_URL, STRIPE_SECRET_KEY, JWT_SECRET etc.

# Run in development mode
npm run start:dev
