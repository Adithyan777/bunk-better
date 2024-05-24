import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const environment = import.meta.env.VITE_ENVIRONMENT;
const baseUrl = environment === 'production'
  ? import.meta.env.VITE_BACKEND_URL
  : import.meta.env.VITE_DEVELOPMENT_BACKEND_URL;
const protocol = environment === 'production' ? 'https' : 'http';
const getFullUrl = (endpoint) => `${protocol}://${baseUrl}${endpoint}`;

export default function SignUpCard() {
  // State management for form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData); // Debugging log
    console.log("Base URL: "+ baseUrl)

    try {
      const response = await fetch(getFullUrl('/register'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      const data = await response.json();
      console.log("Success:", data); // Debugging log
      navigate('/');
      // Handle successful signup (e.g., redirect to login page, show success message, etc.)
    } catch (error) {
      navigate('/error/' + error.message);
      // Handle errors (e.g., show error message to the user)
    }
  };

  return (
    <Card className="m-40 max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}  // Toggle input type based on state
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-4 text-sm text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}  // Toggle showPassword state
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link className="underline" to="/">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
