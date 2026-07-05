import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { CheckCircle, AlertCircle, Download, Share2, Home } from "lucide-react";

export default function CertificateVerification() {
  const [location, setLocation] = useLocation();
  const [certificateNumber, setCertificateNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // Extract certificate number and code from URL
  useEffect(() => {
    const path = location;
    const match = path.match(/\/verify-certificate\/([^/?]+)/);
    if (match) {
      setCertificateNumber(match[1]);
      const params = new URLSearchParams(window.location.search);
      setVerificationCode(params.get("code") || "");
    }
  }, [location]);

  // Verify certificate query
  const verifyCertQuery = trpc.certificateVerification.verifyCertificate.useQuery(
    { certificateNumber, verificationCode },
    { enabled: false }
  );

  // Auto-verify if we have both certificate number and code
  useEffect(() => {
    if (certificateNumber && verificationCode && !isVerifying && !verificationResult) {
      setIsVerifying(true);
      // Trigger the query
      verifyCertQuery.refetch().then((result: any) => {
        if (result.data) {
          setVerificationResult(result.data);
        }
        setIsVerifying(false);
      });
    }
  }, [certificateNumber, verificationCode]);

  const handleManualVerify = () => {
    if (!certificateNumber || !verificationCode) {
      alert("Please enter both certificate number and verification code");
      return;
    }
    setIsVerifying(true);
    verifyCertQuery.refetch().then((result: any) => {
      if (result.data) {
        setVerificationResult(result.data);
      }
      setIsVerifying(false);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Verify Certificate</h1>
          <p className="text-slate-600">Employers and institutions can verify achievement certificates here</p>
        </div>

        {/* Verification Form */}
        {!verificationResult && (
          <Card className="bg-white border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Enter Certificate Details</CardTitle>
              <CardDescription>Provide the certificate number and verification code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Certificate Number</label>
                <input
                  type="text"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  placeholder="e.g., CERT-2024-001234"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Verification Code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="e.g., VER-ABC123XYZ"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <Button
                onClick={handleManualVerify}
                disabled={isVerifying || !certificateNumber || !verificationCode}
                className="w-full"
              >
                {isVerifying ? "Verifying..." : "Verify Certificate"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isVerifying && !verificationResult && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-teal-600"><Spinner /></div>
              <p className="text-slate-600">Verifying certificate...</p>
            </div>
          </div>
        )}

        {/* Verification Result */}
        {verificationResult && (
          <div className="space-y-6">
            {/* Status Alert */}
            {verificationResult.valid ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ✓ This certificate has been verified as authentic
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{verificationResult.message}</AlertDescription>
              </Alert>
            )}

            {/* Certificate Details */}
            {verificationResult.valid && verificationResult.certificate && (
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-amber-900">{verificationResult.certificate.title}</CardTitle>
                      <CardDescription>Verified Achievement Certificate</CardDescription>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Recipient Name</p>
                      <p className="font-semibold text-slate-900">{verificationResult.certificate.clientName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600">Achievement</p>
                      <p className="font-semibold text-slate-900">{verificationResult.certificate.title}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600">Completion Rate</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${verificationResult.certificate.completionPercentage}%` }}
                          />
                        </div>
                        <span className="font-bold text-amber-600">{verificationResult.certificate.completionPercentage}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600">Issued Date</p>
                      <p className="font-semibold text-slate-900">
                        {new Date(verificationResult.certificate.issuedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {verificationResult.certificate.description && (
                    <div className="pt-4 border-t border-amber-200">
                      <p className="text-sm text-slate-600 mb-2">Description</p>
                      <p className="text-slate-700">{verificationResult.certificate.description}</p>
                    </div>
                  )}

                  {/* Verification Details */}
                  <div className="pt-4 border-t border-amber-200 bg-white/50 p-4 rounded">
                    <p className="text-xs text-slate-600 mb-2">Verification Details</p>
                    <div className="space-y-1 text-xs text-slate-700">
                      <p>
                        <strong>Certificate #:</strong> {verificationResult.certificate.certificateNumber}
                      </p>
                      <p>
                        <strong>Issuer:</strong> {verificationResult.certificate.issuerName}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          Verified
                        </Badge>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Employer Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">For Employers & Institutions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-blue-900">
                <p>
                  This certificate verifies that the named individual has successfully completed the achievement as described
                  above through the Pathways 360 program.
                </p>
                <p>
                  The completion percentage indicates the individual's progress toward their personal goals. All certificates
                  are issued by Pathways 360 and verified through this system.
                </p>
                <p className="pt-2 font-semibold">For questions about this certificate, please contact Pathways 360.</p>
              </CardContent>
            </Card>

            {/* Back Button */}
            <Button onClick={() => setLocation("/")} variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
