# Swift Enroll

Build a production-quality internal administrative web application called:

STUDENT ENROLLMENT & CERTIFICATE AUTOMATION SYSTEM

This is an internal operations platform for managing student registrations, course enrollment, enrollment communication, certificate processing, certificate signing, certificate delivery, status tracking, and reporting.

IMPORTANT:

The latest FRD v3.0 is the AUTHORITATIVE SOURCE OF TRUTH.

Do not use assumptions from older versions of the project.

The application must be:

- Clean

- Professional

- Modern

- Extremely easy to use

- Responsive

- Secure

- Modular

- Maintainable

- Scalable

- Suitable for real administrative use

============================================================

1. MOST IMPORTANT ARCHITECTURAL RULE

============================================================

DO NOT REPLACE THE EXISTING GOOGLE SHEETS SYSTEM.

The application is an AUTOMATION AND MANAGEMENT LAYER around the organization's existing workflow.

The existing architecture is:

Student

↓

Google Form

↓

READ-ONLY Google Form Response Sheet

↓

Google Sheets API

↓

Next.js/Admin Dashboard

↓

Existing Enrollment Records Spreadsheet

↓

14 Existing Course Tabs

The dashboard controls administrative operations.

============================================================

2. NON-NEGOTIABLE CONSTRAINTS

============================================================

RULE 1:

Google Form Response Sheet is READ-ONLY.

Never:

- modify it

- delete rows

- rename it

- change headers

- write application data into it

RULE 2:

The existing Enrollment Records spreadsheet must remain unchanged.

RULE 3:

The existing 14 course tabs must remain unchanged.

RULE 4:

Existing spreadsheet headers must remain unchanged.

RULE 5:

Do not replace Google Sheets with PostgreSQL.

RULE 6:

Do not introduce unnecessary infrastructure such as:

- PostgreSQL

- Prisma

- Supabase

- Firebase

- MongoDB

- Redis

unless explicitly requested later.

RULE 7:

Use Google Sheets API for spreadsheet operations.

RULE 8:

Use Gmail API for email operations.

RULE 9:

Use the EXISTING Next.js certificate signing module.

Do NOT build a new certificate signing system.

RULE 10:

All administrative actions must happen through the dashboard.

============================================================

3. EXISTING GOOGLE SHEETS

============================================================

There are two important spreadsheets.

------------------------------

SPREADSHEET 1

GOOGLE FORM RESPONSE SHEET

------------------------------

READ ONLY.

Existing headers:

Timestamp

Email address

Email ID (.mhssce.ac.in)

Full Name

Branch

Year Of Study

CPRN NO.

Courses

Labs

The application reads new responses from this sheet.

Never modify the source response sheet.

------------------------------

SPREADSHEET 2

ENROLLMENT RECORDS

------------------------------

Contains 14 EXISTING COURSE TABS.

Existing headers:

Email ID

Full Name

Branch

Year Of Study

CPRN NO.

Start Date

Completion Date

Certification Sent

Do not rename tabs.

Do not delete tabs.

Do not change headers.

Do not create replacement tabs.

The application must adapt to this existing structure.

============================================================

4. TECHNOLOGY

============================================================

Use a modern web application architecture suitable for Lovable.

Frontend:

React / Next.js-compatible architecture as supported by the platform

Language:

TypeScript

Styling:

Tailwind CSS

UI:

Modern component-based design

Integrations:

Google Sheets API

Gmail API

Existing Certificate Signer

Deployment:

Lovable-compatible deployment architecture

Keep the architecture portable.

Do not create unnecessary backend infrastructure.

============================================================

5. PRODUCT DESIGN GOAL

============================================================

The application should feel like a professional SaaS administration platform.

Think:

"Stripe Dashboard simplicity"

+

"Google Workspace familiarity"

+

"Modern internal operations software"

The administrator should not need technical knowledge.

The UI should immediately answer:

What is new?

What needs my attention?

Which students need enrollment?

Which emails were sent?

Which certificates need review?

Which certificates are signed?

Which certificates are sent?

What failed?

============================================================

6. GLOBAL UI STRUCTURE

============================================================

Create:

------------------------------------------------

SIDEBAR

------------------------------------------------

Dashboard

Students

Courses

Synchronization

Enrollment

Emails

Certificates

Review Queue

Reports

Activity Logs

