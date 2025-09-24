
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
======
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
>>>>>>> 2e7b1bc (feat: add product creation endpoint)
