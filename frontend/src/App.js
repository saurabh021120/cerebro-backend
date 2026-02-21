import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import LandingPage from "./pages/LandingPage";
import CreateCourse from "./pages/CreateCourse";
import MyCourses from "./pages/MyCourses";
import CourseDashboard from "./pages/CourseDashboard";
import LessonView from "./pages/LessonView";
import QuizPage from "./pages/QuizPage";
import AITutor from "./pages/AITutor";
import AIInterview from "./pages/AIInterview";
import Layout from "./components/Layout";

function App() {
  return (
    <div className="App min-h-screen bg-background">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<Layout />}>
            <Route path="/create" element={<CreateCourse />} />
            <Route path="/courses" element={<MyCourses />} />
            <Route path="/course/:courseId" element={<CourseDashboard />} />
            <Route path="/course/:courseId/lesson/:lessonId" element={<LessonView />} />
            <Route path="/course/:courseId/quiz/:moduleId" element={<QuizPage />} />
            <Route path="/tutor/:courseId" element={<AITutor />} />
            <Route path="/interview" element={<AIInterview />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
