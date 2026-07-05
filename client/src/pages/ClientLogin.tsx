import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart } from "lucide-react";
import { getLoginUrl } from "@/const";
import Footer from "@/components/Footer";

export default function ClientLogin() {
  const [, navigate] = useLocation();
  const loginUrl = getLoginUrl();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-teal/5 to-white flex flex-col">
      {/* Header */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-teal-300 hover:text-teal-200 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login options
          </button>

          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="https://manus-storage.s3.us-west-2.amazonaws.com/ChatGPTImage_1719961984000_pathways360-logo-with-tagline.png"
              alt="Pathways 360"
              className="h-14 mx-auto mb-4 object-contain"
            />
            <h1 className="text-3xl font-bold text-white mb-2">Client Portal</h1>
            <p className="text-teal-100">Your personal life restoration platform</p>
          </div>

          {/* Login Card */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                Start Your Journey
              </CardTitle>
              <CardDescription>
                Sign in or create your account to access your personalized life restoration plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* OAuth Login */}
              <Button
                onClick={() => window.location.href = loginUrl}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base"
              >
                Sign In with Manus
              </Button>

              {/* Info */}
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold text-gray-900 text-sm">What you'll get:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Personalized goal planning and tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Find resources in your area</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>24/7 AI counselor support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Calendar and appointment reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Connect with your care team</span>
                  </li>
                </ul>
              </div>

              {/* Privacy Note */}
              <p className="text-xs text-gray-600 text-center pt-4 border-t">
                Your information is 100% confidential and secure. We never share your data without your consent.
              </p>
            </CardContent>
          </Card>

          {/* Support */}
          <div className="mt-6 text-center">
            <p className="text-sm text-teal-100">
              Need help?{" "}
              <a href="#" className="text-teal-300 hover:text-teal-200 font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
