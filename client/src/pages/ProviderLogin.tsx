import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Briefcase, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { getLoginUrl } from "@/const";
import Footer from "@/components/Footer";

export default function ProviderLogin() {
  const [, navigate] = useLocation();
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseState, setLicenseState] = useState("CA");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verified" | "pending" | "denied">("idle");
  const loginUrl = getLoginUrl();

  const handleVerifyLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    // Simulate license verification
    setTimeout(() => {
      setIsVerifying(false);
      // For demo: licenses starting with "LIC" are verified
      if (licenseNumber.startsWith("LIC")) {
        setVerificationStatus("verified");
      } else if (licenseNumber.startsWith("PND")) {
        setVerificationStatus("pending");
      } else {
        setVerificationStatus("denied");
      }
    }, 1500);
  };

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
            <h1 className="text-3xl font-bold text-white mb-2">Provider Portal</h1>
            <p className="text-teal-100">Coordinate care and track outcomes</p>
          </div>

          {/* License Verification Card */}
          <Card className="border-0 shadow-lg bg-white mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                License Verification
              </CardTitle>
              <CardDescription>
                Enter your professional license to verify access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleVerifyLicense} className="space-y-4">
                {/* License Number */}
                <div className="space-y-2">
                  <Label htmlFor="license">License Number</Label>
                  <Input
                    id="license"
                    placeholder="e.g., LIC123456"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    disabled={verificationStatus === "verified"}
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500">Demo: Use "LIC" prefix for verified, "PND" for pending</p>
                </div>

                {/* License State */}
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <select
                    id="state"
                    value={licenseState}
                    onChange={(e) => setLicenseState(e.target.value)}
                    disabled={verificationStatus === "verified"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="NY">New York</option>
                    <option value="FL">Florida</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Status Messages */}
                {verificationStatus === "verified" && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-900">
                      <p className="font-medium">License Verified!</p>
                      <p className="text-xs mt-1">Your credentials have been confirmed</p>
                    </div>
                  </div>
                )}

                {verificationStatus === "pending" && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-900">
                      <p className="font-medium">Verification Pending</p>
                      <p className="text-xs mt-1">Your credentials are under admin review. You'll receive an email when approved.</p>
                    </div>
                  </div>
                )}

                {verificationStatus === "denied" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-900">
                      <p className="font-medium">License Not Found</p>
                      <p className="text-xs mt-1">Please check your license number and try again, or contact support.</p>
                    </div>
                  </div>
                )}

                {/* Verify Button */}
                <Button
                  type="submit"
                  disabled={!licenseNumber || isVerifying || verificationStatus === "verified"}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
                >
                  {isVerifying ? "Verifying..." : "Verify License"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Login Card - Only show if verified */}
          {verificationStatus === "verified" && (
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                  Complete Sign In
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  Your license has been verified. Click below to sign in to your provider account.
                </p>
                <Button
                  onClick={() => window.location.href = loginUrl}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-base"
                >
                  Sign In with Manus
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Support */}
          <div className="mt-6 text-center">
            <p className="text-sm text-teal-100">
              Don't have a license?{" "}
              <a href="#" className="text-teal-300 hover:text-teal-200 font-medium">
                Request access
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
