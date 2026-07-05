import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, ArrowRight, Shield, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";

export default function LoginChoice() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-teal/5 to-white flex flex-col">
      {/* Header */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* Logo */}
          <div className="text-center mb-12">
            <img
              src="https://manus-storage.s3.us-west-2.amazonaws.com/ChatGPTImage_1719961984000_pathways360-logo-with-tagline.png"
              alt="Pathways 360"
              className="h-16 mx-auto mb-6 object-contain"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Welcome to Pathways 360
            </h1>
            <p className="text-xl text-teal-100">
              Choose your path to coordinate care and transform lives
            </p>
          </div>

          {/* Login Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Client Login */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <Users className="w-6 h-6 text-teal-700" />
                  </div>
                  <CardTitle className="text-2xl">I'm a Client</CardTitle>
                </div>
                <CardDescription>
                  Access your personal life restoration platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Personal goal planning and tracking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Find resources near you</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">24/7 AI counselor support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Connect with your care team</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/login/client")}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  size="lg"
                >
                  Client Login
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  Don't have an account?{" "}
                  <button className="text-teal-600 hover:underline font-medium">
                    Sign up free
                  </button>
                </p>
              </CardContent>
            </Card>

            {/* Provider Login */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-amber-700" />
                  </div>
                  <CardTitle className="text-2xl">I'm a Provider</CardTitle>
                </div>
                <CardDescription>
                  Coordinate care and track outcomes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Manage your client caseload</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">360° client timeline view</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Multi-agency collaboration</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">ROI and outcome tracking</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <Shield className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-900">
                    <p className="font-medium">License Required</p>
                    <p className="text-xs mt-1">Provider access requires a valid license or admin approval</p>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/login/provider")}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  size="lg"
                >
                  Provider Login
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  Need access?{" "}
                  <button className="text-amber-600 hover:underline font-medium">
                    Request credentials
                  </button>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="border-0 shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What is Pathways 360?</h3>
              <p className="text-gray-700 mb-3">
                Pathways 360 is a multi-agency collaboration platform that connects clients with resources, providers, and support systems to coordinate care and improve outcomes.
              </p>
              <p className="text-sm text-gray-600">
                Whether you're seeking life restoration support or coordinating care for your clients, Pathways 360 provides the tools and connections you need to succeed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
