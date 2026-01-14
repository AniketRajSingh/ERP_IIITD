# **App Name**: IIITD ERP

## Core Features:

- Dashboard: Display key academic data in a bento-box layout, including Academic Health chart, Attendance progress, and Upcoming Classes timeline.
- Student Profile API Integration: Fetch and display student profile data, including CGPA, from the Django REST API.
- Course Registration: Implement course registration with batch/term selector, credit limit validation, and schedule overlap detection using the Django API.
- Workflow Request System: Replicate the 'Forward to Next Employee' system for hostel/guest house requests, including request type, purpose, guest details, and assignee selection.
- Dual Degree Eligibility: Implement an eligibility lock for the Dual Degree page based on the student's CGPA (>= 8.5) from the Django API response.
- Grade Analytics: Display detailed grade history with expandable rows for instructor feedback and grade points.
- Global UI State Management: Manage global UI state, such as sidebar toggle and theme switching, using Zustand.

## Style Guidelines:

- Primary color: Google Blue (#1c74e9) for a clean and modern feel.
- Surface color: White with semi-transparent effect for light theme (#FFFFFF), Dark gray with semi-transparent effect for dark theme (#111821).
- Background color: Light blue (#E6F2FF) in light mode and dark gray (#1A202C) in dark mode.
- Font pairing: 'Poppins' (sans-serif) for headlines, providing a geometric and contemporary look, paired with 'PT Sans' (sans-serif) for body text to ensure readability.
- Lucide Icons: Use consistent and modern icons from Lucide for UI elements.
- Glassmorphism Design: Use semi-transparent white/dark cards with a 12px backdrop-blur effect for a modern and visually appealing UI.
- Skeleton Shimmers: Implement loading animations for every card using skeleton shimmers to provide a smooth user experience during data loading.