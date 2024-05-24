import React, { useState } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Link , useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

const environment = import.meta.env.VITE_ENVIRONMENT;
const baseUrl = environment === 'production'
  ? import.meta.env.VITE_BACKEND_URL
  : import.meta.env.VITE_DEVELOPMENT_BACKEND_URL;
const protocol = environment === 'production' ? 'https' : 'http';
const getFullUrl = (endpoint) => `${protocol}://${baseUrl}${endpoint}`;

export default function Component() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(getFullUrl('/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      // Check if the response from the server is OK (status 200)
      if (response.ok) {
        const data = await response.json();
        // Save the token to localStorage
        localStorage.setItem('token', data.token);
        // Optionally, redirect the user or give feedback that login was successful
        console.log('Login successful : ' + data.token);
        navigate('/home');
      } else {
        // Handle errors such as wrong credentials
        throw new Error(response.status);
      }
    } catch (error) {
      navigate('/error/' + error.message);
    }
  };

  return (
    <div className="m-40 flex justify-center">
      <Card className="mx-auto max-w-sm" onSubmit={handleSubmit}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="m@example.com" 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  required 
                  type={showPassword ? 'text' : 'password'}  // Toggle input type based on state
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account? 
            <Link className="underline" to="/signup">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
