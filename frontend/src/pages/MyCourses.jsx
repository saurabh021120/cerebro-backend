import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";
import axios from "axios";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  BookOpen,
  Clock,
  Target,
  PlusCircle,
  Trash2,
  Play,
  Sparkles,
  Loader2
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, courseId: null, courseName: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API}/courses`);
      setCourses(response.data);
      
      // Fetch progress for each course
      const progressData = {};
      for (const course of response.data) {
        try {
          const progressRes = await axios.get(`${API}/progress/${course.id}`);
          progressData[course.id] = progressRes.data;
        } catch (e) {
          progressData[course.id] = { completed_lessons: [], quiz_scores: {} };
        }
      }
      setProgress(progressData);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (courseId, courseName, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDeleteDialog({ open: true, courseId, courseName });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/courses/${deleteDialog.courseId}`);
      toast.success("Course deleted");
      setCourses(courses.filter(c => c.id !== deleteDialog.courseId));
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const calculateProgress = (course) => {
    const courseProgress = progress[course.id];
    if (!courseProgress) return 0;
    
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedLessons = courseProgress.completed_lessons?.length || 0;
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" data-testid="my-courses-title">
            My Courses
          </h1>
          <p className="text-muted-foreground">
            Continue learning or start a new journey.
          </p>
        </div>
        <Link to="/create">
          <Button className="rounded-full btn-glow" data-testid="btn-create-new">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-12 text-center"
          data-testid="empty-state"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first AI-powered course and start learning!
          </p>
          <Link to="/create">
            <Button className="rounded-full btn-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Your First Course
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const courseProgress = calculateProgress(course);
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/course/${course.id}`}
                  className="block"
                  data-testid={`course-card-${index}`}
                >
                  <div className="glass-card rounded-2xl overflow-hidden hover:border-primary/50 transition-all group">
                    {/* Thumbnail */}
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => handleDelete(course.id, course.title, e)}
                          className="p-2 rounded-lg bg-black/50 hover:bg-destructive/80 transition-colors"
                          data-testid={`delete-course-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                          course.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {course.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.modules.length} modules</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration_weeks} weeks</span>
                        </div>
                      </div>
                      
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{courseProgress}%</span>
                        </div>
                        <Progress value={courseProgress} className="h-2" />
                      </div>
                      
                      {/* Action */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {progress[course.id]?.completed_lessons?.length || 0} / {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons
                        </span>
                        <div className="flex items-center gap-1 text-primary text-sm font-medium">
                          <Play className="w-4 h-4" />
                          Continue
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, courseId: null, courseName: '' })}
        onConfirm={confirmDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${deleteDialog.courseName}"? This action cannot be undone.`}
      />
    </div>
  );
}
