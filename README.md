# SE400 Smart Sourcing System

## Overview

SE400 Smart Sourcing System is a blockchain-enabled procurement platform designed to improve transparency, traceability, and automation throughout the sourcing and purchasing lifecycle.

The system integrates traditional enterprise procurement processes with Ethereum smart contracts to ensure that critical business actions are verifiable, auditable, and tamper-resistant.

### Key Features

* Demand management
* Supplier registration
* Supplier quotation management
* Supplier evaluation and allocation
* Order execution tracking
* Smart contract–based payment release
* Blockchain transaction auditing
* Transparent procurement workflow with protected business data

---

# System Architecture

The repository is organized into three main modules:

```text
se400-smart-sourcing-system
│
├── backend
│   ├── REST API
│   ├── Business Logic
│   ├── MongoDB Persistence
│   └── Blockchain Integration
│
├── frontend
│   ├── React Application
│   ├── Management Dashboard
│   └── Wallet Integration
│
└── smart-contract
    ├── Solidity Contracts
    └── Hardhat Project
```

---

# Technology Stack

## Backend

### Technologies

* Node.js
* TypeScript
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt
* Ethers.js

### Architecture

The backend follows Domain-Driven Design (DDD) and Clean Architecture principles.

```text
Presentation Layer
        ↓
Application Layer
        ↓
Domain Layer
        ↓
Infrastructure Layer
```

### Design Patterns

* Domain-Driven Design (DDD)
* Repository Pattern
* Use Case Pattern
* Dependency Injection
* Service Layer Pattern

---

## Frontend

### Technologies

* React
* TypeScript
* React Router
* TanStack Query
* Tailwind CSS
* Ethers.js

### Features

* Procurement dashboard
* Contract management
* Demand management
* Supplier quotation management
* Order management
* MetaMask integration
* Blockchain transaction monitoring

---

## Blockchain Layer

### Technologies

* Solidity
* Hardhat
* Ethers.js

### Smart Contracts

#### SourcingSystem

Responsible for:

* Customer registration
* Supplier registration
* Procurement contract deployment

#### ProcurementContract

Responsible for:

* Procurement workflow management
* Deposit handling
* Allocation execution
* Delivery tracking
* Inspection confirmation
* Payment release
* Contract completion

---

# Prerequisites

Before running the project, ensure the following software is installed:

* Node.js 20+
* MongoDB 7+
* MetaMask
* Hardhat

---

# Installation Guide

## 1. Clone Repository

```bash
git clone <repository-url>

cd se400-smart-sourcing-system
```

---

# Smart Contract Setup

Navigate to the smart contract directory:

```bash
cd smart-contract
```

Install dependencies:

```bash
npm install
```

Compile contracts:

```bash
npx hardhat compile
```

Start a local blockchain network:

```bash
npx hardhat node
```

Deploy contracts:

```bash
npx hardhat ignition deploy ignition/modules/SourcingSystem.ts --network localhost
```

After deployment, copy the generated contract address:

```text
SOURCING_SYSTEM_ADDRESS
```

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3000

MONGO_URI=mongodb://localhost:27017/se400-smart-sourcing

JWT_SECRET=your-secret-key

PRIVATE_KEY=your-wallet-private-key

RPC_WS_URL=ws://127.0.0.1:8545

SOURCING_SYSTEM_ADDRESS=0xYourContractAddress
```

Start the backend server:

```bash
npm run dev
```

The backend API will be available at:

```text
http://localhost:3000
```

---

# Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create an environment file:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend application:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

# Procurement Workflow

The platform supports the following procurement lifecycle:

```text
Demand Creation
        ↓
Demand Approval
        ↓
Supplier Registration
        ↓
Quotation Submission
        ↓
Quotation Confirmation
        ↓
Allocation Execution
        ↓
Order Creation
        ↓
Deposit
        ↓
Delivery
        ↓
Inspection
        ↓
Payment Release
        ↓
Contract Completion
```

---

# Project Structure

## Backend

```text
src
├── presentation
├── application
├── domain
├── infrastructure
├── bootstrap
└── config
```

### Responsibilities

* Presentation: Controllers, Routes, Middlewares
* Application: Use Cases, DTOs, Repository Interfaces
* Domain: Entities, Value Objects, Business Rules
* Infrastructure: MongoDB and Blockchain Implementations
* Bootstrap: Dependency Injection Configuration

---

## Frontend

```text
src
├── app
├── core
├── features
└── shared
```

### Responsibilities

* App: Layouts and Routing
* Core: API Clients and Blockchain Services
* Features: Business Modules
* Shared: Reusable Components and Utilities

---

# Security Features

* JWT Authentication
* Password Hashing with Bcrypt
* Role-Based Access Control (RBAC)
* Blockchain Transaction Verification
* Immutable Smart Contract Records

---

# Academic Context

This project was developed as part of the SE400 Software Engineering course and demonstrates the integration of:

* Blockchain Technology
* Smart Contracts
* Domain-Driven Design
* Clean Architecture
* Enterprise Procurement Management

---

# License

This project is intended for academic and research purposes.
