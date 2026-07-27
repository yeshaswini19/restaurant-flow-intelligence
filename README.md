# 🍽️ KitchenPulse

## Real-Time Restaurant Intelligence Platform

KitchenPulse is a full-stack restaurant operations intelligence platform designed to help restaurants monitor inventory, manage orders, track ingredient dependencies, and calculate real-time dish availability through an event-driven architecture.

Instead of being a traditional food ordering system, KitchenPulse focuses on solving the operational challenges behind restaurant management — connecting orders, recipes, inventory, and availability into one unified platform.

---

# 🚨 Problem

Modern restaurants face several operational challenges:

- Manual inventory tracking
- Difficulty predicting dish availability
- Ingredient shortages causing order failures
- Lack of real-time kitchen visibility
- Poor coordination between orders, recipes, and stock

A restaurant may show a dish as available while required ingredients are actually running low.

KitchenPulse solves this problem by creating a real-time operational intelligence layer.

---

# 💡 Solution

KitchenPulse connects the complete restaurant workflow:

```
Customer Orders

        ↓

Order Processing

        ↓

Recipe Dependency Graph

        ↓

Ingredient Inventory Ledger

        ↓

Dish Availability Calculation

        ↓

Restaurant Operations Dashboard
```

Every order impacts inventory availability through recipe-level ingredient tracking, allowing restaurants to understand what dishes can actually be prepared at any moment.

---

# ✨ Key Features

## 🛒 Customer Portal

A customer-facing interface for browsing and ordering menu items.

Features:

- View available dishes
- Real-time availability status
- Place orders instantly
- Receive order confirmation
- Clean and responsive interface


---

## 📊 Restaurant Operations Dashboard

A centralized dashboard for restaurant operators.

Features:

- Live operational overview
- Order monitoring
- Inventory visibility
- Menu management
- Recipe dependency tracking
- Operational statistics


---

## 📦 Inventory Intelligence

Tracks ingredient-level availability.

Features:

- Ingredient stock monitoring
- Recipe-based consumption tracking
- Inventory dependency mapping
- Dish availability calculation


Example:

```
Paneer Butter Masala

Requires:

Paneer
Butter
Tomato

↓

Inventory Check

↓

Dish Availability
```

---

## 🍽️ Recipe Dependency Engine

KitchenPulse maintains relationships between:

```
Menu Items

      ↓

Recipes

      ↓

Ingredients

      ↓

Inventory
```

This allows the system to understand how ingredient changes affect menu availability.

---

## 🤖 Intelligent Assistant

KitchenPulse includes an operational assistant that helps analyze restaurant information and provide useful responses.

---

# 🏗️ System Architecture

```
                    Customer Interface
                           |
                           |
                           ↓

                    Next.js Frontend

                           |
                           |
                           ↓

                Node.js + Express Backend

                           |
                           |
                           ↓

                Supabase PostgreSQL Database

                           |
                           |
        ----------------------------------------

        Orders        Recipes        Inventory

                           |

                           ↓

             Real-Time Availability Engine

                           |

                           ↓

              Restaurant Operations Dashboard
```

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide Icons


## Backend

- Node.js
- Express.js
- TypeScript


## Database

- Supabase
- PostgreSQL


## AI Integration

- Groq API


## Development Tools

- Git
- GitHub
- VS Code

---

# 📂 Project Structure

```
restaurant-flow-intelligence

│
├── client
│   │
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── services
│   │   └── types
│
│
├── server
│   │
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── routes
│   │   ├── services
│   │   └── middleware
│
│
└── README.md
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/yeshaswini19/restaurant-flow-intelligence.git

cd restaurant-flow-intelligence
```

---

# Frontend Setup

Navigate to client:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# Backend Setup

Navigate to server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Run backend:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

# 🔐 Environment Variables

Create environment files.

## Server `.env`

```
SUPABASE_URL=

SUPABASE_SERVICE_ROLE_KEY=

GROQ_API_KEY=
```

## Client `.env.local`

```
NEXT_PUBLIC_API_URL=
```

Never commit environment files containing secret keys.

---

# 🗄️ Database Design

Main entities:

```
Restaurants

      |

Menu Items

      |

Recipes

      |

Ingredients

      |

Inventory

      |

Orders
```

The database structure enables real-time operational tracking.

---

# 🚀 Future Improvements

Planned enhancements:

- Real-time WebSocket updates
- Multi-restaurant support
- Demand forecasting
- Advanced analytics dashboard
- Mobile application
- Role-based authentication
- Cloud deployment
- Automated inventory alerts


---

# 📌 Project Status

Active development.

KitchenPulse is a portfolio project focused on building real-world restaurant operations intelligence using modern full-stack technologies.