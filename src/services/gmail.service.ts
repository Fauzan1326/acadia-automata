/**
 * Gmail service boundary.
 * MOCK MODE only — production sends via the Gmail API from server functions.
 * Credentials are never read in the browser.
 */
import { MOCK_EMAILS } from "@/lib/mock-data";
import type { EmailLog } from "@/lib/types";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export async function getEmailLogs(): Promise<EmailLog[]> {
  await delay();
  return MOCK_EMAILS;
}

export async function sendEnrollmentEmail(studentIds: string[]): Promise<{ sent: number }> {
  await delay(700);
  return { sent: studentIds.length };
}

export async function sendCertificateEmail(certificateId: string): Promise<{ ok: true }> {
  await delay(600);
  void certificateId;
  return { ok: true };
}

export async function retryEmail(emailId: string): Promise<{ ok: true }> {
  await delay(500);
  void emailId;
  return { ok: true };
}
