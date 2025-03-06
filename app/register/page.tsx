"use client";

import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    loginEmail: "",
    loginPassword: "",
    rememberMe: false,
    termsAccepted: false,
  });
  const [message, setMessage] = useState({ text: "", isError: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match", isError: true });
      return;
    }

    if (!formData.termsAccepted) {
      setMessage({
        text: "Please accept the Terms and Conditions",
        isError: true,
      });
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Registration successful!", isError: false });
        // Reset form and switch to login
        setFormData((prev) => ({
          ...prev,
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          birthDate: "",
          password: "",
          confirmPassword: "",
          termsAccepted: false,
        }));
        setActiveTab("login");
      } else {
        setMessage({
          text: data.error || "Registration failed",
          isError: true,
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again.",
        isError: true,
      });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.loginEmail,
          password: formData.loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: `Welcome back, ${data.name}!`, isError: false });
        // In a real app, you would save user data in localStorage or cookies if rememberMe is checked
        if (formData.rememberMe) {
          // Store user session (simplified example)
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data.userId,
              email: data.email,
              name: data.name,
            })
          );
        }
        // Then redirect to dashboard or home page
      } else {
        setMessage({ text: data.error || "Login failed", isError: true });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again.",
        isError: true,
      });
    }
  };

  // Form field definitions - programmatic approach!
  const registerFields = [
    {
      id: "firstName",
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "First Name",
      required: true,
      colSpan: 1,
    },
    {
      id: "lastName",
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Last Name",
      required: true,
      colSpan: 1,
    },
    {
      id: "email",
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Email",
      required: true,
      colSpan: 2,
    },
    {
      id: "phone",
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "Phone Number",
      required: true,
      colSpan: 2,
    },
    {
      id: "birthDate",
      name: "birthDate",
      label: "Date of Birth",
      type: "date",
      required: true,
      colSpan: 2,
    },
    {
      id: "password",
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Password",
      required: true,
      colSpan: 2,
    },
    {
      id: "confirmPassword",
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm Password",
      required: true,
      colSpan: 2,
    },
  ];

  const loginFields = [
    {
      id: "loginEmail",
      name: "loginEmail",
      label: "Email Address",
      type: "email",
      placeholder: "Email",
      required: true,
    },
    {
      id: "loginPassword",
      name: "loginPassword",
      label: "Password",
      type: "password",
      placeholder: "Password",
      required: true,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <Head>
        <title>Login & Registration</title>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "login"
                ? "text-blue-600 bg-white border-b-2 border-blue-500"
                : "text-gray-500 bg-gray-50"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "register"
                ? "text-blue-600 bg-white border-b-2 border-blue-500"
                : "text-gray-500 bg-gray-50"
            }`}
          >
            Register
          </button>
        </div>

        {/* Alert Message */}
        {message.text && (
          <div
            className={`p-4 ${
              message.isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Login Form */}
        {activeTab === "login" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Welcome Back
            </h2>
            <form onSubmit={handleLoginSubmit}>
              {loginFields.map((field) => (
                <div key={field.id} className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor={field.id}
                  >
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
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-700"
                  >
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
        {activeTab === "register" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create Account
            </h2>
            <form onSubmit={handleRegisterSubmit}>
              <div className="grid grid-cols-2 gap-4">
                {registerFields.map((field) => (
                  <div
                    key={field.id}
                    className={`mb-4 ${
                      field.colSpan === 2 ? "col-span-2" : "col-span-1"
                    }`}
                  >
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor={field.id}
                    >
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
                  <label
                    htmlFor="termsAccepted"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </a>
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
