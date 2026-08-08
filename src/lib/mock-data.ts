import { COURSE_CONFIG } from "@/config/courses";
import type {
  ActivityLog,
  Certificate,
  CourseStats,
  EmailLog,
  EnrollmentBatch,
  Registration,
  Student,
  SyncResult,
  SystemStatus,
} from "@/lib/types";

/**
 * MOCK DATA ONLY — deterministic, generated locally.
 * Replaced by real Google Sheets / Gmail services in production mode.
 * No real credentials, spreadsheet IDs, or student data here.
 */

const FIRST = [
  "Fauzan",
  "Aisha",
  "Rohan",
  "Sana",
  "Imran",
  "Neha",
  "Zaid",
  "Priya",
  "Arman",
  "Fatima",
  "Karan",
  "Mariam",
  "Yusuf",
  "Ananya",
  "Salman",
  "Diya",
  "Hamza",
  "Tanvi",
  "Owais",
  "Ishita",
];
const LAST = [
  "Ansari",
  "Shaikh",
  "Deshmukh",
  "Khan",
  "Patil",
  "Qureshi",
  "Sharma",
  "Merchant",
  "Naik",
  "Siddiqui",
  "Jadhav",
  "Momin",
  "Kulkarni",
  "Rane",
];
const BRANCHES = ["Computer", "IT", "AI & DS", "EXTC", "Mechanical", "Civil", "Electrical"];
const YEARS = ["First Year", "Second Year", "Third Year", "Final Year"];

function seeded(n: number) {
  return (n * 9301 + 49297) % 233280;
}
function pick<T>(arr: T[], n: number): T {
  return arr[seeded(n) % arr.length]!;
}
function iso(daysAgo: number, hour = 10, minute = 15) {
  const d = new Date(Date.UTC(2026, 7, 8, hour, minute, 0));
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString();
}
function dateOnly(daysAgo: number) {
  return iso(daysAgo).slice(0, 10);
}

const ENROLLMENT_FLOW = [
  "Pending Enrollment",
  "Emails Copied",
  "Enrollment Email Sent",
  "Waiting for Completion",
  "Completed",
] as const;

const CERT_FLOW = [
  "Not Started",
  "Certificate Uploaded",
  "Certificate Pending Review",
  "Certificate Signed",
  "Certificate Sent",
] as const;

export const MOCK_STUDENTS: Student[] = Array.from({ length: 148 }, (_, i) => {
  const first = pick(FIRST, i + 3);
  const last = pick(LAST, i + 7);
  const course = COURSE_CONFIG[seeded(i + 11) % COURSE_CONFIG.length]!;
  const stage = seeded(i + 17) % 5;
  const enrollmentStatus = ENROLLMENT_FLOW[stage]!;
  const certStage = stage === 4 ? 4 : stage === 3 ? (seeded(i + 23) % 4) : 0;
  const certificateStatus = CERT_FLOW[certStage]!;
  const completed = enrollmentStatus === "Completed";
  const name = `${first} ${last}`;
  return {
    id: `S${String(1000 + i)}`,
    collegeEmailId: `${first.toLowerCase()}.${last.toLowerCase()}${i}@mhssce.ac.in`,
    fullName: name,
    branch: pick(BRANCHES, i + 5),
    yearOfStudy: pick(YEARS, i + 13),
    cprnNo: `CPRN${String(2026000 + i * 7)}`,
    courseId: course.id,
    startDate: stage >= 2 ? dateOnly(40 - (i % 30)) : null,
    completionDate: completed ? dateOnly(5 + (i % 10)) : null,
    certificationSent: certificateStatus === "Certificate Sent" ? "Yes" : "No",
    enrollmentStatus,
    certificateStatus,
  };
});

