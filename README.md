# REST API Data Table Widget

A dynamic, React-based data table widget that allows users to connect to any REST API endpoint, fetch and display data with pagination, auto-refresh, and nested data handling support.


## 🚀 Overview

The **REST API Data Table Widget** enables users to:
- Bind any REST API at runtime via a simple UI
- Dynamically generate table columns from API response
- Paginate results
- Refresh data manually or automatically
- Handle nested JSON data
- Authenticate requests via custom headers

---

## 🔑 Key Features

- ✅ **Runtime API Configuration** – Bind to any API URL
- 📊 **Dynamic Table Generation** – Columns are auto-generated
- 🔄 **Pagination Support** – Handles offset/limit or page-based pagination
- ⚡ **Live Refresh** – Manual and auto-refresh with configurable intervals
- 🧩 **Nested Data Handling** – Supports nested objects and arrays
- 🛡️ **Error Handling** – Graceful error messages and recovery options
- 🔐 **Authentication Support** – Add custom headers (e.g., API keys, tokens)

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/Aloseous/DataTableWidget.git
```

Navigate to the project directory:

```bash
cd dataTableWidget
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## 🛠️ Usage

1. Click the **"Configure API"** button
2. Enter your **API endpoint URL**
3. (Optional) Add headers or query parameters
4. Test the connection
5. Save the configuration
6. Use the **Refresh** button or configure **Auto-refresh**

---

## 🔍 API Configuration Examples

### 1. Basic JSON Data

```json
{
  "url": "https://jsonplaceholder.typicode.com/users"
}
```

- **Returns**: 10 user objects with nested address and company fields  
- **Best For**: Basic table and nested data testing

---

### 2. Paginated Data

```json
{
  "url": "https://dummyjson.com/products",
  "params": [
    {"key": "limit", "value": "10"},
    {"key": "skip", "value": "0"}
  ]
}
```

- **Returns**: Product data with pagination metadata  
- **Best For**: Testing pagination  
- **Parameters**:
  - `limit`: Items per page  
  - `skip`: Pagination offset

---

### 3. Authentication Example

To access authenticated endpoints, you'll need an API key.

#### 🔑 How to Get an API Key

1. Go to [api-ninjas.com](https://api-ninjas.com/)
2. Sign up for a free account
3. Once logged in, navigate to the **API Dashboard**
4. Copy your **X-Api-Key**

#### 🧪 Sample Configuration

```json
{
  "url": "https://api.api-ninjas.com/v1/quotes",
  "headers": [
    { "key": "X-Api-Key", "value": "your-api-key" }
  ]
}

```

- **Returns**: A random quote (authenticated)  
- **Best For**: Testing API authentication with custom headers
- **Headers**:
  - `X-Api-Key`: Your API key from https://api-ninjas.com/

---

## ⚙️ Configuration Options

| Setting           | Description                       | Default                                       |
|-------------------|-----------------------------------|-----------------------------------------------|
| API URL           | REST endpoint URL                 | `https://jsonplaceholder.typicode.com/users` |
| Headers           | Custom HTTP headers               | `Content-Type: application/json`             |
| Parameters        | URL query parameters              | None                                          |
| Refresh Interval  | Auto-refresh frequency (seconds)  | Off (manual refresh only)                    |

