import { Link } from "react-router-dom";
import { Users, ClipboardCheck, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";

import LoginForm from "@/components/auth/LoginForm";

export default function HomePage() {
  const features = [
    {
      icon: Users,
      title: "CV Collection & Segregation",
      description:
        "Easily collect and organize candidate CVs with detailed information",
    },
    {
      icon: ClipboardCheck,
      title: "Application Tracking",
      description: "Track candidates throughout the entire hiring process",
    },
    {
      icon: Calendar,
      title: "Interview Scheduling",
      description: "Schedule and manage interviews with candidates",
    },
    {
      icon: FileText,
      title: "Offer Management",
      description: "Create and send professional offer letters to candidates",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-white shadow-sm border-b">
        <div className="hrm-container py-4 pl-10 pr-10">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-hrm-purple">
                CV Nexus
              </span>
              <span className="ml-1 text-sm text-gray-600">HR Hub</span>
            </Link>
            <LoginForm className=" bg-purple-500 text-white hover:bg-purple-700" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="hrm-container py-20">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              CV Nexus <span className="text-hrm-purple">HR Hub</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-10">
              Streamline your recruitment process with our comprehensive HR
              management solution designed for modern hiring teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <LoginForm
                text="Get Started"
                className="w-full flex items-center justify-center gap-2"
              />
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              Powerful Recruitment Features
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Everything you need to streamline your hiring process and find the
              perfect candidates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our simple workflow helps you manage your recruitment process
              effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 relative">
                <span className="text-xl font-bold">1</span>
                <div className="absolute hidden md:block h-1 bg-indigo-200 w-full right-[-50%] top-1/2"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Candidates</h3>
              <p className="text-gray-600">
                Collect and organize candidate information with our easy-to-use
                form
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 relative">
                <span className="text-xl font-bold">2</span>
                <div className="absolute hidden md:block h-1 bg-indigo-200 w-full right-[-50%] top-1/2"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Schedule Interviews
              </h3>
              <p className="text-gray-600">
                Set up interviews and manage your recruitment calendar
                efficiently
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Send Offers</h3>
              <p className="text-gray-600">
                Create and send professional offer letters to selected
                candidates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Simplify Your Hiring Process?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of companies that use our platform to streamline
            their recruitment.
          </p>
          <LoginForm
            text="Get Started Now"
            className="bg-white ml-[45%] text-gray-900 hover:bg-gray-100"
          />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
