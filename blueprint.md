
# Project Blueprint

## Overview

A web application that allows users to sign up, log in, and view a dashboard. Administrators have access to a separate admin dashboard.

## Implemented Features

*   **User Authentication:**
    *   Sign-up page (`/signup`) that allows users to create an account.
    *   Login page (`/login`) that allows users to sign in.
*   **Routing:**
    *   Home page (`/`) for authenticated non-admin users.
    *   Admin requests page (`/admin/requests`) for authenticated admin users.
    *   Admin credits page (`/admin/credits`) for authenticated admin users.
    *   Admin settings page (`/admin/settings`) for authenticated admin users.
    *   Redirects to the admin dashboard (`/admin/requests`) for admin users upon login.
    *   Redirects to the homepage (`/`) for non-admin users upon login.
*   **Firebase Integration:**
    *   `firebase` npm package has been installed.
    *   The application is set up to use Firebase Authentication.
*   **Admin Panel:**
    *   Created an admin panel at `/admin` with a modern UI.
    *   Added navigation for `requests`, `credits`, and `settings`.
    *   Included a `Header` component with user display name and a logout button.
*   **Styling:**
    *   Used Tailwind CSS for styling.
    *   Added `@heroicons/react` for icons.
*   **Components:**
    *   Created `AdminNav` and `Header` components.
*   **Hooks:**
    *   Created `useAuth` hook for authentication state management.
*   **Code Quality:**
    *   Linting has been set up and all linting errors have been resolved.

## Current Plan

The application now has a functional admin panel. The next steps will involve implementing the features within each section of the admin panel, such as managing user requests, credits, and application settings.
