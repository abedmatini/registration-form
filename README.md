---
name: Postgres Next.js Starter
slug: postgres-starter
description: Simple Next.js template that uses a Postgres database.
framework: Next.js
useCase: Starter
css: Tailwind
database: Postgres
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-starter&project-name=postgres-starter&repository-name=postgres-starter&demo-title=Vercel%20Postgres%20Next.js%20Starter&demo-description=Simple%20Next.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database.&demo-url=https%3A%2F%2Fpostgres-starter.vercel.app%2F&demo-image=https%3A%2F%2Fpostgres-starter.vercel.app%2Fopengraph-image.png&products=%5B%7B%22type%22%3A%22integration%22%2C%22group%22%3A%22postgres%22%7D%5D
demoUrl: https://postgres-starter.vercel.app/
relatedTemplates:
  - postgres-prisma
  - postgres-kysely
  - postgres-sveltekit
---

# Postgres Next.js Starter

Simple Next.js template that uses a Postgres database.

## Demo

https://postgres-starter.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-starter&project-name=postgres-starter&repository-name=postgres-starter&demo-title=Vercel%20Postgres%20Next.js%20Starter&demo-description=Simple%20Next.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database.&demo-url=https%3A%2F%2Fpostgres-starter.vercel.app%2F&demo-image=https%3A%2F%2Fpostgres-starter.vercel.app%2Fopengraph-image.png&products=%5B%7B%22type%22%3A%22integration%22%2C%22group%22%3A%22postgres%22%7D%5D)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/storage/postgres-starter
```

Once that's done, copy the .env.example file in this directory to .env.local (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones in your Vercel Storage Dashboard.

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://nextjs.org/docs/deployment)).

---

For a more modern approach, let's use Next.js with its API routes:

Step 1: Create a New Next.js Project

```bash
npx create-next-app@latest auth-app
cd auth-app
npm install pg bcrypt
```

Step 2: Create Database Connection (lib/db.js)

```bash
import { Pool } from 'pg';

const pool = new Pool({
user: process.env.DB_USER,
host: process.env.DB_HOST,
database: process.env.DB_NAME,
password: process.env.DB_PASSWORD,
port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;
```

Step 3: Create API Routes

Create file: pages/api/register.js:

```bash
import pool from '../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).end();
}

try {
const { firstName, lastName, email, phone, birthDate, password } = req.body;

    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, phone, birth_date, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [firstName, lastName, email, phone, birthDate, hashedPassword]
    );

    res.status(201).json({ userId: result.rows[0].id, message: 'User registered successfully' });

} catch (error) {
console.error('Registration error:', error);
res.status(500).json({ error: 'Server error during registration' });
}
}

Create file: pages/api/login.js:

import pool from '../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).end();
}

try {
const { email, password } = req.body;

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      userId: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email
    });

} catch (error) {
console.error('Login error:', error);
res.status(500).json({ error: 'Server error during login' });
}
}
```

Step 4 (Complete): Create React Components for Forms

Create a component-based approach in pages/index.js:

```bash
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
const [activeTab, setActiveTab] = useState('login');
const [formData, setFormData] = useState({
firstName: '',
lastName: '',
email: '',
phone: '',
birthDate: '',
password: '',
confirmPassword: '',
loginEmail: '',
loginPassword: '',
rememberMe: false,
termsAccepted: false
});
const [message, setMessage] = useState({ text: '', isError: false });

const handleChange = (e) => {
const { name, value, type, checked } = e.target;
setFormData(prev => ({
...prev,
[name]: type === 'checkbox' ? checked : value
}));
};

const handleRegisterSubmit = async (e) => {
e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', isError: true });
      return;
    }

    if (!formData.termsAccepted) {
      setMessage({ text: 'Please accept the Terms and Conditions', isError: true });
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Registration successful!', isError: false });
        // Reset form and switch to login
        setFormData(prev => ({
          ...prev,
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          birthDate: '',
          password: '',
          confirmPassword: '',
          termsAccepted: false
        }));
        setActiveTab('login');
      } else {
        setMessage({ text: data.error || 'Registration failed', isError: true });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again.', isError: true });
    }

};

const handleLoginSubmit = async (e) => {
e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.loginEmail,
          password: formData.loginPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: `Welcome back, ${data.name}!`, isError: false });
        // In a real app, you would save user data in localStorage or cookies if rememberMe is checked
        if (formData.rememberMe) {
          // Store user session (simplified example)
          localStorage.setItem('user', JSON.stringify({
            id: data.userId,
            email: data.email,
            name: data.name
          }));
        }
        // Then redirect to dashboard or home page
      } else {
        setMessage({ text: data.error || 'Login failed', isError: true });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again.', isError: true });
    }

};

