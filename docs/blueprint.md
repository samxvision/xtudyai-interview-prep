# **App Name**: XtudyAI Interview Prep

## Core Features:

- Landing Page: Displays categories, introduction, and call-to-action for interview preparation.
- Search Interface: Enables users to input questions via text or voice. Implements a search mode selector to query a Firestore database.
- Question Matching Algorithm: Applies a multi-layered algorithm (exact match, keyword, fuzzy, and n-gram) to find relevant questions in the database. Ranks them.
- Answer Display: Shows the matched question, quick answer, key takeaways, and detailed explanation with language toggle and feedback options.
- Voice Input: Uses the Web Speech API to convert voice input into text for question search. Autodetects the language (English/Hinglish)
- Bilingual Support Tool: Allows users to switch between English and Hinglish content for questions and answers via the Google Translate API.
- Firestore Integration: Utilizes Firestore to store and retrieve question-answer pairs and related metadata.

## Style Guidelines:

- Primary color: A saturated, professional-feeling blue (#3B82F6) for focus and reliability. This color suggests technical expertise, which is aligned to the app's use case for QA/QC engineers.
- Background color: A very light blue-tinted gray (#F7FAFC) for a clean, modern look.
- Accent color: A contrasting yellow (#FBBF24) to draw attention to interactive elements and important information. This hue also communicates technical understanding, implying expertise.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text, creating a balance of techy precision and readability.
- Lucide React icons should be used throughout the application, offering consistent and clear visual cues.
- Maintain a clean, responsive layout with consistent spacing and padding across all screens.
- Subtle animations for button hovers, transitions, and feedback indications to enhance the user experience.