export const MOCK_REGISTRATIONS: Registration[] = Array.from({ length: 50 }, (_, i) => {
  const first = pick(FIRST, i + 31);
  const last = pick(LAST, i + 19);
  const course = COURSE_CONFIG[seeded(i + 29) % COURSE_CONFIG.length]!;
  const state = i < 42 ? "new" : i < 49 ? "duplicate" : "failed";
  return {
    id: `R${String(500 + i)}`,
    timestamp: iso(i % 4, 9 + (i % 8), (i * 7) % 60),
    emailAddress: `${first.toLowerCase()}${i}@gmail.com`,
    collegeEmailId: `${first.toLowerCase()}.${last.toLowerCase()}${i}@mhssce.ac.in`,
    fullName: `${first} ${last}`,
    branch: pick(BRANCHES, i + 2),
    yearOfStudy: pick(YEARS, i + 9),
    cprnNo: `CPRN${String(2026500 + i * 3)}`,
    courses: course.courseName,
    labs: i % 3 === 0 ? "Lab A" : "Lab B",
    syncState: state,
  };
});

export const MOCK_COURSE_STATS: CourseStats[] = COURSE_CONFIG.map((c) => {
  const students = MOCK_STUDENTS.filter((s) => s.courseId === c.id);
  return {
    courseId: c.id,
    totalStudents: students.length,
    pendingEnrollment: students.filter(
      (s) => s.enrollmentStatus === "Pending Enrollment" || s.enrollmentStatus === "Emails Copied",
    ).length,
    completed: students.filter((s) => s.enrollmentStatus === "Completed").length,
    certificatesSent: students.filter((s) => s.certificationSent === "Yes").length,
  };
});

export const MOCK_BATCHES: EnrollmentBatch[] = [
  {
    id: "BATCH-2026-0042",
    courseId: "c01",
    studentCount: 42,
    createdBy: "Admin",
    createdAt: iso(0, 13, 20),
    status: "Awaiting Portal Confirmation",
  },
  {
    id: "BATCH-2026-0041",
    courseId: "c05",
    studentCount: 28,
    createdBy: "Admin",
    createdAt: iso(1, 11, 5),
    status: "Enrollment Email Sent",
  },
  {
    id: "BATCH-2026-0040",
    courseId: "c08",
    studentCount: 35,
    createdBy: "Admin",
    createdAt: iso(3, 16, 45),
    status: "Closed",
  },
  {
    id: "BATCH-2026-0039",
    courseId: "c06",
    studentCount: 19,
    createdBy: "Admin",
    createdAt: iso(6, 10, 30),
    status: "Closed",
  },
];

const CERT_STATES = [
  "MATCHED",
  "MATCHED",
  "MATCHED",
  "AMBIGUOUS",
  "NO MATCH",
  "DUPLICATE CERTIFICATE",
  "INVALID FILE",
] as const;

export const MOCK_CERTIFICATES: Certificate[] = Array.from({ length: 46 }, (_, i) => {
  const student = MOCK_STUDENTS[(i * 3) % MOCK_STUDENTS.length]!;
  const state = CERT_STATES[seeded(i + 41) % CERT_STATES.length]!;
  const matched = state === "MATCHED";
  return {
    id: `CERT-${String(3000 + i)}`,
    fileName: `${student.fullName.replace(/ /g, "_")}_certificate.pdf`,
    extractedName: state === "INVALID FILE" ? "—" : student.fullName,
    courseId: state === "NO MATCH" ? null : student.courseId,
    studentId: matched ? student.id : null,
    matchState: state,
    reason:
      state === "AMBIGUOUS"
        ? "Two students share this name in the course tab"
        : state === "NO MATCH"
          ? "No student with this name found in any course tab"
          : state === "DUPLICATE CERTIFICATE"
            ? "A certificate was already sent to this student"
            : state === "INVALID FILE"
              ? "PDF could not be read"
              : undefined,
    uploadedAt: iso(i % 5, 12, (i * 5) % 60),
    signed: matched && i % 4 !== 0,
    sent: matched && i % 5 === 0,
  };
});

