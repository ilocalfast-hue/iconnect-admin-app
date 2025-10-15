# Project Blueprint

## Overview

This project is a Next.js application with a public-facing service request form and an admin dashboard. The dashboard is designed to manage service requests, providers, services, users, and jobs. The application is styled with Tailwind CSS and uses Heroicons for iconography. It is integrated with Firebase Firestore for data storage and Firebase Authentication for user login.

## Features

### Public-Facing

*   **Service Request Form:** A form for users to submit service requests. The form captures the user's name, email, phone number, preferred date, and a description of the service needed.

### Admin Dashboard

*   **Authentication:** *(Implemented)* The admin dashboard is protected by Firebase Authentication. Only authenticated users can access the admin pages.
*   **Requests Page:** *(Implemented)* Displays a real-time table of service requests from Firestore. Admin can approve or reject requests. The table includes sorting and filtering.
*   **Providers Page:** *(Implemented)* Displays a real-time table of service providers from Firestore. Admin can toggle provider availability. The table includes sorting and filtering.
*   **Services Page:** *(Implemented)* Displays a real-time table of services from Firestore. Admin can toggle service status and featured status. The table includes sorting and filtering.
*   **Users Page:** *(Implemented)* Displays a real-time table of users from Firestore. Admin can change user status. The table includes sorting and filtering.
*   **Jobs Page:** *(Implemented)* Displays a real-time table of jobs from Firestore. Admin can change job status and payment status. The table includes sorting and filtering.
*   **Navigation:** A navigation bar allows users to switch between the different pages.

### Backend

*   **Firestore Integration:** The application uses Firebase Firestore to store and manage service requests, providers, services, users, and jobs.
*   **Firebase Authentication:** The application uses Firebase Authentication to secure the admin dashboard.
*   **Server Actions:** A Next.js server action is used to handle form submissions and save data to Firestore.

### Styling

*   **Tailwind CSS:** The application is styled with Tailwind CSS.
*   **Heroicons:** Using icons from the `@heroicons/react` library for a clean and modern UI.

## Development Log

*   **Initial Setup:** Created the Next.js project and set up the basic file structure.
*   **Admin Pages:** Implemented initial versions of the Users, Providers, Services, Leads, and Jobs pages with detailed tables.
*   **Bug Fixes:** Corrected multiple runtime and build errors related to incorrect `heroicons` import paths.
*   **Firestore Integration:** Initialized Firebase and Firestore in the project.
*   **Service Request Form:** Created a public-facing form for users to submit service requests.
*   **Server Action:** Implemented a server action to save service request data to Firestore.
*   **Requests Page:** Converted the "Leads" page to a "Requests" page that displays real-time data from the `serviceRequests` collection in Firestore.
*   **Providers Page:** Connected the "Providers" page to Firestore, displaying real-time provider data and allowing for availability updates.
*   **Services Page:** Connected the "Services" page to Firestore, displaying real-time service data and allowing for status and featured updates.
*   **Users Page:** Connected the "Users" page to Firestore, displaying real-time user data and allowing for status updates.
*   **Jobs Page:** Connected the "Jobs" page to Firestore, displaying real-time job data and allowing for status and payment status updates.
*   **Admin Layout:** Created a shared layout and navigation for the admin dashboard.
*   **Authentication:** Implemented a login page and an `AuthGuard` component to protect the admin dashboard.

## Current Plan

*   **Core Functionality Complete:** The core functionality of submitting and managing service requests, providers, services, users, and jobs, as well as admin authentication, is complete.
*   **Next Steps:**
    *   Implement email notifications for service request status changes.
    *   Enhance the UI/UX of the application.
