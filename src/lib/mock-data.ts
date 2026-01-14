import type { Student, Course, Grade, Class, FeeDetails } from './types';
import { PlaceHolderImages } from './placeholder-images';

const studentAvatar = PlaceHolderImages.find(img => img.id === 'student-avatar')?.imageUrl || '';

export const mockStudent: Student = {
  id: '2021001',
  name: 'Alex Doe',
  email: 'alex.doe@iiitd.ac.in',
  rollNumber: '2021001',
  program: 'B.Tech. Computer Science and Engineering',
  cgpa: 8.49,
  creditsCompleted: 120,
  avatarUrl: studentAvatar,
};

export const mockCourses: Course[] = [
  { id: 'cse101', code: 'CSE101', name: 'Introduction to Programming', credits: 4, instructor: 'Dr. Smith', schedule: { day: 'Monday', startTime: '10:00', endTime: '11:00' } },
  { id: 'mat202', code: 'MAT202', name: 'Linear Algebra', credits: 4, instructor: 'Dr. Jones', schedule: { day: 'Monday', startTime: '11:00', endTime: '12:00' } },
  { id: 'des101', code: 'DES101', name: 'Design Fundamentals', credits: 3, instructor: 'Dr. Patel', schedule: { day: 'Tuesday', startTime: '14:00', endTime: '15:30' } },
  { id: 'cse201', code: 'CSE201', name: 'Data Structures', credits: 4, instructor: 'Dr. Smith', schedule: { day: 'Wednesday', startTime: '09:00', endTime: '10:00' } },
  { id: 'ece210', code: 'ECE210', name: 'Digital Circuits', credits: 4, instructor: 'Dr. Reddy', schedule: { day: 'Wednesday', startTime: '11:00', endTime: '12:00' } },
  { id: 'ssh105', code: 'SSH105', name: 'Intro to Psychology', credits: 3, instructor: 'Dr. Verma', schedule: { day: 'Thursday', startTime: '16:00', endTime: '17:30' } },
  { id: 'cse300', code: 'CSE300', name: 'Advanced Algorithms', credits: 4, instructor: 'Dr. Kumar', schedule: { day: 'Friday', startTime: '10:00', endTime: '11:00' } },
  { id: 'cse370', code: 'CSE370', name: 'Artificial Intelligence', credits: 4, instructor: 'Dr. Singh', schedule: { day: 'Tuesday', startTime: '10:00', endTime: '11:00' } },
];

export const mockGrades: Grade[] = [
    { courseCode: 'CSE101', courseName: 'Introduction to Programming', courseType: 'Core', credits: 4, grade: 'A', gradePoints: 10, semester: 'Monsoon 2021', instructorFeedback: 'Excellent work on the final project. Keep up the great problem-solving skills.' },
    { courseCode: 'MAT101', courseName: 'Calculus I', courseType: 'Core', credits: 4, grade: 'A-', gradePoints: 9, semester: 'Monsoon 2021', instructorFeedback: 'Strong performance on exams, but could participate more in class discussions.' },
    { courseCode: 'PHY101', courseName: 'Physics I', courseType: 'Elective', credits: 4, grade: 'B+', gradePoints: 8, semester: 'Monsoon 2021', instructorFeedback: 'Good understanding of concepts. Lab reports need more detail.' },
    { courseCode: 'SSH101', courseName: 'Communication Skills', courseType: 'Elective', credits: 3, grade: 'A', gradePoints: 10, semester: 'Monsoon 2021', instructorFeedback: 'A very articulate and thoughtful contributor to the class.' },
    { courseCode: 'CSE102', courseName: 'Data Structures', courseType: 'Core', credits: 4, grade: 'A-', gradePoints: 9, semester: 'Winter 2022', instructorFeedback: 'You have a knack for complex data structures. The implementation of the graph algorithms was impressive.' },
    { courseCode: 'MAT201', courseName: 'Linear Algebra', courseType: 'Core', credits: 4, grade: 'B', gradePoints: 7, semester: 'Winter 2022', instructorFeedback: 'Solid effort, but ensure you review matrix decomposition concepts for future courses.' },
    { courseCode: 'ECE110', courseName: 'Introduction to ECE', courseType: 'Elective', credits: 4, grade: 'B+', gradePoints: 8, semester: 'Winter 2022', instructorFeedback: 'You did well on the practical assignments. Focus on strengthening your theoretical foundations.' },
];

export const mockUpcomingClasses: Class[] = [
    { id: '1', courseName: 'Linear Algebra', courseCode: 'MAT202', startTime: '11:00', endTime: '12:00', location: 'C-201' },
    { id: '2', courseName: 'Design Fundamentals', courseCode: 'DES101', startTime: '14:00', endTime: '15:30', location: 'A-103' },
    { id: '3', courseName: 'Intro to Psychology', courseCode: 'SSH105', startTime: '16:00', endTime: '17:30', location: 'B-305' },
];

export const mockEmployees = [
  { id: "emp1", name: "Mr. Sharma (Hostel Office)" },
  { id: "emp2", name: "Ms. Gupta (Admin Office)" },
  { id: "emp3", name: "Mr. Singh (Guest House Manager)" },
  { id: "emp4", name: "Dean of Student Affairs" },
  { id: "emp5", name: "Head of Department (CSE)" },
];

export const mockFeeDetails: FeeDetails = {
    paymentHistory: [
        { transactionId: 'TXN1234567890', date: '2024-07-15', description: 'Monsoon 2024 Semester Fee', amount: 180000, status: 'Successful' },
        { transactionId: 'TXN0987654321', date: '2024-01-10', description: 'Winter 2024 Semester Fee', amount: 180000, status: 'Successful' },
        { transactionId: 'TXN5647382910', date: '2023-07-14', description: 'Monsoon 2023 Semester Fee', amount: 175000, status: 'Successful' },
    ],
    pendingDues: [
        { id: 'due1', description: 'Hostel Fee - Monsoon 2024', amount: 45000 },
        { id: 'due2', description: 'Library Fine', amount: 250 },
    ]
}


// Simulate API calls
export const getStudentProfile = async (): Promise<Student> => {
  return new Promise(resolve => setTimeout(() => resolve(mockStudent), 500));
};

export const getAvailableCourses = async (term: string): Promise<Course[]> => {
  console.log(`Fetching courses for ${term}`);
  return new Promise(resolve => setTimeout(() => resolve(mockCourses), 700));
};

export const getGrades = async (): Promise<Grade[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockGrades), 600));
};

export const getUpcomingClasses = async (): Promise<Class[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockUpcomingClasses), 800));
};

export const getEmployees = async (): Promise<{id: string, name: string}[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockEmployees), 300));
}

export const getFeeDetails = async (): Promise<FeeDetails> => {
    return new Promise(resolve => setTimeout(() => resolve(mockFeeDetails), 400));
}