export const MOCK_EMAILS: EmailLog[] = Array.from({ length: 64 }, (_, i) => {
  const student = MOCK_STUDENTS[(i * 5) % MOCK_STUDENTS.length]!;
  const status: EmailLog["status"] =
    i % 11 === 0 ? "Failed" : i % 17 === 0 ? "Pending" : i % 23 === 0 ? "Retrying" : "Sent";
  return {
    id: `EM-${String(7000 + i)}`,
    recipient: student.collegeEmailId,
    studentName: student.fullName,
    studentId: student.id,
    type: i % 3 === 0 ? "Certificate" : "Enrollment",
    timestamp: iso(i % 9, 9 + (i % 9), (i * 11) % 60),
    status,
    errorMessage:
      status === "Failed" ? "Gmail rejected the recipient address (mailbox unavailable)" : undefined,
  };
});

export const MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: "A1",
    time: iso(0, 13, 30),
    admin: "Admin",
    action: "Certificate Sent",
    module: "Certificate Manager",
    student: "Fauzan Ansari",
    result: "Success",
  },
  {
    id: "A2",
    time: iso(0, 13, 22),
    admin: "Admin",
    action: "Certificate Signed",
    module: "Certificate Manager",
    student: "Aisha Shaikh",
    result: "Success",
  },
  {
    id: "A3",
    time: iso(0, 13, 20),
    admin: "Admin",
    action: "Enrollment Batch Created (BATCH-2026-0042)",
    module: "Enrollment Manager",
    student: null,
    result: "Success",
  },
  {
    id: "A4",
    time: iso(0, 13, 15),
    admin: "Admin",
    action: "Certificates ZIP Uploaded (120 files)",
    module: "Certificate Manager",
    student: null,
    result: "Warning",
  },
  {
    id: "A5",
    time: iso(0, 13, 10),
    admin: "Admin",
    action: "Registrations Synced (42 new, 7 duplicates)",
    module: "Synchronization",
    student: null,
    result: "Success",
  },
  {
    id: "A6",
    time: iso(0, 12, 48),
    admin: "Admin",
    action: "Enrollment Email Sent",
    module: "Email Manager",
    student: "Rohan Deshmukh",
    result: "Success",
  },
  {
    id: "A7",
    time: iso(0, 12, 40),
    admin: "Admin",
    action: "Certificate Email Failed",
    module: "Email Manager",
    student: "Sana Khan",
    result: "Failed",
  },
  {
    id: "A8",
    time: iso(1, 17, 5),
    admin: "Admin",
    action: "Certificate Moved to Review Queue",
    module: "Review Queue",
    student: "Imran Patil",
    result: "Warning",
  },
  {
    id: "A9",
    time: iso(1, 11, 5),
    admin: "Admin",
    action: "Enrollment Batch Created (BATCH-2026-0041)",
    module: "Enrollment Manager",
    student: null,
    result: "Success",
  },
  {
    id: "A10",
    time: iso(2, 15, 32),
    admin: "Admin",
    action: "Email Template Updated",
    module: "Settings",
    student: null,
    result: "Success",
  },
];

export const MOCK_SYNC_HISTORY: SyncResult[] = [
  {
    id: "SY-118",
    timestamp: iso(0, 13, 10),
    admin: "Admin",
    newRecords: 42,
    duplicates: 7,
    failures: 1,
    reviewRequired: 0,
    status: "Partial",
  },
  {
    id: "SY-117",
    timestamp: iso(1, 10, 2),
    admin: "Admin",
    newRecords: 18,
    duplicates: 3,
    failures: 0,
    reviewRequired: 0,
    status: "Success",
  },
  {
    id: "SY-116",
    timestamp: iso(2, 9, 45),
    admin: "Admin",
    newRecords: 26,
    duplicates: 11,
    failures: 0,
    reviewRequired: 2,
    status: "Success",
  },
  {
    id: "SY-115",
    timestamp: iso(4, 18, 12),
    admin: "Admin",
    newRecords: 0,
    duplicates: 0,
    failures: 4,
    reviewRequired: 0,
    status: "Failed",
  },
];

export const MOCK_SYSTEM_STATUS: SystemStatus = {
  googleSheets: "NOT CONFIGURED",
  gmail: "NOT CONFIGURED",
  certificateSigner: "NOT CONFIGURED",
  mockMode: true,
};
