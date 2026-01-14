export type Student = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  rollNumber: string;
  program: string;
  cgpa: number;
  creditsCompleted: number;
  avatarUrl: string;
  isActive: boolean;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  schedule: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    startTime: string; // "HH:MM"
    endTime: string; // "HH:MM"
  };
};

export type Grade = {
  courseCode: string;
  courseName: string;
  credits: number;
  grade: 'A+' | 'A' | 'A-' | 'B' | 'B-' | 'C' | 'C-' | 'D' | 'F';
  gradePoints: number;
  semester: string;
  instructorFeedback: string;
  courseType: 'Core' | 'Elective';
};

export type Class = {
  id: string;
  courseName: string;
  courseCode: string;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  location: string;
};

export type FeePayment = {
    transactionId: string;
    date: string;
    description: string;
    amount: number;
    status: 'Successful' | 'Failed' | 'Pending';
}

export type FeeDue = {
    id: string;
    description: string;
    amount: number;
}

export type FeeDetails = {
    paymentHistory: FeePayment[];
    pendingDues: FeeDue[];
}
