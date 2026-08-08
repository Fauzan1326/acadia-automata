/**
 * Google Sheets service boundary.
 *
 * MOCK MODE: returns local mock data. No credentials required to preview the UI.
 * PRODUCTION: replace the mock branches with Google Sheets API calls executed in
 * server functions only (never from UI components).
 *
 * HARD RULES enforced by this boundary:
 *  - The Google Form response sheet is READ-ONLY (no write methods exist for it).
 *  - Existing course tabs and headers are never created, renamed, or altered.
 *  - If a mapped tab is missing, writes are refused with an actionable error.
 */
import { COURSE_CONFIG, getCourse } from "@/config/courses";
import { MOCK_REGISTRATIONS, MOCK_STUDENTS, MOCK_SYNC_HISTORY } from "@/lib/mock-data";
import type { Registration, Student, SyncResult } from "@/lib/types";

export const MOCK_MODE = true;

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export class IntegrationError extends Error {
  constructor(public readonly userMessage: string) {
    super(userMessage);
    this.name = "IntegrationError";
  }
}

/** READ-ONLY: all responses from the Google Form response sheet. */
export async function getFormResponses(): Promise<Registration[]> {
  await delay();
  return MOCK_REGISTRATIONS;
}

/** READ-ONLY: responses not yet synced into the Enrollment Records spreadsheet. */
export async function getNewResponses(): Promise<Registration[]> {
  await delay();
  return MOCK_REGISTRATIONS.filter((r) => r.syncState === "new");
}

export async function checkDuplicate(collegeEmailId: string, courseId: string): Promise<boolean> {
  await delay(80);
  return MOCK_STUDENTS.some(
    (s) => s.collegeEmailId === collegeEmailId && s.courseId === courseId,
  );
}

/** Reads one existing course tab. */
export async function getCourseStudents(courseId: string): Promise<Student[]> {
  await delay();
  return MOCK_STUDENTS.filter((s) => s.courseId === courseId);
}

export async function getAllStudents(): Promise<Student[]> {
  await delay();
  return MOCK_STUDENTS;
}

/** Appends rows to an EXISTING course tab. Refuses if the tab is absent. */
export async function appendToCourseTab(
  courseId: string,
  rows: Registration[],
): Promise<{ appended: number }> {
  const course = getCourse(courseId);
  if (!course) {
    throw new IntegrationError("This course is not mapped to a spreadsheet tab yet.");
  }
  if (!course.tabPresent) {
    throw new IntegrationError(
      `The tab "${course.sheetTabName}" was not found in the Enrollment Records spreadsheet. No data was written. Please check the course mapping in Settings.`,
    );
  }
  await delay();
  return { appended: rows.length };
}

export async function updateCompletionDate(studentId: string, date: string): Promise<void> {
  await delay(120);
  void studentId;
  void date;
}

export async function markCertificationSent(studentId: string): Promise<void> {
  await delay(120);
  void studentId;
}

export async function getSyncHistory(): Promise<SyncResult[]> {
  await delay();
  return MOCK_SYNC_HISTORY;
}

/** Full sync workflow: read responses -> duplicate check -> course mapping -> append. */
export async function runSynchronization(): Promise<SyncResult> {
  await delay(900);
  const nw = MOCK_REGISTRATIONS.filter((r) => r.syncState === "new").length;
  return {
    id: `SY-${Math.floor(Math.random() * 900 + 119)}`,
    timestamp: new Date().toISOString(),
    admin: "Admin",
    newRecords: nw,
    duplicates: MOCK_REGISTRATIONS.filter((r) => r.syncState === "duplicate").length,
    failures: MOCK_REGISTRATIONS.filter((r) => r.syncState === "failed").length,
    reviewRequired: 0,
    status: "Partial",
  };
}

export const MAPPED_COURSES = COURSE_CONFIG;
