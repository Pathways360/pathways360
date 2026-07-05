// Certificate PDF generation module
import QRCode from 'qrcode';

interface CertificateData {
  clientName: string;
  title: string;
  description: string;
  completionPercentage: number;
  certificateNumber: string;
  verificationCode: string;
  issuedDate: Date;
  achievementType: string;
}

export async function generateCertificatePDF(data: CertificateData): Promise<string> {
  // Generate QR code for verification
  const verificationUrl = `https://pathways360.com/verify-certificate/${data.certificateNumber}?code=${data.verificationCode}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  // Generate HTML certificate with QR code
  const html = generateCertificateHTML(data, qrCodeDataUrl);

  // Convert HTML to PDF using WeasyPrint (via server-side rendering)
  const pdfBuffer = await htmlToPdf(html);

  // Upload to S3 (placeholder - in production use actual storage)
  // For now, return a placeholder URL
  return `https://certificates.pathways360.com/${data.certificateNumber}.pdf`;
}

function generateCertificateHTML(data: CertificateData, qrCodeDataUrl?: string): string {
  const achievementTitles: Record<string, string> = {
    goal_completion: "Goal Completion",
    milestone_reached: "Milestone Achievement",
    sobriety_milestone: "Sobriety Milestone",
    employment_secured: "Employment Secured",
    housing_secured: "Housing Secured",
    family_reunification: "Family Reunification",
    court_compliance: "Court Compliance",
    education_completed: "Education Completed",
    recovery_program_completed: "Recovery Program Completed",
    custom: "Achievement",
  };

  const achievementColors: Record<string, string> = {
    goal_completion: "#2c5aa0",
    milestone_reached: "#d4a574",
    sobriety_milestone: "#27ae60",
    employment_secured: "#3498db",
    housing_secured: "#e74c3c",
    family_reunification: "#9b59b6",
    court_compliance: "#f39c12",
    education_completed: "#1abc9c",
    recovery_program_completed: "#16a085",
    custom: "#34495e",
  };

  const borderColor = achievementColors[data.achievementType] || "#2c5aa0";
  const formattedDate = data.issuedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Georgia', serif;
      background: white;
    }
    
    .certificate {
      width: 11in;
      height: 8.5in;
      margin: 0 auto;
      padding: 60px;
      background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
      border: 8px solid ${borderColor};
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      page-break-after: avoid;
    }
    
    .certificate::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 2px solid ${borderColor};
      border-radius: 15px;
      pointer-events: none;
      opacity: 0.3;
    }
    
    .header {
      position: relative;
      z-index: 1;
      margin-bottom: 20px;
    }
    
    .logo {
      font-size: 14px;
      color: ${borderColor};
      font-weight: bold;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    .title {
      font-size: 48px;
      font-weight: bold;
      color: ${borderColor};
      margin: 20px 0;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    
    .subtitle {
      font-size: 24px;
      color: #333;
      font-style: italic;
      margin-bottom: 30px;
    }
    
    .content {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 40px 0;
    }
    
    .recipient {
      font-size: 28px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 20px 0;
      text-decoration: underline;
      text-decoration-style: dotted;
      text-decoration-color: ${borderColor};
    }
    
    .achievement-text {
      font-size: 18px;
      color: #333;
      line-height: 1.8;
      margin: 30px 0;
    }
    
    .percentage {
      font-size: 36px;
      font-weight: bold;
      color: ${borderColor};
      margin: 20px 0;
    }
    
    .footer {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid ${borderColor};
    }
    
    .signature-block {
      text-align: center;
      flex: 1;
    }
    
    .signature-line {
      border-top: 2px solid #333;
      width: 150px;
      margin: 10px auto;
    }
    
    .signature-title {
      font-size: 12px;
      color: #333;
      margin-top: 5px;
    }
    
    .certificate-info {
      text-align: center;
      font-size: 11px;
      color: #666;
      margin-top: 10px;
    }
    
    .verification {
      font-size: 10px;
      color: #999;
      margin-top: 5px;
    }
    
    .qr-code {
      text-align: center;
      margin: 20px 0;
    }
    
    .qr-code img {
      width: 120px;
      height: 120px;
      border: 2px solid ${borderColor};
      padding: 8px;
      background: white;
    }
    
    .qr-label {
      font-size: 10px;
      color: #666;
      margin-top: 5px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">🏆 Pathways 360</div>
      <div class="title">Certificate of Achievement</div>
      <div class="subtitle">${achievementTitles[data.achievementType] || "Achievement"}</div>
    </div>
    
    <div class="content">
      <div style="font-size: 16px; color: #666;">This certificate is proudly presented to</div>
      <div class="recipient">${data.clientName}</div>
      
      <div class="achievement-text">
        For successfully achieving <strong>${data.title}</strong><br>
        ${data.description ? `<em>${data.description}</em><br>` : ""}
        with a completion rate of
      </div>
      
      <div class="percentage">${data.completionPercentage}%</div>
      
      <div class="achievement-text">
        This achievement demonstrates exceptional commitment to personal growth,<br>
        resilience, and dedication to life restoration and positive change.
      </div>
    </div>
    
    <div class="footer">
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-title">Issued By</div>
        <div class="signature-title" style="font-weight: bold; margin-top: 5px;">Pathways 360</div>
      </div>
      
      <div style="text-align: center; flex: 1;">
        ${qrCodeDataUrl ? `<div class="qr-code">
          <img src="${qrCodeDataUrl}" alt="Verification QR Code" />
          <div class="qr-label">Scan to Verify</div>
        </div>` : ''}
        <div class="certificate-info">
          <div>Certificate #: ${data.certificateNumber}</div>
          <div>Issued: ${formattedDate}</div>
          <div class="verification">Verification Code: ${data.verificationCode}</div>
        </div>
      </div>
      
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-title">Program Coordinator</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

async function htmlToPdf(html: string): Promise<Buffer> {
  // This would typically use a library like puppeteer or weasyprint
  // For now, we'll return a placeholder that can be replaced with actual PDF generation
  // In production, you'd use: const pdf = await page.pdf({ format: 'A4' });
  
  // Placeholder: return empty buffer (in production, use actual PDF generation)
  return Buffer.from("PDF_PLACEHOLDER");
}
