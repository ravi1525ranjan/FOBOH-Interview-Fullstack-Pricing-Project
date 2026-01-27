# Pricing Profile Management – FOBOH Take-Home Challenge

This repository contains a full-stack implementation of a **Bespoke Pricing Engine**, built as part of the FOBOH technical challenge. The goal was to design a professional, maintainable tool that allows suppliers to manage customer-specific pricing with ease and transparency.

---

##  Overview

Suppliers on FOBOH often need to tailor pricing for specific customers to remain competitive. While a global wholesale price exists, this application enables suppliers to create "Bespoke Pricing Profiles." 

The solution balances powerful product discovery with a simple, deterministic pricing logic to ensure that suppliers can adjust prices without making costly errors.

---

##  How to Use the System (Step-by-Step)

### 1. Navigation & Layout
* **Hamburger Toggle:** Use the hamburger icon in the top header to collapse or expand the sidebar. This allows you to switch between a focused "Icon-only" view and a full navigation view.
* **Contextual Header:** View the current date, user info, and active page title at a glance.

### 2. Selection Mode
Choose how you want to apply pricing by selecting one of the three modes:
* **One Product:** Target a single specific item.
* **Multiple Products:** Search and filter to pick a specific group of products.
* **All Products:** Apply a price change to your entire catalog. 
    * *Note: In "All Products" mode, Search and Filters are automatically disabled to ensure the price applies globally without confusion.*

### 3. Product Discovery
* **Real-time Search:** Use the search bar to find products by **Title** or **SKU**.
* **Advanced Filtering:** Narrow down your catalog by **Category, Segment, or Brand**.
* **Selection Management:** Use the **Select All** or **Unselect All** buttons to manage large lists of products instantly.

### 4. Pricing Adjustments & Preview
* **Define Adjustments:** Apply price changes using **Fixed Dollar ($)** amounts or **Percentage (%)** increases/decreases.
* **Real-Time Preview:** Before finalizing, the system generates a live preview showing:
    * The **Original Wholesale Price**.
    * The exact **Adjustment** being made.
    * The final **Bespoke Price** the customer will see.
* **Default Fallback:** Any product not explicitly included in a profile will automatically fall back to the global wholesale price.

---

##  Technical Stack & Architecture

### Frontend
* **React (TypeScript):** For a type-safe, component-based UI.
* **Bootstrap 5:** For responsive styling and layout.
* **State Management:** Lifted state logic to handle synchronization between the Sidebar, Header, and Table.

### Backend
* **Node.js & Express:** Providing a clean REST API for product data and pricing calculations.
* **Swagger (OpenAPI 3.0):** Interactive API documentation available at `/api-docs`.

---

##  Technical Decisions & Trade-offs

* **Explicit Defaults:** The UI explicitly states when a product is reverting to a "Global Price" to build user trust.
* **Interaction Design:** Interactive elements like the "Select All" button remain active even in global modes, while search filters lock to prevent "selection ambiguity."
* **Fuzzy Search:** Implemented a debounced search to reduce unnecessary API calls/re-renders while maintaining a smooth user experience.

---

##  Future Improvements

If extended further, I would implement:
1.  **Persistence:** Migrate from in-memory storage to a MongoDB database.
2.  **Customer Mapping:** Enable the ability to assign specific customers.


---

##  Setup Instructions

1.  **Clone & Install:**
    ```bash
    git clone (https://github.com/ravi1525ranjan/FOBOH-Interview-Fullstack-Pricing-Project.git)

    
2.  **Open first terminal to Run Backend:**
    ```bash
    cd backend
    npm install
    npm start / npm run dev # Runs on http://localhost:4000
    ```
3.  **Open second terminal to Run Frontend:**
    ```bash
    cd frontend
    npm install
    npm start / npm run dev    # Runs on http://localhost:5173
    ```

---
**Final Note:** This project was built to simulate a real-world product feature, prioritizing clean data flow and a user-centric interface.