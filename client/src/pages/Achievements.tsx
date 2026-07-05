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
import { Download, Printer, Eye, Trophy, Award, Zap } from "lucide-react";

export default function Achievements() {
  const { user } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

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

  const generateCertificate = trpc.achievements.generateCertificate.useMutation();
  const trackDownload = trpc.achievements.trackDownload.useMutation();
  const trackPrint = trpc.achievements.trackPrint.useMutation();

  const handleGenerateCertificate = async (achievementId: number) => {
    try {
      await generateCertificate.mutateAsync({
        achievementId,
        clientId: user?.id || 0,
      });
      // Refetch certificates
    } catch (error) {
      console.error("Failed to generate certificate:", error);
    }
  };

  const handleDownload = async (certificate: any) => {
    try {
      await trackDownload.mutateAsync({ certificateId: certificate.id });
      // Open PDF in new window
      window.open(certificate.pdfUrl, "_blank");
    } catch (error) {
      console.error("Failed to download certificate:", error);
    }
  };

  const handlePrint = async (certificate: any) => {
    try {
      await trackPrint.mutateAsync({ certificateId: certificate.id });
      // Print the certificate
      window.print();
    } catch (error) {
      console.error("Failed to print certificate:", error);
    }
  };

  const handleViewCertificate = (certificate: any) => {
    setSelectedCertificate(certificate);
    setShowCertificateModal(true);
  };

  const getAchievementIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      goal_completion: <Trophy className="w-5 h-5" />,
      milestone_reached: <Award className="w-5 h-5" />,
      sobriety_milestone: <Zap className="w-5 h-5" />,
      employment_secured: <Award className="w-5 h-5" />,
      housing_secured: <Trophy className="w-5 h-5" />,
      family_reunification: <Trophy className="w-5 h-5" />,
      court_compliance: <Award className="w-5 h-5" />,
      education_completed: <Award className="w-5 h-5" />,
      recovery_program_completed: <Zap className="w-5 h-5" />,
      custom: <Trophy className="w-5 h-5" />,
    };
    return icons[type] || <Trophy className="w-5 h-5" />;
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800";
    if (percentage >= 78) return "bg-blue-100 text-blue-800";
    if (percentage >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Your Achievements</h1>
        <p className="text-gray-600">
          Celebrate your progress and earn certificates for reaching 78% goal completion
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements?.length || 0}</div>
            <p className="text-xs text-gray-600 mt-1">milestones reached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates?.length || 0}</div>
            <p className="text-xs text-gray-600 mt-1">printable certificates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Badges Unlocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{badges?.length || 0}</div>
            <p className="text-xs text-gray-600 mt-1">achievement badges</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="certificates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-4">
          {certificatesLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : certificates && certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert: any) => (
                <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{cert.title}</CardTitle>
                        <CardDescription>{cert.description}</CardDescription>
                      </div>
                      <Badge className={getCompletionColor(cert.completionPercentage)}>
                        {cert.completionPercentage}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Certificate #</p>
                        <p className="font-mono text-sm">{cert.certificateNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Issued Date</p>
                        <p className="text-sm">{new Date(cert.issuedDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewCertificate(cert)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(cert)}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePrint(cert)}
                        className="flex-1"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Views: {cert.viewCount} | Downloads: {cert.downloadCount} | Prints: {cert.printCount}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No certificates yet. Reach 78% completion on your goals to earn certificates!
              </AlertDescription>
            </Alert>
          )}

          {/* Eligible for Certification */}
          {eligibleAchievements && eligibleAchievements.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-base">Ready for Certification</CardTitle>
                <CardDescription>These achievements are eligible for certificates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {eligibleAchievements.map((achievement: any) => (
                  <div key={achievement.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.completionPercentage}% complete</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleGenerateCertificate(achievement.id)}
                      disabled={generateCertificate.isPending}
                    >
                      {generateCertificate.isPending ? <Spinner /> : "Generate"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          {achievementsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : achievements && achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.map((achievement: any) => (
                <Card key={achievement.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-2xl">{getAchievementIcon(achievement.achievementType)}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getCompletionColor(achievement.completionPercentage)}>
                          {achievement.completionPercentage}%
                        </Badge>
                        {achievement.isEligibleForCertificate && (
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            <Trophy className="w-3 h-3 mr-1" />
                            Certified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No achievements yet. Start working on your goals to earn achievements!
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-4">
          {badges && badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge: any) => (
                <Card key={badge.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-3">{badge.iconUrl || "🏆"}</div>
                    <h3 className="font-semibold text-sm">{badge.title}</h3>
                    <p className="text-xs text-gray-600 mt-2">{badge.description}</p>
                    <p className="text-xs text-gray-500 mt-3">
                      Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No badges yet. Complete achievements to unlock badges!
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      {/* Certificate Preview Modal */}
      <Dialog open={showCertificateModal} onOpenChange={setShowCertificateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCertificate?.title}</DialogTitle>
            <DialogDescription>
              Certificate #{selectedCertificate?.certificateNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedCertificate && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold mb-2">Certificate of Achievement</h2>
                <p className="text-xl mb-6">{selectedCertificate.title}</p>
                <p className="text-lg mb-4">
                  Presented to <strong>{selectedCertificate.clientName}</strong>
                </p>
                <p className="text-base mb-6">{selectedCertificate.description}</p>
                <div className="text-4xl font-bold text-blue-600 mb-6">
                  {selectedCertificate.completionPercentage}%
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Issued: {new Date(selectedCertificate.issuedDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  Verification Code: {selectedCertificate.verificationCode}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownload(selectedCertificate)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => handlePrint(selectedCertificate)}
                  variant="outline"
                  className="flex-1"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
