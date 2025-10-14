
# Next.js & Firebase Project

This is a Next.js project integrated with Firebase, featuring Cloud Functions and Firebase Hosting. This guide provides all the necessary instructions to set up, run, and deploy this application.

## Project Structure

The project is organized as follows:

```
/
|-- app/                # Next.js App Router directory
|   |-- (admin)/        # Admin-only routes
|   |   |-- admin/
|   |   |   |-- requests/ # Job approval requests
|   |   |   |-- credits/  # User credit management
|   |   |   `-- settings/ # Admin settings
|   |-- layout.tsx      # Root layout
|   `-- page.tsx        # Home page
|
|-- functions/          # Firebase Cloud Functions
|   |-- src/
|   |   `-- index.ts    # Main functions file
|   `-- package.json
|
|-- scripts/            # Helper scripts
|   `-- setAdmin.js     # Script to assign admin custom claims
|
|-- firebase.json       # Firebase project configuration
|-- .firebaserc       # Firebase project alias configuration
|-- next.config.js      # Next.js configuration
|-- package.json        # Project dependencies
`-- tsconfig.json       # TypeScript configuration

```

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- A Firebase project

### 2. Installation

Clone the repository and install the dependencies for both the Next.js app and the Cloud Functions:

```bash
# Install root dependencies
npm install

# Install function dependencies
cd functions
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env.local` file in the root of the project and add your Firebase project's web app configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
```

### 4. Setting Up an Admin User

To access the admin dashboard, you need to assign a custom `admin` claim to a user.

1.  **Create a Service Account:**
    - Go to your Firebase Project Settings > Service Accounts.
    - Click **Generate new private key** and save the JSON file.
    - **IMPORTANT:** Move this file to a secure location outside your project's source code (e.g., in a parent directory).

2.  **Run the `setAdmin.js` Script:**
    - Open `scripts/setAdmin.js`.
    - Update the `serviceAccount` path to point to your downloaded service account key.
    - Update `userEmail` with the email of the user you want to make an admin.
    - Run the script:

    ```bash
    node scripts/setAdmin.js
    ```

## Local Development with Emulators

To develop and test locally, use the Firebase Emulators.

### 1. Initialize Emulators

If you haven't already, initialize the emulators you need:

```bash
firebase init emulators
```

Select **Authentication**, **Functions**, and **Firestore**.

### 2. Start the Emulators and Dev Server

In one terminal, start the Firebase Emulators:

```bash
firebase emulators:start
```

In another terminal, start the Next.js development server:

```bash
npm run dev
```

Your app will be running at `http://localhost:3000` and the Emulator UI at `http://localhost:4000`.

## Deployment

### 1. Deploying Cloud Functions

To deploy only the Cloud Functions:

```bash
firebase deploy --only functions
```

### 2. Deploying to Firebase Hosting

To deploy the Next.js application to Firebase Hosting:

```bash
firebase deploy --only hosting
```

### 3. Full Deployment

To deploy all services (Functions, Hosting, and Firestore rules):

```bash
firebase deploy
```

After deployment, your Next.js application will be live on the Firebase Hosting URL provided in the CLI output.