Settings

------------------------------------------------

TOP BAR

------------------------------------------------

Search

Notifications

Admin Profile

Logout

------------------------------------------------

MAIN CONTENT

------------------------------------------------

Context-specific page content.

Use a clean responsive sidebar.

On mobile:

collapse sidebar into a navigation drawer.

============================================================

7. DESIGN SYSTEM

============================================================

Create a consistent design system.

Use:

- clean typography

- generous spacing

- subtle borders

- rounded cards

- professional tables

- clear status badges

- minimal shadows

- accessible contrast

- consistent button styles

Avoid:

- excessive gradients

- excessive animations

- clutter

- unnecessary illustrations

- overly colorful dashboards

- huge text

- confusing navigation

Primary actions should be visually obvious.

Destructive or irreversible actions must use confirmation dialogs.

============================================================

8. DASHBOARD

============================================================

Create a professional administrative dashboard.

Top summary cards:

TOTAL STUDENTS

NEW REGISTRATIONS

PENDING ENROLLMENT

WAITING FOR COMPLETION

CERTIFICATES TO REVIEW

CERTIFICATES SIGNED

CERTIFICATES SENT

COMPLETED

Below the cards:

--------------------------------

ATTENTION REQUIRED

--------------------------------

Show actionable items:

- New registrations waiting for sync

- Students waiting for enrollment

- Certificates requiring review

- Failed emails

- Failed certificate processing

--------------------------------

RECENT ACTIVITY

--------------------------------

Show:

- Registration synced

- Enrollment batch created

- Email sent

- Certificate uploaded

- Certificate signed

- Certificate sent

Include timestamps.

--------------------------------

COURSE OVERVIEW

--------------------------------

Show the 14 courses with:

Course Name

Students

Pending Enrollment

Completed

Certificates Sent

Keep the dashboard focused.

============================================================

9. STUDENT MANAGEMENT

============================================================

Create a professional student management page.

Table columns:

Name

Email

Branch

Year

CPRN

Course

Start Date

Completion Date

Enrollment Status

Certificate Status

Features:

- Search

- Course filter

- Status filter

- Sorting

- Pagination

- Student details drawer/page

Clicking a student should show:

Student Information

Registration Details

Enrollment Status

Email History

Certificate Status

Activity Timeline

Do not allow arbitrary destructive edits to source records.

============================================================

10. COURSE MANAGEMENT

============================================================

Display the existing 14 courses.

Course cards/table:

Course Name

Tab Name

Total Students

Pending Enrollment

Completed

Certificates Sent

IMPORTANT:

The application must use a centralized mapping:

Course Name

→

Existing Google Sheet Tab Name

Do not hardcode course names throughout the application.

Do not allow deleting or renaming existing course tabs.

============================================================

11. SYNCHRONIZATION PAGE

============================================================

Create a dedicated synchronization page.

Header:

"Registration Synchronization"

Primary button:

SYNC NEW REGISTRATIONS

Show last synchronization:

Last Sync:

08 Aug 2026, 01:20 PM

Summary:

New:

42

Duplicates:

7

Failed:

1

Review Required:

0

Show synchronization history.

Each synchronization record:

Timestamp

Admin

New Records

Duplicates

Failures

Status

Workflow:

Google Form Response Sheet

↓

Read New Responses

↓

Duplicate Check

↓

Course Identification

↓

Append to Correct Course Tab

↓

Dashboard Updated

Never modify the response sheet.

============================================================

12. ENROLLMENT MANAGER

============================================================

Create a clear guided workflow.

STEP 1:

Select Course

STEP 2:

View eligible students

STEP 3:

Copy Remaining Emails

STEP 4:

Create Batch

STEP 5:

Show Batch Summary

STEP 6:

Administrator pastes emails into external course portal

STEP 7:

Administrator confirms enrollment

STEP 8:

Send Enrollment Email

STEP 9:

Update status

The interface should clearly show the current step.

------------------------------------------------

COPY REMAINING EMAILS

------------------------------------------------

Button:

COPY REMAINING EMAILS

This means students who have not already been included in a successful enrollment process.

After clicking:

Show:

Students Selected: 42

Emails Copied: 42

Then:

CREATE ENROLLMENT BATCH

Each batch should contain:

Batch ID

Course

Student Count

Created By

Created At

Status