// Form field definitions - programmatic approach!
const registerFields = [
{ id: 'firstName', name: 'firstName', label: 'First Name', type: 'text', placeholder: 'First Name', required: true, colSpan: 1 },
{ id: 'lastName', name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last Name', required: true, colSpan: 1 },
{ id: 'email', name: 'email', label: 'Email Address', type: 'email', placeholder: 'Email', required: true, colSpan: 2 },
{ id: 'phone', name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Phone Number', required: true, colSpan: 2 },
{ id: 'birthDate', name: 'birthDate', label: 'Date of Birth', type: 'date', required: true, colSpan: 2 },
{ id: 'password', name: 'password', label: 'Password', type: 'password', placeholder: 'Password', required: true, colSpan: 2 },
{ id: 'confirmPassword', name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Confirm Password', required: true, colSpan: 2 },
];

const loginFields = [
{ id: 'loginEmail', name: 'loginEmail', label: 'Email Address', type: 'email', placeholder: 'Email', required: true },
{ id: 'loginPassword', name: 'loginPassword', label: 'Password', type: 'password', placeholder: 'Password', required: true },
];

return (
<div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
<Head>
<title>Login & Registration</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
</Head>

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'login'
                ? 'text-blue-600 bg-white border-b-2 border-blue-500'
                : 'text-gray-500 bg-gray-50'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'register'
                ? 'text-blue-600 bg-white border-b-2 border-blue-500'
                : 'text-gray-500 bg-gray-50'
            }`}
          >
            Register
          </button>
        </div>

        {/* Alert Message */}
        {message.text && (
          <div className={`p-4 ${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h2>
            <form onSubmit={handleLoginSubmit}>
              {loginFields.map(field => (
                <div key={field.id} className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field.id}>
                    {field.label}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                type="submit"
              >
                Sign In
              </button>
            </form>
          </div>
        )}

        {/* Registration Form */}
        {activeTab === 'register' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>
            <form onSubmit={handleRegisterSubmit}>
              <div className="grid grid-cols-2 gap-4">
                {registerFields.map(field => (
                  <div
                    key={field.id}
                    className={`mb-4 ${field.colSpan === 2 ? 'col-span-2' : 'col-span-1'}`}
                  >
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field.id}>
                      {field.label}
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id={field.id}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={formData[field.name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <div className="flex items-start">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>
                  </label>
                </div>
              </div>

              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                type="submit"
              >
                Create Account
              </button>
            </form>
          </div>
        )}
      </div>
    </div>

);
}

```

Step 5: Add Environment Variables (.env.local)
Create a .env.local file in the root of your Next.js project:

```bash

DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
```

Step 6: Add Form Validation
For better user experience, you can add form validation. Create a utility function in utils/validate.js:

```bash
export const validateRegistration = (formData) => {
const errors = {};

// Email validation
if (!/\S+@\S+\.\S+/.test(formData.email)) {
errors.email = 'Please enter a valid email address';
}

// Password validation (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
if (!/^(?=._[a-z])(?=._[A-Z])(?=.\*\d)[a-zA-Z\d]{8,}$/.test(formData.password)) {
errors.password = 'Password must be at least 8 characters and include uppercase, lowercase, and numbers';
}

// Password confirmation
if (formData.password !== formData.confirmPassword) {
errors.confirmPassword = 'Passwords do not match';
}

// Phone number validation (basic)
if (!/^\+?[0-9\s\-\(\)]{8,20}$/.test(formData.phone)) {
errors.phone = 'Please enter a valid phone number';
}

return {
isValid: Object.keys(errors).length === 0,
errors
};
};
```

Then import and use this in your form submission handler:

```bash
import { validateRegistration } from '../utils/validate';

// Inside your component
const handleRegisterSubmit = async (e) => {
e.preventDefault();

const { isValid, errors } = validateRegistration(formData);

if (!isValid) {
// Display the first error
const firstError = Object.values(errors)[0];
setMessage({ text: firstError, isError: true });
return;
}

// Rest of your submission logic...
}

Using TypeScript for Type Safety
If you prefer TypeScript for better type safety, you can define your form data interfaces:

// types/auth.ts
export interface RegisterFormData {
firstName: string;
lastName: string;
email: string;
phone: string;
birthDate: string;
password: string;
confirmPassword: string;
termsAccepted: boolean;
}

export interface LoginFormData {
email: string;
password: string;
rememberMe: boolean;
}

export interface User {
id: number;
firstName: string;
lastName: string;
email: string;
phone?: string;
birthDate?: string;
createdAt: string;
}
```

Benefits of This Approach
Programmatic Field Generation: As you can see in the code, we define fields as an array of objects, making it easy to add, remove, or modify fields.

Reusable Component Structure: The form structure can be extracted into its own component for reuse.

Database Integration: Direct connection to PostgreSQL using API routes.

Modern Stack: Next.js provides both frontend and backend functionality in one project.
