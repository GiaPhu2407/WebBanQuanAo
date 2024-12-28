"use client";
import React from "react";
import Header from "../(Home)/Header";
import Footer from "../(Home)/Footer";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSuccess(true);
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex mt-56 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md mt-4 sm:-mt-20">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
            Liên hệ với GiPuDiHi
          </h1>

          {success && (
            <p className="text-green-500 font-semibold text-center mb-4">
              Gửi thành công!
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Họ và tên
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tin nhắn
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="block w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              ></textarea>
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow transition-colors duration-200"
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}