Prevent duplicate batches.

============================================================

13. EMAIL MANAGER

============================================================

Create an email management page.

Tabs:

Enrollment Emails

Certificate Emails

Failed Emails

Email History

Show:

Recipient

Student

Email Type

Timestamp

Status

Statuses:

Sent

Failed

Pending

Retrying

Actions:

Retry Failed

View Details

Use Gmail API on the server side.

Never expose credentials.

============================================================

14. CERTIFICATE MANAGER

============================================================

Create a clean certificate processing interface.

Main workflow:

UPLOAD CERTIFICATES ZIP

Then:

1. Validate ZIP

2. Extract PDFs

3. Read student name

4. Identify course

5. Match student

6. Send unmatched to Review Queue

7. Sign matched certificate

8. Preview

9. Send certificate

10. Update records

Show processing progress.

Example:

Uploading ZIP

████████░░ 80%

Processing 120 certificates

Matched: 112

Review Required: 6

Failed: 2

Signed: 108

Sent: 104

============================================================

15. CERTIFICATE UPLOAD

============================================================

Create a drag-and-drop upload area.

Text:

"Drop Certificates.zip here"

Supported:

ZIP containing PDF certificates.

Show:

File Name

File Size

Number of PDFs

Upload Time

Processing Status

Validate:

- ZIP extension

- File size

- File integrity

- PDF files

- unsafe filenames

Prevent:

- path traversal

- malicious extraction

- ZIP bombs

- executable files

============================================================

16. CERTIFICATE MATCHING

============================================================

Certificate workflow:

Extract PDF

↓

Read Student Name

↓

Find Student in Course Tab

↓

Match?

YES

↓

Continue to signing

NO / UNCERTAIN

↓

Review Queue

Possible states:

MATCHED

AMBIGUOUS

NO MATCH

INVALID FILE

DUPLICATE CERTIFICATE

Never automatically send an uncertain certificate.

============================================================

17. REVIEW QUEUE

============================================================

This is an important module.

Create:

"Certificates Requiring Review"

Table:

Certificate

Extracted Name

Course

Possible Student

Reason

Uploaded

Status

Action

Actions:

Confirm Match

Reassign

Reject

Retry

When admin confirms:

Certificate

↓

Sign

↓

Preview

↓

Send

============================================================

18. EXISTING CERTIFICATE SIGNER

============================================================

IMPORTANT:

DO NOT CREATE A NEW CERTIFICATE SIGNING SYSTEM.

The existing Next.js certificate signer must be integrated.

Create an abstraction:

Certificate Manager

↓

Certificate Signer Adapter

↓

Existing Certificate Signer

The existing signer should be treated as an external/internal dependency.

Do not redesign it.

============================================================

19. CERTIFICATE PREVIEW

============================================================

Before sending a certificate:

Show:

Student Name

Email

Course

Certificate Preview

Signing Status

Email Status

Buttons:

SEND CERTIFICATE

CANCEL

Never send an uncertain certificate automatically.

============================================================

20. COMPLETION UPDATE

============================================================

After successful certificate delivery:

Update:

Completion Date

Certification Sent = Yes

Do not mark a certificate as sent if Gmail fails.

Do not mark the student completed prematurely.

============================================================

21. STATUS SYSTEM

============================================================

Use a centralized status system.

Statuses:

Pending Registration

Pending Enrollment

Emails Copied

Enrollment Email Sent

Waiting for Completion

Certificate Uploaded

Certificate Pending Review

Certificate Signed

Certificate Sent

Completed

Use visually consistent badges.

============================================================

22. ACTIVITY LOGS

============================================================

Create an Activity Logs page.

Columns:

Time

Admin

Action

Module

Student

Result

Example:

08 Aug 2026 01:30 PM

Admin

Certificate Sent

Certificate Manager

Fauzan Ansari

Success

Filters:

Date

Module

Admin

Action

Result

============================================================

23. REPORTS

============================================================

Create a clean reporting page.

Reports:

Registration Overview

Course-wise Enrollment

Pending Enrollment

Completion

Certificate Processing

Certificate Delivery

Failed Emails

Review Queue

Use simple charts only where they provide useful information.

Avoid decorative analytics.

Allow export only if supported by the FRD/integration.

============================================================

24. SETTINGS

============================================================

Settings should contain:

Course/Tab Mapping

