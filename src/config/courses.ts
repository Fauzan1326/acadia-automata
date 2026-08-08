import type { Course } from "@/lib/types";

/**
 * CENTRALIZED COURSE CONFIGURATION.
 *
 * Maps courseName -> EXISTING Google Sheet tab name in the Enrollment Records
 * spreadsheet. Never hardcode tab names anywhere else in the codebase.
 *
 * NOTE: tab names below are placeholders that must be confirmed against the real
 * spreadsheet before enabling live integration. If a tab is missing, the sync
 * engine must NOT write data — it surfaces an actionable error instead.
 */
export const COURSE_CONFIG: Course[] = [
  { id: "c01", courseName: "Python Programming", sheetTabName: "Python", tabPresent: true },
  { id: "c02", courseName: "Java Programming", sheetTabName: "Java", tabPresent: true },
  { id: "c03", courseName: "C Programming", sheetTabName: "C Programming", tabPresent: true },
  { id: "c04", courseName: "C++ Programming", sheetTabName: "CPP", tabPresent: true },
  { id: "c05", courseName: "Web Development", sheetTabName: "Web Development", tabPresent: true },
  { id: "c06", courseName: "Data Structures", sheetTabName: "DSA", tabPresent: true },
  { id: "c07", courseName: "Database Management", sheetTabName: "DBMS", tabPresent: true },
  { id: "c08", courseName: "Machine Learning", sheetTabName: "ML", tabPresent: true },
  { id: "c09", courseName: "Artificial Intelligence", sheetTabName: "AI", tabPresent: true },
  { id: "c10", courseName: "Cyber Security", sheetTabName: "Cyber Security", tabPresent: true },
  { id: "c11", courseName: "Cloud Computing", sheetTabName: "Cloud", tabPresent: true },
  { id: "c12", courseName: "Internet of Things", sheetTabName: "IoT", tabPresent: true },
  { id: "c13", courseName: "Android Development", sheetTabName: "Android", tabPresent: false },
  { id: "c14", courseName: "MATLAB Fundamentals", sheetTabName: "MATLAB", tabPresent: true },
];

export function getCourse(courseId: string | null): Course | undefined {
  if (!courseId) return undefined;
  return COURSE_CONFIG.find((c) => c.id === courseId);
}

export function courseName(courseId: string | null): string {
  return getCourse(courseId)?.courseName ?? "Unassigned";
}

/** Existing sheet headers — documented for reference, never modified by the app. */
export const SHEET_HEADERS = {
  formResponses: [
    "Timestamp",
    "Email address",
    "Email ID (.mhssce.ac.in)",
    "Full Name",
    "Branch",
    "Year Of Study",
    "CPRN NO.",
    "Courses",
    "Labs",
  ],
  enrollmentRecords: [
    "Email ID",
    "Full Name",
    "Branch",
    "Year Of Study",
    "CPRN NO.",
    "Start Date",
    "Completion Date",
    "Certification Sent",
  ],
} as const;

/** Configuration placeholders — supply via server-side secrets before going live. */
export const INTEGRATION_PLACEHOLDERS = {
  formResponseSpreadsheetId: "<FORM_RESPONSE_SPREADSHEET_ID>",
  enrollmentRecordsSpreadsheetId: "<ENROLLMENT_RECORDS_SPREADSHEET_ID>",
  certificateSignerEndpoint: "<EXISTING_CERTIFICATE_SIGNER_ENDPOINT>",
  gmailSenderAddress: "<GMAIL_SENDER_ADDRESS>",
} as const;
