/**
 * Shared domain types.
 * The system is an automation layer over EXISTING Google Sheets — these types
 * mirror the existing sheet headers and must not imply schema changes.
 */

export type EnrollmentStatus =
  | "Pending Registration"
  | "Pending Enrollment"
  | "Emails Copied"
  | "Enrollment Email Sent"
  | "Waiting for Completion"
  | "Completed";

export type CertificateStatus =
  | "Not Started"
  | "Certificate Uploaded"
  | "Certificate Pending Review"
  | "Certificate Signed"
  | "Certificate Sent";

export type StatusValue = EnrollmentStatus | CertificateStatus;

/** Mirrors the READ-ONLY Google Form response sheet headers. */
export interface Registration {
  id: string;
  timestamp: string;
  emailAddress: string;
  collegeEmailId: string;
  fullName: string;
  branch: string;
  yearOfStudy: string;
  cprnNo: string;
  courses: string;
  labs: string;
  syncState: "new" | "synced" | "duplicate" | "failed";
}

/** Mirrors the existing Enrollment Records course-tab headers. */
export interface Student {
  id: string;
  collegeEmailId: string;
  fullName: string;
  branch: string;
  yearOfStudy: string;
  cprnNo: string;
  courseId: string;
  startDate: string | null;
  completionDate: string | null;
  certificationSent: "Yes" | "No";
  enrollmentStatus: EnrollmentStatus;
  certificateStatus: CertificateStatus;
}

export interface Course {
  id: string;
  courseName: string;
  sheetTabName: string;
  tabPresent: boolean;
}

export interface CourseStats {
  courseId: string;
  totalStudents: number;
  pendingEnrollment: number;
  completed: number;
  certificatesSent: number;
}

export interface EnrollmentBatch {
  id: string;
  courseId: string;
  studentCount: number;
  createdBy: string;
  createdAt: string;
  status: "Emails Copied" | "Awaiting Portal Confirmation" | "Enrollment Email Sent" | "Closed";
}

export type CertificateMatchState =
  | "MATCHED"
  | "AMBIGUOUS"
  | "NO MATCH"
  | "INVALID FILE"
  | "DUPLICATE CERTIFICATE";

export interface Certificate {
  id: string;
  fileName: string;
  extractedName: string;
  courseId: string | null;
  studentId: string | null;
  matchState: CertificateMatchState;
  reason?: string | undefined;
  uploadedAt: string;
  signed: boolean;
  sent: boolean;
}

export interface CertificateMatch {
  certificateId: string;
  candidateStudentIds: string[];
  confidence: number;
  state: CertificateMatchState;
}

export type EmailType = "Enrollment" | "Certificate";
export type EmailStatus = "Sent" | "Failed" | "Pending" | "Retrying";

export interface EmailLog {
  id: string;
  recipient: string;
  studentName: string;
  studentId: string;
  type: EmailType;
  timestamp: string;
  status: EmailStatus;
  errorMessage?: string | undefined;
}

export type ActivityModule =
  | "Synchronization"
  | "Enrollment Manager"
  | "Email Manager"
  | "Certificate Manager"
  | "Review Queue"
  | "Settings";

export interface ActivityLog {
  id: string;
  time: string;
  admin: string;
  action: string;
  module: ActivityModule;
  student: string | null;
  result: "Success" | "Failed" | "Warning";
}

export interface SyncResult {
  id: string;
  timestamp: string;
  admin: string;
  newRecords: number;
  duplicates: number;
  failures: number;
  reviewRequired: number;
  status: "Success" | "Partial" | "Failed";
}

export type IntegrationState = "CONNECTED" | "DISCONNECTED" | "NOT CONFIGURED";

export interface SystemStatus {
  googleSheets: IntegrationState;
  gmail: IntegrationState;
  certificateSigner: IntegrationState;
  mockMode: boolean;
}