Email Templates

System Preferences

Integration Status

Do not display:

API keys

OAuth secrets

Access tokens

Private keys

============================================================

25. INTEGRATION STATUS

============================================================

Create an optional integration health section.

Show:

Google Sheets API

CONNECTED / DISCONNECTED

Gmail API

CONNECTED / DISCONNECTED

Certificate Signer

CONNECTED / DISCONNECTED

This helps administrators identify integration problems.

============================================================

26. ERROR HANDLING

============================================================

Errors must be human-readable.

Examples:

"Google Sheets could not be reached. Please try again."

"Gmail could not send this email. You can retry it from Failed Emails."

"This certificate could not be matched to a student. It has been moved to Review Queue."

"The uploaded ZIP is invalid."

Never show raw stack traces to administrators.

Developers can still see detailed errors in server logs.

============================================================

27. SECURITY

============================================================

Implement:

Secure admin authentication

Protected routes

Server-side authorization

Environment variables

No credentials in frontend

Input validation

File upload validation

ZIP security

Safe temporary files

No sensitive information in UI logs

No secret values in GitHub/repository

============================================================

28. RESPONSIVE DESIGN

============================================================

Desktop:

Full sidebar + dashboard

Tablet:

Collapsible sidebar

Mobile:

Drawer navigation

Tables should become horizontally scrollable or transform into cards where appropriate.

The application must remain usable on smaller screens.

============================================================

29. ACCESSIBILITY

============================================================

Use:

- proper labels

- keyboard navigation

- accessible dialogs

- readable text

- sufficient contrast

- visible focus states

- descriptive buttons

Do not rely only on color to communicate status.

============================================================

30. PERFORMANCE

============================================================

Optimize for thousands of students.

Avoid:

- unnecessary API calls

- repeated Google Sheets reads

- loading everything at once

- blocking UI during processing

Use:

- pagination

- server-side processing

- loading states

- efficient data fetching

============================================================

31. DATA FLOW

============================================================

Registration:

Google Form

↓

Read-only Response Sheet

↓

Google Sheets API

↓

Sync Engine

↓

Duplicate Check

↓

Course Mapping

↓

Existing Course Tab

↓

Dashboard

Enrollment:

Course

↓

Eligible Students

↓

Copy Remaining Emails

↓

Create Batch

↓

External Course Portal

↓

Enrollment Email

↓

Status Update

Certificate:

ZIP

↓

Extract PDFs

↓

Read Student Name

↓

Match Course Tab

↓

Review if uncertain

↓

Existing Certificate Signer

↓

Preview

↓

Gmail API

↓

Completion Date

↓

Certification Sent = Yes

============================================================

32. APPLICATION NAVIGATION

============================================================

Sidebar:

Dashboard

Students

Courses

Synchronization

Enrollment

Emails

Certificates

Review Queue

Reports

Activity Logs

Settings

Keep navigation stable throughout the application.

============================================================

33. COMPONENTS TO CREATE

============================================================

Create reusable components:

StatCard

StatusBadge

DataTable

SearchBar

FilterDropdown

DateFilter

ConfirmationDialog

FileUpload

ProgressBar

EmptyState

ErrorState

LoadingState

ActivityTimeline

StudentDetails

CertificatePreview

BatchSummary

IntegrationStatus

Pagination

ToastNotification

Do not duplicate components.

============================================================

34. DATA MODELS / TYPES

============================================================

Create TypeScript types for:

Student

Course

Registration

EnrollmentBatch

Certificate

CertificateMatch

EmailLog

ActivityLog

SystemStatus

SyncResult

Avoid "any".

============================================================

35. API / SERVICE BOUNDARIES

============================================================

Separate integration logic.

Google Sheets Service:

getFormResponses()

getNewResponses()

checkDuplicate()

getCourseStudents()

appendToCourseTab()

updateCompletionDate()

markCertificationSent()

Gmail Service:

sendEnrollmentEmail()

sendCertificateEmail()

retryEmail()

Certificate Service:

processZip()

extractPdf()

extractStudentName()

matchCertificate()

sendToReviewQueue()

signCertificate()

prepareCertificate()

Do not call external APIs directly from UI components.

============================================================

36. COURSE CONFIGURATION

============================================================

Create a centralized configuration:

COURSE_CONFIG

Each entry should map:

