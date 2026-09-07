import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Award, Download, CheckCircle, ShieldCheck } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

interface CertificateGeneratorProps {
  courseTitle?: string;
  completionDate?: string;
  triggerClassName?: string;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  courseTitle = "Reactive Accelerator: Modern Full-Stack Masterclass",
  completionDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  triggerClassName,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const certRef = useRef<HTMLDivElement | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const studentName = user ? `${user.firstName} ${user.lastName}` : "Student Name";
  const certId = `NEX-${Math.floor(100000 + Math.random() * 900000)}`;
  const verifyUrl = `https://nexurahub.com/verify/${certId}`;

  useEffect(() => {
    let isMounted = true;
    import("qrcode")
      .then((QRCodeModule) => {
        const QRCode = QRCodeModule.default || QRCodeModule;
        return QRCode.toDataURL(verifyUrl, { width: 120, margin: 1 });
      })
      .then((url) => {
        if (isMounted) setQrCodeUrl(url);
      })
      .catch((err) => console.error("QR Code Error:", err));

    return () => {
      isMounted = false;
    };
  }, [verifyUrl]);

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    setIsGenerating(true);

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(`Certificate_${certId}.pdf`);
    } catch (err) {
      console.error("PDF Export failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className={cn(
            "h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm font-medium rounded-lg",
            triggerClassName
          )}
        >
          <Award className="h-3.5 w-3.5" />
          View Certificate
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Verified Completion Certificate
          </DialogTitle>
          <Button
            size="sm"
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="bg-sky-600 hover:bg-sky-700 gap-1.5"
          >
            <Download className="h-4 w-4" />
            {isGenerating ? "Exporting PDF..." : "Download PDF"}
          </Button>
        </DialogHeader>

        {/* Certificate Card Content for Canvas rendering */}
        <div className="flex justify-center my-4 overflow-x-auto">
          <div
            ref={certRef}
            className="w-[842px] h-[595px] bg-slate-950 text-slate-100 p-10 relative flex flex-col justify-between border-8 border-amber-500/80 shadow-2xl font-serif"
            style={{ minWidth: "842px" }}
          >
            {/* Background Branding Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-950 to-slate-950 pointer-events-none" />

            {/* Certificate Header */}
            <div className="relative z-10 flex justify-between items-start border-b border-amber-500/30 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-500 to-sky-500 flex items-center justify-center font-bold text-xl text-black shadow-lg">
                  NH
                </div>
                <div>
                  <h2 className="text-2xl font-sans font-extrabold tracking-wider uppercase text-amber-400">
                    Nexura Hub
                  </h2>
                  <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">
                    Academy of Advanced Engineering
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-amber-400/80">
                <p>CERTIFICATE ID: {certId}</p>
                <p className="text-slate-400 mt-0.5">ISSUED: {completionDate}</p>
              </div>
            </div>

            {/* Certificate Main Title & Student Details */}
            <div className="relative z-10 text-center my-auto space-y-4">
              <p className="text-sm font-sans tracking-widest text-slate-300 uppercase">
                THIS IS PROUDLY PRESENTED TO
              </p>

              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 tracking-wide underline decoration-amber-500/40 decoration-1 underline-offset-8">
                {studentName}
              </h1>

              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-sans pt-2">
                For successfully completing all requirements, modules, and practical projects in
              </p>

              <h3 className="text-2xl font-bold text-sky-400 font-sans tracking-tight">
                {courseTitle}
              </h3>
            </div>

            {/* Certificate Footer & Signatures */}
            <div className="relative z-10 flex justify-between items-end border-t border-amber-500/30 pt-6">
              <div className="flex items-center gap-4">
                {qrCodeUrl && (
                  <img
                    src={qrCodeUrl}
                    alt="Certificate Verification QR Code"
                    className="w-20 h-20 bg-white p-1 rounded-lg border border-amber-500/50 shadow"
                  />
                )}
                <div className="text-xs font-mono text-slate-400 space-y-1">
                  <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    Verified Authenticity
                  </div>
                  <p>Scan to verify credential</p>
                </div>
              </div>

              <div className="text-center">
                <div className="font-serif italic text-lg text-amber-300 border-b border-slate-600 pb-1 px-6">
                  Tapas Adhikary
                </div>
                <p className="text-xs font-sans text-slate-400 mt-1 uppercase tracking-wider">
                  Lead Instructor & Program Chair
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateGenerator;
