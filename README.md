
# FACEPrep Claims: The Complete Guide

## Table of Contents
1.  [**Introduction: What is FACEPrep Claims?**](#1-introduction-what-is-faceprep-claims)
2.  [**Core Concepts: The Two Sides of a Claim**](#2-core-concepts-the-two-sides-of-a-claim)
    *   [The "My Claims" View: Your Personal Dashboard](#the-my-claims-view-your-personal-dashboard)
    *   [The "Claims to Approve" View: The Manager's Hub](#the-claims-to-approve-view-the-managers-hub)
3.  [**A Guided Tour of the Application**](#3-a-guided-tour-of-the-application)
    *   [The Header: Navigation and Notifications](#the-header-navigation-and-notifications)
    *   [The Dashboard: At-a-Glance Summaries](#the-dashboard-at-a-glance-summaries)
    *   [The Control Center: Search, Filter, Sort & View](#the-control-center-search-filter-sort--view)
    *   [The Claim Item: Anatomy of a Claim Card](#the-claim-item-anatomy-of-a-claim-card)
4.  [**Feature Deep Dive: Submitting a Claim**](#4-feature-deep-dive-submitting-a-claim)
    *   [Step 1: The "Add New Claim" Form](#step-1-the-add-new-claim-form)
    *   [Step 2: AI-Powered Receipt Scanning with Gemini](#step-2-ai-powered-receipt-scanning-with-gemini)
    *   [Step 3: Filling in Core and Category-Specific Details](#step-3-filling-in-core-and-category-specific-details)
    *   [Step 4: Assigning Approvers](#step-4-assigning-approvers)
    *   [Step 5: Finalizing and Submitting](#step-5-finalizing-and-submitting)
5.  [**Feature Deep Dive: Managing & Reviewing Claims**](#5-feature-deep-dive-managing--reviewing-claims)
    *   [The Claim Details Modal: Your Central Hub](#the-claim-details-modal-your-central-hub)
    *   [Editing an Existing Claim](#editing-an-existing-claim)
6.  [**Feature Deep Dive: The Approval Workflow**](#6-feature-deep-dive-the-approval-workflow)
    *   [How to Approve or Reject](#how-to-approve-or-reject)
    *   [Understanding Status Logic](#understanding-status-logic)
7.  [**Feature Deep Dive: The Notification System**](#7-feature-deep-dive-the-notification-system)
    *   [The Notification Bell and Panel](#the-notification-bell-and-panel)
    *   [When Are Notifications Triggered?](#when-are-notifications-triggered)
8.  [**Feature Deep Dive: Claim Discussion & Audit Trail**](#8-feature-deep-dive-claim-discussion--audit-trail)
    *   [Real-time Chat](#real-time-chat)
    *   [The System Log: Automated Transparency](#the-system-log-automated-transparency)
9.  [**Your Profile**](#9-your-profile)
10. [**Technical Overview for Developers**](#10-technical-overview-for-developers)
    *   [Frontend Stack](#frontend-stack)
    *   [Project Structure](#project-structure)
    *   [Key Services](#key-services)
    *   [State Management](#state-management)
11. [**Setup and Deployment**](#11-setup-and-deployment)
    *   [Prerequisites](#prerequisites)
    *   [Environment Variables](#environment-variables)
    *   [Running Locally](#running-locally)
    *   [Building for Production](#building-for-production)

---

## 1. Introduction: What is FACEPrep Claims?

**FACEPrep Claims** is an intelligent, modern, and user-centric application designed to streamline the entire lifecycle of employee expense reimbursements. It addresses the needs of both employees submitting claims and managers responsible for approving them, creating a single, transparent source of truth.

By leveraging the power of Google's Gemini AI for receipt analysis and providing a real-time, interactive interface, the application transforms a traditionally tedious process into an efficient and pleasant experience. Its core mission is to reduce manual data entry, minimize approval delays, and provide perfect clarity on the status of every claim.

---

## 2. Core Concepts: The Two Sides of a Claim

The application's interface is fundamentally divided into two distinct roles, ensuring that users are only presented with information and actions relevant to their immediate needs.

### The "My Claims" View: Your Personal Dashboard
This is the default view and serves as the employee's personal command center for all their expense claims.
*   **Purpose**: To create, submit, and track the status of your own reimbursement requests.
*   **Key Actions**: Add a new claim, view the approval progress of existing claims, edit claims that are still pending, and communicate with approvers.

### The "Claims to Approve" View: The Manager's Hub
This view is designed for users who have approval responsibilities.
*   **Purpose**: To review, validate, and action claims submitted by other employees.
*   **Key Actions**: Examine claim details and attached proofs, approve or reject submissions, and communicate with the submitter to ask for clarification.

---

## 3. A Guided Tour of the Application

### The Header: Navigation and Notifications
The header is a persistent element at the top of the screen, providing access to core functionalities.

*   **Logo & Tagline**: Establishes the application's identity.
*   **Notification Bell**: The hub for real-time updates. An icon with a red badge indicates the number of unread notifications, ensuring you never miss an important event. (See section 7 for details).
*   **User Profile**: Displays your name, employee ID, and profile picture. Clicking it opens the "My Profile" modal with your detailed information.

### The Dashboard: At-a-Glance Summaries
When in the "My Claims" view, the area below the main tabs features four **Summary Cards**. These provide a high-level financial overview of your claims:

*   **Total Amount**: The cumulative value of all claims you've ever submitted.
*   **Pending**: The number of your claims currently awaiting approval.
*   **Approved**: The number of your claims that have been successfully approved.
*   **Rejected**: The number of your claims that have been rejected.

### The Control Center: Search, Filter, Sort & View
This powerful, consolidated bar allows you to instantly find the exact claims you're looking for.

*   **Search**: A free-text search bar that intelligently queries multiple fields within a claim, including description, amount, submitter name, invoice number, and locations.
*   **Sort By**: A dropdown to order the list of claims by:
    *   `Date: Newest` (Default)
    *   `Date: Oldest`
    *   `Amount: High-Low`
    *   `Amount: Low-High`
*   **Filter By**: Two dropdowns to narrow down the claims shown:
    *   **Category**: `Food`, `Cab`, `Train`, `Laundry`, `Stay`, or `All`.
    *   **Status**: `Pending`, `Approved`, `Rejected`, or `All`.
*   **View Toggle**: Switch between two layouts for the claims list:
    *   **List View**: A traditional, single-column vertical layout.
    *   **Grid View**: A multi-column, card-based layout that is ideal for larger screens.

### The Claim Item: Anatomy of a Claim Card
Each claim is represented by a card that provides a wealth of information in a compact format.

*   **Visual Identity**:
    *   **Category Icon & Label**: Clearly identifies the claim type (e.g., a fork-and-knife icon for "Food").
    *   **Amount**: The claim's value, displayed prominently.
*   **Core Details**:
    *   **Description**: The user-provided note about the expense.
    *   **Date**: The date the expense was incurred.
    *   **Submitter Name**: (Visible in "Claims to Approve" view) The name of the employee who submitted the claim.
*   **Contextual Information**:
    *   **Category-Specific Data**: Key details like `Trip: Office → Airport` for travel claims or `Meal(s): Lunch` for food claims.
    *   **Receipt Preview**: A thumbnail of the first attached proof. A `+N` badge appears if multiple files are attached.
*   **Status Indicators**:
    *   **Overall Status Badge**: A colored tag (`Pending`, `Approved`, `Rejected`) shows the claim's current state.
    *   **Status Update Dot**: A **pulsating blue dot** appears next to the status badge on a "My Claims" card if an approver has recently actioned it. This provides an immediate visual cue for recent activity. The dot disappears once you view the claim's details.
*   **Approval Breakdown**:
    *   A list of all assigned approvers, each with their individual status (e.g., `John Doe: Approved`), indicated by a colored dot. This gives you a granular view of the approval chain.

---

## 4. Feature Deep Dive: Submitting a Claim

### Step 1: The "Add New Claim" Form
From the "My Claims" view, click the **"Add New Claim"** button to open the submission modal. The form is dynamic and adjusts its fields based on the selected category.

### Step 2: AI-Powered Receipt Scanning with Gemini
This is the application's signature feature, designed to eliminate manual data entry.

*   **How it Works**: When you upload a receipt image or take a photo, the application sends it to the Gemini AI model. The AI analyzes the image to identify and extract key information.
*   **The User Experience**:
    1.  Click **"Upload or take a photo"**.
    2.  A status message immediately appears: **"Analyzing receipt..."**. The Amount, Date, and Category fields are temporarily disabled during this process.
    3.  After a few seconds, the analysis completes. A success message appears: **"Receipt details extracted! Please verify."**
    4.  The **Amount**, **Date**, and **Category** fields are automatically populated with the data Gemini found on the receipt.
*   **User in Control**: The AI provides a smart suggestion, not a final decision. You can always override or correct any of the auto-filled information before submitting.

### Step 3: Filling in Core and Category-Specific Details
If not using the AI scanner, or to supplement its findings, you can fill in the fields manually.

*   **Core Fields**: `Category`, `Amount`, `Date`, `Invoice No.`
*   **Category-Specific Fields**:
    *   **Food**: Select `Breakfast`, `Lunch`, or `Dinner` via checkboxes. The `Amount` field is auto-calculated based on predefined company allowances for each meal type, ensuring policy compliance.
    *   **Cab / Taxi**: `From`, `To`, `Cab Type` (Auto, Cab, Bike), `Booking App` (Uber, Ola, etc.), `Co-passenger(s)`.
    *   **Train / Public Transport**: `From` and `To` locations.

### Step 4: Assigning Approvers
In the "Approving Manager(s)" section, start typing the name of the person who needs to approve your claim. A search result appears, allowing you to select and add them. You can add multiple approvers to create a chain of approval.

### Step 5: Finalizing and Submitting
Add any final notes in the `Description` field, attach your proof files, and click **"Submit Claim"**. The form validates that all required fields are filled. Upon successful submission, the modal closes, and your new claim instantly appears in the "My Claims" list, highlighted briefly for visibility.

---

## 5. Feature Deep Dive: Managing & Reviewing Claims

### The Claim Details Modal: Your Central Hub
Clicking any claim card opens the detailed view, which is the primary interface for managing a specific claim.

*   **Header**: A summary showing the category, amount, date, and overall status.
*   **All Details**: A comprehensive grid listing every piece of data associated with the claim.
*   **Approval Status List**: Shows each approver's decision. If you are viewing one of your own claims and an approver has recently changed their status, their entry will have a **light blue highlight**, drawing your attention to the latest action.
*   **Receipts Gallery**: A grid of all attached proof files. Clicking a thumbnail opens the full-size image in a new tab.
*   **Claim Discussion**: A complete chat history for the claim (See section 8).

### Editing an Existing Claim
From the "My Claims" view, if a claim is still pending, you can open its details and click the **"Edit Claim"** button. This re-opens the submission form, pre-populated with the claim's data, allowing you to make corrections and resubmit.

---

## 6. Feature Deep Dive: The Approval Workflow

### How to Approve or Reject
When viewing a claim from the "Claims to Approve" dashboard that is awaiting your decision, the action buttons at the bottom of the details modal will be **"Reject"** (red) and **"Approve"** (green). Clicking one of these buttons instantly records your decision.

### Understanding Status Logic
The overall status of a claim with multiple approvers is calculated automatically:
*   **Rejected**: If **any single approver** rejects the claim.
*   **Approved**: If **all approvers** have approved the claim.
*   **Pending**: If at least one approver has not yet made a decision, and none have rejected it.

---

## 7. Feature Deep Dive: The Notification System

The application uses a proactive notification system to keep users informed of important events in real-time.

### The Notification Bell and Panel
*   A **red badge** on the bell icon in the header shows the number of unread notifications.
*   Clicking the bell opens a dropdown panel listing your recent notifications, with the newest at the top.
*   **Unread notifications have a distinct blue background**.
*   Clicking a notification marks it as read and **navigates you directly to the relevant claim's details**, allowing for immediate context and action.
*   A "Mark all as read" button is available for convenience.

### When Are Notifications Triggered?
Notifications are automatically generated for key events:
*   **For Approvers**: When an employee submits a new claim that requires your approval.
*   **For Submitters**: When an approver **approves** or **rejects** your claim.
*   **For Both**: When anyone sends a **new message** in the claim's discussion thread.

---

## 8. Feature Deep Dive: Claim Discussion & Audit Trail

To eliminate ambiguity and the need for out-of-app communication (like emails), each claim has its own integrated chat.

### Real-time Chat
Located at the bottom of the Claim Details modal, this feature allows submitters and approvers to communicate directly. You can ask for more information, provide clarification, or discuss any aspect of the claim. Your messages appear on the right, while others' messages appear on the left.

### The System Log: Automated Transparency
The chat feature doubles as an **immutable audit trail**. In addition to user messages, the system automatically posts a message whenever a significant action occurs.
*   **Example**: *"Jane Smith changed their status to Approved."*
These system messages are centered and italicized, clearly distinguishing them from user comments. This creates a permanent, undeniable log of the claim's history, ensuring full transparency and accountability for everyone involved.

---

## 9. Your Profile
Clicking your name in the header opens the "My Profile" modal. This screen displays your core employee information, such as your name, job title, Employee ID, email, department, and reporting manager.

---

## 10. Technical Overview for Developers

### Frontend Stack
*   **Framework**: React 19
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **AI Integration**: `@google/genai` SDK for Gemini API

### Project Structure
The application follows a standard component-based architecture:
*   `App.tsx`: The root component, responsible for state management and data fetching.
*   `components/`: Contains all reusable UI components (e.g., `ClaimList`, `ClaimForm`, `Modal`).
*   `services/`: Encapsulates logic for communicating with external APIs.
*   `types.ts`: Defines all TypeScript interfaces and enums for data structures like `Claim` and `Notification`.

### Key Services
*   `apiService.ts`: The data layer for the application. It is responsible for making all HTTP requests to the backend API (`GET`, `POST`, `PUT`). This decouples the UI components from the data fetching logic.
*   `geminiService.ts`: Contains the logic for interacting with the Google Gemini API, specifically for the receipt analysis feature.

### State Management
The application utilizes React's built-in hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) for efficient and localized state management within the `App.tsx` component. There is no dependency on external state management libraries.

---

## 11. Setup and Deployment

### Prerequisites
*   Node.js (v18 or later)
*   npm or yarn

### Environment Variables
This application requires an API key for the Gemini AI features.
1.  Create a file named `.env` in the root of the project.
2.  Add the following line to the file, replacing `YOUR_GEMINI_API_KEY` with your actual key:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```

### Running Locally
1.  Install dependencies: `npm install`
2.  Start the development server: `npm start`
3.  Open your browser to `http://localhost:3000`.

### Building for Production
To create an optimized build for deployment, run:
```
npm run build
```
This will generate a `dist` folder containing static HTML, CSS, and JavaScript files that can be hosted on any web server. The application is now production-ready and expects to communicate with a live backend API.


<img width="1920" height="1080" alt="Screenshot 2025-10-22 150417" src="https://github.com/user-attachments/assets/8d0884cd-aa00-41cd-b190-55f9d68b3b2e" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150426" src="https://github.com/user-attachments/assets/935d5d80-e891-4203-ac14-ef92a967e559" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150436" src="https://github.com/user-attachments/assets/a5352c81-555e-4a29-bf62-268ce62655ca" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150444" src="https://github.com/user-attachments/assets/34c6f38a-8ed4-488c-b5d0-0e0055beff11" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150457" src="https://github.com/user-attachments/assets/abb03cf0-8959-4962-9610-ff1b0ff4dfda" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150507" src="https://github.com/user-attachments/assets/552f8094-a2e6-4902-abc9-c84aa7bfdf1d" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150513" src="https://github.com/user-attachments/assets/33522d54-fd67-4c43-8cf8-53ddd3b3fbe3" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150528" src="https://github.com/user-attachments/assets/fcdde68b-4802-4f05-9e15-7e3476577aad" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150544" src="https://github.com/user-attachments/assets/323beb8c-c8ed-4ad0-8e7e-a5830158d139" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150551" src="https://github.com/user-attachments/assets/624759e2-ece9-4716-8262-72969b8b24de" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150558" src="https://github.com/user-attachments/assets/47812725-bb08-4039-bcbd-8124cf1617af" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150608" src="https://github.com/user-attachments/assets/58a09b94-3292-4a98-8fac-2d1c9c025239" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150617" src="https://github.com/user-attachments/assets/947380d8-0385-41f2-9e9b-f11ed2e32639" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150644" src="https://github.com/user-attachments/assets/2cbd27b3-d3d6-4f96-9e07-eb34e9765c0b" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150650" src="https://github.com/user-attachments/assets/1706efeb-6ab6-42c7-a41d-4cf50e62a402" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150718" src="https://github.com/user-attachments/assets/38f8191f-9263-4f13-96fa-4fce4d71bff4" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150724" src="https://github.com/user-attachments/assets/d04ae6c7-2a4f-4a85-a1ef-922bd3bf8737" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150732" src="https://github.com/user-attachments/assets/b61ca971-7c36-4b43-a9f2-bffd76c209aa" />
<img width="1920" height="1080" alt="Screenshot 2025-10-22 150334" src="https://github.com/user-attachments/assets/a6ba52a6-e874-4d9c-a2a6-4e7496beaca7" />

