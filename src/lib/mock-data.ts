// Frontend/src/lib/mock-data.ts
import type { Student, Course, Grade, Class, FeeDetails } from './types';
import { apiRequest, isLoggedIn } from './api';

export const login = async (username: string, password: string) => {
    const data = await apiRequest('/token/', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
    if (data.access) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
    }
    return data;
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
};

export const getStudentProfile = async (): Promise<Student> => {
    return await apiRequest('/core/profile/');
};

export const getAvailableCourses = async (term: string): Promise<Course[]> => {
    const data = await apiRequest('/academics/courses/');
    return data.map((c: any) => ({
        id: c.id.toString(),
        code: c.code,
        name: c.name,
        credits: c.credits,
        instructor: c.instructor,
        schedule: {
            day: Object.keys(c.schedule)[0] || 'Monday',
            startTime: Object.values(c.schedule)[0]?.toString().split('-')[0] || '10:00',
            endTime: Object.values(c.schedule)[0]?.toString().split('-')[1] || '11:00',
        }
    }));
};

export const getGrades = async (): Promise<Grade[]> => {
    const data = await apiRequest('/academics/grades/');
    return data.map((g: any) => ({
        courseCode: g.course_code,
        courseName: g.course_name,
        courseType: g.course_type,
        credits: g.credits,
        grade: g.grade,
        gradePoints: g.grade_points,
        semester: g.semester,
        instructorFeedback: g.feedback || 'No feedback provided.',
    }));
};

// SYNCED: Fetches classes from approved enrollments
export const getUpcomingClasses = async (): Promise<Class[]> => {
    try {
        return await apiRequest('/academics/enrollments/timetable/');
    } catch {
        return [];
    }
};

export const enrollInCourse = async (courseId: string) => {
    return await apiRequest('/academics/enrollments/', {
        method: 'POST',
        body: JSON.stringify({ course: courseId })
    });
};

export const finalizeRegistration = async () => {
    return await apiRequest('/academics/enrollments/finalize/', { method: 'POST' });
};

export const getFeeDetails = async (): Promise<FeeDetails> => {
    try {
        const history = await apiRequest('/finance/history/');
        const dues = await apiRequest('/finance/dues/');
        return { paymentHistory: history, pendingDues: dues };
    } catch {
        return { paymentHistory: [], pendingDues: [] };
    }
};

export const getProjects = async () => {
    return await apiRequest('/projects/');
};

export const getEmployees = async (): Promise<{id: string, name: string}[]> => {
    return [
        { id: "prof1", name: "Dr. Smith (CSE)" },
        { id: "prof2", name: "Dr. Jones (ECE)" },
        { id: "prof3", name: "Dr. Patel (Design)" },
        { id: "dean.acad", name: "Dean of Academics" }
    ];
};

export const submitProfileChangeRequest = async (changes: any) => {
    return await apiRequest('/core/profile-requests/', {
        method: 'POST',
        body: JSON.stringify({ requested_changes: changes })
    });
};

export const getProfileChangeRequests = async () => {
    return await apiRequest('/core/profile-requests/');
};
