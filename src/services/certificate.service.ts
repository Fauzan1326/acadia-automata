/**
 * Certificate service boundary.
 *
 * Signing is delegated to the EXISTING Next.js certificate signer through the
 * adapter below. This app must never implement its own signing logic.
 */
import { MOCK_CERTIFICATES } from "@/lib/mock-data";
import type { Certificate, CertificateMatch } from "@/lib/types";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const MAX_ZIP_BYTES = 200 * 1024 * 1024;
const UNSAFE_NAME = /(^|\/)\.\.(\/|$)|^\/|\\|\.(exe|sh|bat|js|php)$/i;

export interface ZipValidation {
  ok: boolean;
  message?: string;
}

/** Client-side pre-flight validation. Server repeats every check before extraction. */
export function validateZipFile(file: File): ZipValidation {
  if (!file.name.toLowerCase().endsWith(".zip")) {
    return { ok: false, message: "The uploaded file is not a ZIP archive." };
  }
  if (file.size === 0) {
    return { ok: false, message: "The uploaded ZIP is empty or corrupted." };
  }
  if (file.size > MAX_ZIP_BYTES) {
    return { ok: false, message: "The ZIP is larger than the 200 MB limit." };
  }
  if (UNSAFE_NAME.test(file.name)) {
    return { ok: false, message: "This file name is not allowed." };
  }
  return { ok: true };
}

export interface ProcessingSummary {
  totalFiles: number;
  matched: number;
  reviewRequired: number;
  failed: number;
  signed: number;
  sent: number;
}

/** Server-side: validate ZIP, extract PDFs, match, and queue uncertain items. */
export async function processZip(file: File): Promise<ProcessingSummary> {
  await delay(1200);
  void file;
  return { totalFiles: 120, matched: 112, reviewRequired: 6, failed: 2, signed: 108, sent: 104 };
}

export async function getCertificates(): Promise<Certificate[]> {
  await delay();
  return MOCK_CERTIFICATES;
}

export async function getReviewQueue(): Promise<Certificate[]> {
  await delay();
  return MOCK_CERTIFICATES.filter((c) => c.matchState !== "MATCHED");
}

export async function extractStudentName(certificateId: string): Promise<string> {
  await delay(150);
  return MOCK_CERTIFICATES.find((c) => c.id === certificateId)?.extractedName ?? "";
}

export async function matchCertificate(certificateId: string): Promise<CertificateMatch> {
  await delay(200);
  const cert = MOCK_CERTIFICATES.find((c) => c.id === certificateId);
  return {
    certificateId,
    candidateStudentIds: cert?.studentId ? [cert.studentId] : [],
    confidence: cert?.matchState === "MATCHED" ? 1 : 0.4,
    state: cert?.matchState ?? "NO MATCH",
  };
}

export async function sendToReviewQueue(certificateId: string, reason: string): Promise<void> {
  await delay(150);
  void certificateId;
  void reason;
}

/** Adapter to the EXISTING certificate signer — do not reimplement signing here. */
export async function signCertificate(certificateId: string): Promise<{ signed: true }> {
  await delay(800);
  void certificateId;
  return { signed: true };
}

export async function prepareCertificate(certificateId: string): Promise<{ previewUrl: string }> {
  await delay(300);
  return { previewUrl: `/preview/${certificateId}` };
}