courseName

→

sheetTabName

Do not scatter tab names across the codebase.

If a tab is missing:

Do not write data.

Show an actionable error.

============================================================

37. DEVELOPMENT STRATEGY

============================================================

Do not build the entire application blindly in one step.

PHASE 1:

Build the UI shell and design system.

PHASE 2:

Build Dashboard.

PHASE 3:

Build Students and Courses.

PHASE 4:

Build Synchronization UI and service architecture.

PHASE 5:

Build Enrollment Manager.

PHASE 6:

Build Email Manager.

PHASE 7:

Build Certificate Manager.

PHASE 8:

Build Review Queue.

PHASE 9:

Build Reports and Activity Logs.

PHASE 10:

Connect real Google Sheets API.

PHASE 11:

Connect Gmail API.

PHASE 12:

Integrate existing certificate signer.

PHASE 13:

End-to-end testing.

============================================================

38. IMPORTANT: USE MOCK DATA FIRST

============================================================

During initial UI development, use realistic mock data.

Do NOT require real Google credentials to preview the UI.

Create mock examples for:

- 14 courses

- 100+ students

- enrollment batches

- certificates

- review queue

- email logs

- activity logs

Clearly separate mock data from real integration services.

Later replace mock services with real APIs.

============================================================

39. REAL INTEGRATIONS

============================================================

When moving from mock mode to production:

Use environment variables/secrets.

Required configuration will include appropriate Google API/OAuth credentials and spreadsheet identifiers.

Do NOT invent:

- spreadsheet IDs

- tab names

- OAuth credentials

- email addresses

- certificate signer endpoints

If information is missing:

Create a clearly documented configuration placeholder.

============================================================

40. TESTING

============================================================

Test:

New registration

Duplicate registration

Unknown course

Missing course tab

Google Sheets API failure

Batch creation

Duplicate batch

Enrollment email

Failed email

Email retry

Invalid ZIP

Corrupted ZIP

Unsafe ZIP

Certificate mismatch

Ambiguous certificate

Review queue

Certificate signing

Certificate email

Completion update

============================================================

41. FINAL UX

============================================================

The final product should make the administrator's workflow extremely simple.

Example:

1. Open Dashboard

2. Click "Sync New Registrations"

3. Review new students

4. Select course

5. Click "Copy Remaining Emails"

6. Create batch

7. Paste into external course portal

8. Click "Send Enrollment Emails"

9. Later upload certificate ZIP

10. Review unmatched certificates

11. Sign certificates

12. Preview

13. Send

14. System updates completion automatically

The administrator should never need to understand the technical implementation.

============================================================

42. VISUAL QUALITY

============================================================

Create a polished, production-quality interface.

Do NOT make it look like a generic AI-generated dashboard.

Avoid:

- excessive gradients

- random colors

- oversized cards

- unnecessary charts

- excessive rounded elements

- cluttered tables

- too many buttons

Use strong visual hierarchy.

Important actions should be obvious.

Tables should be information-dense but readable.

Use whitespace intelligently.

============================================================

43. FINAL ARCHITECTURAL PRINCIPLE

============================================================

DO NOT REPLACE THE EXISTING SYSTEM.

AUTOMATE IT.

Final conceptual architecture:

Google Forms

+

Existing Google Sheets

+

Google Sheets API

+

Admin Dashboard

+

Gmail API

+

Existing Certificate Signer

The application should be:

CLEAN

SIMPLE

SECURE

MODULAR

MAINTAINABLE

USER-FRIENDLY

SCALABLE

============================================================

44. FIRST ACTION

============================================================

Before implementing real integrations:

1. Analyze the requirements.

2. Create the application shell.

3. Create the design system.

4. Create the sidebar/navigation.

5. Create all major pages.

6. Populate realistic mock data.

7. Make the entire UI navigable.

8. Ensure responsive design.

9. Review the complete UX.

10. Then begin integrating Google Sheets.

Do not ask unnecessary questions.

If a required integration detail is missing, use a clearly marked placeholder and continue building the UI.

Do not invent real credentials or identifiers.

START BY BUILDING THE COMPLETE UI/UX SYSTEM WITH MOCK DATA.

After the UI is complete, move toward the real Google Sheets, Gmail, and certificate integrations.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/21def758-1960-4db1-9501-6546034d9ac7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
