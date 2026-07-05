import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Download, Printer, Eye, Trophy, Award, Zap, Share2, Linkedin, Twitter, Mail, Copy, Check, QrCode } from "lucide-react";

export default function Achievements() {
  const { user } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert>
          <AlertDescription>Please log in to view achievements</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Get client achievements
  const { data: achievements, isLoading: achievementsLoading } = trpc.achievements.getClientAchievements.useQuery(
    { clientId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  // Get eligible achievements for certification
  const { data: eligibleAchievements } = trpc.achievements.getEligibleAchievements.useQuery(
    { clientId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  // Get client certificates
  const { data: certificates, isLoading: certificatesLoading } = trpc.achievements.getClientCertificates.useQuery(
    { clientId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  // Get client badges
  const { data: badges } = trpc.achievements.getClientBadges.useQuery(
    { clientId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  // Social sharing functions
  const shareOnLinkedIn = (cert: any) => {
    const url = `https://pathways360.com/verify-certificate/${cert.certificateNumber}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = (cert: any) => {
    const text = `I just earned a Pathways 360 Achievement Certificate! 🏆 ${cert.title} (${cert.completionPercentage}%) Verify: https://pathways360.com/verify-certificate/${cert.certificateNumber}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const shareViaEmail = (cert: any) => {
    const subject = `Pathways 360 Achievement Certificate - ${cert.title}`;
    const body = `I wanted to share my achievement with you!\n\n${cert.title}\nCompletion Rate: ${cert.completionPercentage}%\n\nVerify this certificate: https://pathways360.com/verify-certificate/${cert.certificateNumber}\n\nThis achievement demonstrates my commitment to personal growth and life restoration.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyShareLink = (cert: any) => {
    const link = `https://pathways360.com/verify-certificate/${cert.certificateNumber}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (achievementsLoading || certificatesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const totalAchievements = achievements?.length || 0;
  const totalCertificates = certificates?.length || 0;
  const totalBadges = badges?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Your Achievements</h1>
          </div>
          <p className="text-slate-600">Celebrate your progress and share your success with employers and your network</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">{totalAchievements}</div>
                <p className="text-slate-600">Total Achievements</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">{totalCertificates}</div>
                <p className="text-slate-600">Certificates Earned</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{totalBadges}</div>
                <p className="text-slate-600">Badges Unlocked</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="certificates" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="certificates">Certificates ({totalCertificates})</TabsTrigger>
            <TabsTrigger value="achievements">Achievements ({totalAchievements})</TabsTrigger>
            <TabsTrigger value="badges">Badges ({totalBadges})</TabsTrigger>
          </TabsList>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            {!certificates || certificates.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No certificates yet. Complete 78% of your goals to earn your first certificate!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert: any) => (
                  <Card key={cert.id} className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-amber-900">{cert.title}</CardTitle>
                          <CardDescription>Certificate #{cert.certificateNumber}</CardDescription>
                        </div>
                        <Award className="w-6 h-6 text-amber-600" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Completion Rate</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-amber-500 h-2 rounded-full"
                                style={{ width: `${cert.completionPercentage}%` }}
                              />
                            </div>
                            <span className="font-bold text-amber-600">{cert.completionPercentage}%</span>
                          </div>
                        </div>

                        {cert.description && (
                          <div>
                            <p className="text-sm text-slate-600 mb-1">Description</p>
                            <p className="text-slate-700">{cert.description}</p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-slate-600 mb-1">Issued Date</p>
                          <p className="text-slate-700">{new Date(cert.issuedDate).toLocaleDateString()}</p>
                        </div>

                        {/* Social Sharing Buttons */}
                        <div className="pt-4 border-t">
                          <p className="text-sm font-semibold text-slate-700 mb-3">Share Your Achievement</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() => shareOnLinkedIn(cert)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Linkedin className="w-4 h-4" />
                              LinkedIn
                            </Button>
                            <Button
                              onClick={() => shareOnTwitter(cert)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Twitter className="w-4 h-4" />
                              Twitter
                            </Button>
                            <Button
                              onClick={() => shareViaEmail(cert)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Mail className="w-4 h-4" />
                              Email
                            </Button>
                            <Button
                              onClick={() => copyShareLink(cert)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              {copiedLink ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copy Link
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Button
                            onClick={() => {
                              setSelectedCertificate(cert);
                              setShowCertificateModal(true);
                            }}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            {!achievements || achievements.length === 0 ? (
              <Alert>
                <AlertDescription>No achievements yet. Keep working towards your goals!</AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((ach: any) => (
                  <Card key={ach.id} className="bg-white border-0 shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{ach.title}</CardTitle>
                          <CardDescription>{ach.category}</CardDescription>
                        </div>
                        <Trophy className="w-6 h-6 text-teal-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-4">{ach.description}</p>
                      <Badge variant="outline">{ach.status}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            {!badges || badges.length === 0 ? (
              <Alert>
                <AlertDescription>No badges yet. Earn achievements to unlock badges!</AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge: any) => (
                  <Card key={badge.id} className="bg-white border-0 shadow-sm text-center">
                    <CardContent className="pt-6">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <p className="font-semibold text-slate-900">{badge.name}</p>
                      <p className="text-xs text-slate-600 mt-2">{badge.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Certificate Modal */}
        <Dialog open={showCertificateModal} onOpenChange={setShowCertificateModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Certificate Preview</DialogTitle>
              <DialogDescription>Your achievement certificate with QR code for verification</DialogDescription>
            </DialogHeader>
            {selectedCertificate && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-lg border-2 border-amber-200">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-2">🏆</div>
                  <h2 className="text-2xl font-bold text-amber-900">Certificate of Achievement</h2>
                  <p className="text-amber-700 italic">{selectedCertificate.title}</p>
                </div>

                <div className="text-center mb-6">
                  <p className="text-slate-700 mb-2">This certificate is proudly presented to</p>
                  <p className="text-xl font-bold text-amber-900 border-b-2 border-amber-300 pb-2">
                    {user?.name || "Valued Client"}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <p className="text-slate-700 mb-2">For successfully achieving</p>
                  <p className="font-bold text-lg text-amber-900">{selectedCertificate.title}</p>
                  <p className="text-slate-600">with a completion rate of</p>
                  <p className="text-4xl font-bold text-amber-600 my-2">{selectedCertificate.completionPercentage}%</p>
                </div>

                {/* QR Code Placeholder */}
                <div className="text-center mb-6">
                  <div className="inline-block bg-white p-4 rounded border-2 border-amber-300">
                    <div className="w-32 h-32 bg-slate-200 flex items-center justify-center rounded">
                      <div className="text-center">
                        <QrCode className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">QR Code</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">Scan to Verify</p>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-600 border-t pt-4">
                  <p>Certificate #{selectedCertificate.certificateNumber}</p>
                  <p>Issued: {new Date(selectedCertificate.issuedDate).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button className="flex-1" variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button className="flex-1" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
