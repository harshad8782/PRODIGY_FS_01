import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Lock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Secure Authentication System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive user authentication system with role-based access control, secure login, and user management
            features.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <Card className="text-center p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-semibold mb-2">Secure Authentication</CardTitle>
              <CardDescription className="text-gray-600">
                Industry-standard security with encrypted passwords and secure sessions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-xl font-semibold mb-2">Role-Based Access</CardTitle>
              <CardDescription className="text-gray-600">
                Different access levels for students and administrators with proper authorization
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-semibold mb-2">Protected Routes</CardTitle>
              <CardDescription className="text-gray-600">
                Secure pages that require authentication and proper permissions to access
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="px-8 py-3 text-lg">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
              <Link href="/auth/register">Create Account</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            New users can register as students. Contact admin for administrator access.
          </p>
        </div>
      </div>
    </div>
  )
}
