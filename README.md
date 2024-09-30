Invoice Management Application - Backend

This repository contains the backend code for the Invoice Management Application, responsible for handling the server-side operations, data processing, and database management required to run the system efficiently.

Overview

The backend provides a robust API that the frontend interacts with, allowing users to manage invoices, clients, and products. It handles secure authentication, data storage, and business logic for the application.

Tech Stack
* Node.js: A runtime environment that allows server-side execution of JavaScript code.
* Express.js: A web framework for creating the API and managing routes.
* PostgreSQL: A relational database for storing user data, invoices, clients, and products.
* Sequelize ORM: An Object-Relational Mapping tool for interacting with the PostgreSQL database.
* Amazon S3: Used for secure and scalable storage of invoice files.
* Nodemailer: For sending email notifications, such as account verification and invoice emails.

What the Backend Does
* API for Invoice Management: Provides endpoints for creating, updating, deleting, and retrieving invoices.
* Client and Product Management: Includes CRUD operations for managing clients and products in the database.
* Authentication and Authorization: Manages user authentication (sign up, log in) and ensures that only authorized users can access specific data.
* File Storage: Uses Amazon S3 to store invoice files securely.
* Business Logic: Implements the necessary logic for calculating taxes, discounts, and generating invoices.
* Email Notifications: Sends email verification and invoice-related notifications using Nodemailer.

Uml diagram:

<img width="1073" alt="Screenshot 2024-09-30 at 9 12 00 PM" src="https://github.com/user-attachments/assets/7d123815-a238-4244-af4f-8d4e3fe7a594">


For more information on how the backend interacts with the frontend, refer to the frontend documentation [[link to frontend repo](https://github.com/MarichkaTanchyn/Invoice_builder_frontend)].

