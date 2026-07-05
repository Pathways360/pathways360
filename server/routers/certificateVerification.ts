import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getCertificate } from "../db";

export const certificateVerificationRouter = router({
  // Public endpoint to verify certificate by number and code
  verifyCertificate: publicProcedure
    .input(
      z.object({
        certificateNumber: z.string(),
        verificationCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        // In a real implementation, you would query the database for the certificate
        // For now, we'll return a mock verification response
        // const certificate = await db.query.certificates.findFirst({
        //   where: and(
        //     eq(certificates.certificateNumber, input.certificateNumber),
        //     eq(certificates.verificationCode, input.verificationCode)
        //   )
        // });

        // Mock response for demonstration
        const isValid = input.verificationCode.length > 0;

        if (!isValid) {
          return {
            valid: false,
            message: "Invalid verification code",
            certificate: null,
          };
        }

        return {
          valid: true,
          message: "Certificate verified successfully",
          certificate: {
            certificateNumber: input.certificateNumber,
            clientName: "John Doe",
            title: "Goal Completion",
            description: "Successfully completed 85% of recovery goals",
            completionPercentage: 85,
            issuedDate: new Date(),
            issuerName: "Pathways 360",
            issuerTitle: "Program Coordinator",
          },
        };
      } catch (error) {
        return {
          valid: false,
          message: "Error verifying certificate",
          certificate: null,
        };
      }
    }),

  // Get certificate details by ID (public, for sharing)
  getCertificateDetails: publicProcedure
    .input(z.object({ certificateId: z.number() }))
    .query(async ({ input }) => {
      try {
        const cert = await getCertificate(input.certificateId);
        if (cert.length === 0) {
          return { found: false, certificate: null };
        }
        return { found: true, certificate: cert[0] };
      } catch (error) {
        return { found: false, certificate: null };
      }
    }),
});
