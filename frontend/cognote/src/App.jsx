import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardPage from './pages/Dashboard/DashboardPage';
import DocumentListPage from './pages/Documents/DocumentListPage';
import DocumentsDetailsPage from './pages/Documents/DocumentsDetailsPage';
import FlashCardListPage from './pages/Flashcards/FlashCardListPage';
import FlashCardPage from './pages/Flashcards/FlashCardPage';
import QuizTakePage from './pages/Quizzes/QuizTakePage';
import QuizResultPage from './pages/Quizzes/QuizResultPage';
import ProfilePage from './pages/Profile/ProfilePage';
import { useAuth } from './context/AuthContext';

const App = () => {
  const  {isAuthenticated, loading} = useAuth();

  if (loading) {
    return (
    <div className='flex items-center justify-center h-screen'>Loading...</div>
   );
  }

  return(
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace/> : <Navigate to="/login" replace/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentsDetailsPage />} />
          <Route path="/flashcards" element={<FlashCardListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashCardPage />} />
          <Route path="/quizzes/:quizid" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizid/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App