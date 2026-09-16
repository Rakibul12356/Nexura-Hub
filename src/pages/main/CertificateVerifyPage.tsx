import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { playerService } from "@/services/paymentService";
import { ShieldCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CertificateVerifyPage: React.FC = () => {
  const { publicId = "" } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["certificate-verify", publicId],
    queryFn: () => playerService.verifyCertificate(publicId),
    enabled: Boolean(publicId),
    retry: false,
  });

  return (
    <div className="container py-16 max-w-lg mx-auto">
      <div className="border rounded-2xl bg-card p-8 shadow-sm text-center space-y-4">
        <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Certificate Verification</h1>
        {isLoading && <p className="text-sm text-muted-foreground">Checking certificate…</p>}
        {isError && (
          <p className="text-sm text-destructive">This certificate ID is invalid or not issued yet.</p>
        )}
        {data && (
          <div className="space-y-2">
            <Award className="h-8 w-8 text-amber-500 mx-auto" />
            <p className="font-semibold">{data.studentName}</p>
            <p className="text-sm text-muted-foreground">completed</p>
            <p className="font-bold">{data.courseTitle}</p>
            <p className="text-xs text-muted-foreground">{data.completionDate}</p>
            <p className="font-mono text-xs">ID: {data.publicId}</p>
          </div>
        )}
        <Button asChild variant="outline">
          <Link to="/">Back to Nexura Hub</Link>
        </Button>
      </div>
    </div>
  );
};

export default CertificateVerifyPage;
