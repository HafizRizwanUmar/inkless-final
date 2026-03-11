import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import AdminSignup from './pages/AdminSignup';
import TeacherSignup from './pages/TeacherSignup';
import Signup from './pages/Signup';
import StudentLogin from './pages/StudentLogin';
import TeacherLogin from './pages/TeacherLogin';
import AdminLogin from './pages/AdminLogin';
import OTP from './pages/OTP';
import ChangePassword from './pages/ChangePassword';

// Dashboards (to be implemented)
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
// Module A & B imports already present...
import CreateClass from './pages/CreateClass';
import JoinClass from './pages/JoinClass';
import ClassDetails from './pages/ClassDetails';
import StudentList from './pages/StudentList';
import StudentManagement from './pages/StudentManagement';
import StudentProfileView from './pages/StudentProfileView';
import CreateAssignment from './pages/CreateAssignment';
import AssignmentDetails from './pages/AssignmentDetails';
// import AssignmentSubmission from './pages/AssignmentSubmission';
import Submissions from './pages/Submissions';
import GradingPage from './pages/GradingPage';
import SubmissionList from './pages/SubmissionList';
import AIGrading from './pages/AIGrading';
import ManualMarking from './pages/ManualMarking';
import DownloadReports from './pages/DownloadReports';
import AIConfidence from './pages/AIConfidence';
import PlagiarismReport from './pages/PlagiarismReport';
import CreateLabTask from './pages/CreateLabTask';
import LabTaskDetails from './pages/LabTaskDetails';
import LabSubmissions from './pages/LabSubmissions';
import LabGradingPage from './pages/LabGradingPage';
import SimilarityComparison from './pages/SimilarityComparison';
import CodeTesting from './pages/CodeTesting';
import QuizBuilder from './pages/QuizBuilder';
import AIQuizGenerator from './pages/AIQuizGenerator';
import QuizSettings from './pages/QuizSettings';
import QuizAttempt from './pages/QuizAttempt';
import QuizResult from './pages/QuizResult';
import QuizAnalytics from './pages/QuizAnalytics';
import QuizSubmissions from './pages/QuizSubmissions';
import CodingQuizTest from './pages/CodingQuizTest';
import CLOReport from './pages/CLOReport';
import WeeklySummary from './pages/WeeklySummary';
import StudentPerformanceReport from './pages/StudentPerformanceReport';
import UserManagement from './pages/UserManagement';
import SystemSettings from './pages/SystemSettings';
import AuditLogs from './pages/AuditLogs';
import BackupRestore from './pages/BackupRestore';
import UserProfile from './pages/UserProfile';
import ArchivedClasses from './pages/ArchivedClasses';

// Placeholder Layout
import DashboardLayout from './layout/DashboardLayout';
import Calendar from './pages/Calendar';

import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<OTP />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/calendar" element={<Calendar />} />

          {/* Module C: Class Management */}
          <Route path="/create-class" element={<CreateClass />} />
          <Route path="/join-class" element={<JoinClass />} />
          <Route path="/class-details/:classId" element={<ClassDetails />} />
          <Route path="/archived" element={<ArchivedClasses />} />
          <Route path="/student-list" element={<StudentList />} />
          <Route path="/student-management" element={<StudentManagement />} />
          <Route path="/student-profile-view" element={<StudentProfileView />} />

          {/* Module D: Assignment */}
          <Route path="/create-assignment/:classId" element={<CreateAssignment />} />
          <Route path="/assignment-details/:assignmentId" element={<AssignmentDetails />} />
          {/* <Route path="/assignment-submission" element={<AssignmentSubmission />} /> */}
          <Route path="/submissions/:assignmentId" element={<Submissions />} />
          <Route path="/submission-list" element={<SubmissionList />} />
          {/* <Route path="/ai-grading" element={<AIGrading />} /> */}
          <Route path="/grading/:submissionId" element={<GradingPage />} />
          {/* <Route path="/manual-marking" element={<ManualMarking />} /> */}
          <Route path="/download-reports" element={<DownloadReports />} />

          {/* Module D+: Lab Tasks */}
          <Route path="/create-lab-task/:classId" element={<CreateLabTask />} />
          <Route path="/lab-task-details/:labId" element={<LabTaskDetails />} />
          <Route path="/lab-submissions/:labId" element={<LabSubmissions />} />
          <Route path="/lab-grading/:submissionId" element={<LabGradingPage />} />

          {/* Module E: AI & Plagiarism */}
          <Route path="/ai-confidence" element={<AIConfidence />} />
          <Route path="/plagiarism-report" element={<PlagiarismReport />} />
          <Route path="/similarity-comparison" element={<SimilarityComparison />} />
          <Route path="/code-testing" element={<CodeTesting />} />

          {/* Module F: Quiz */}
          <Route path="/quiz-builder" element={<QuizBuilder />} />
          <Route path="/ai-quiz-generator" element={<AIQuizGenerator />} />
          <Route path="/quiz-settings" element={<QuizSettings />} />
          <Route path="/quiz-attempt/:quizId" element={<QuizAttempt />} />
          <Route path="/quiz-result" element={<QuizResult />} />
          <Route path="/quiz-submissions/:quizId" element={<QuizSubmissions />} />
          <Route path="/quiz-analytics/:quizId" element={<QuizSubmissions />} />
          <Route path="/coding-quiz-test" element={<CodingQuizTest />} />

          {/* Module G: Analytics */}
          <Route path="/clo-report" element={<CLOReport />} />
          <Route path="/weekly-summary" element={<WeeklySummary />} />
          <Route path="/student-performance-report" element={<StudentPerformanceReport />} />

          {/* Module H: Admin */}
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/system-settings" element={<SystemSettings />} />
          {/* Map general "Settings" button to UserProfile */}
          <Route path="/settings" element={<UserProfile />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/backup-restore" element={<BackupRestore />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
