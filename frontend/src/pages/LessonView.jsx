import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { ScrollArea } from "../components/ui/scroll-area";
import { toast } from "sonner";
import axios from "axios";
import MarkdownContent from "../components/MarkdownContent";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  CheckCircle,
  ExternalLink,
  Play,
  FileText,
  MessageCircle,
  Loader2
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function LessonView() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId, lessonId]);

  const fetchData = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        axios.get(`${API}/courses/${courseId}`),
        axios.get(`${API}/progress/${courseId}`)
      ]);
      
      setCourse(courseRes.data);
      setProgress(progressRes.data);
      
      // Find the lesson and its module
      for (const mod of courseRes.data.modules) {
        const foundLesson = mod.lessons.find(l => l.id === lessonId);
        if (foundLesson) {
          setLesson(foundLesson);
          setModule(mod);
          break;
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load lesson");
      navigate(`/course/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async () => {
    setCompleting(true);
    try {
      await axios.post(`${API}/progress/update`, {
        course_id: courseId,
        module_id: module.id,
        lesson_id: lessonId,
        completed: true
      });
      
      setProgress(prev => ({
        ...prev,
        completed_lessons: [...(prev?.completed_lessons || []), lessonId]
      }));
      
      toast.success("Lesson completed! +25 XP");
    } catch (error) {
      toast.error("Failed to update progress");
    } finally {
      setCompleting(false);
    }
  };

  const getAdjacentLessons = () => {
    if (!course || !module || !lesson) return { prev: null, next: null };
    
    const allLessons = [];
    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        allLessons.push({ lesson: l, module: m });
      });
    });
    
    const currentIndex = allLessons.findIndex(item => item.lesson.id === lessonId);
    
    return {
      prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
    };
  };

  const isCompleted = progress?.completed_lessons?.includes(lessonId);
  const { prev, next } = getAdjacentLessons();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!lesson || !module) return null;

  // Calculate lesson number
  let lessonNumber = 0;
  let totalLessons = 0;
  course.modules.forEach(m => {
    m.lessons.forEach(l => {
      totalLessons++;
      if (l.id === lessonId) {
        lessonNumber = totalLessons;
      }
    });
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to={`/course/${courseId}`} className="hover:text-foreground transition-colors">
          {course.title}
        </Link>
        <span>/</span>
        <span>{module.title}</span>
        <span>/</span>
        <span className="text-foreground">{lesson.title}</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Lesson {lessonNumber} of {totalLessons}</span>
          <span className="text-muted-foreground">
            {Math.round((lessonNumber / totalLessons) * 100)}% complete
          </span>
        </div>
        <Progress value={(lessonNumber / totalLessons) * 100} className="h-2" />
      </div>

      {/* Main Content */}
      <div className="glass-card rounded-2xl p-6 md:p-8 mb-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isCompleted && (
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lesson.duration_minutes} min
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-testid="lesson-title">
              {lesson.title}
            </h1>
          </div>
          
          <Link to={`/tutor/${courseId}`}>
            <Button variant="outline" className="rounded-full" data-testid="btn-ask-tutor">
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask Tutor
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-8">
          <MarkdownContent content={lesson.content} />
        </div>

        {/* Resources */}
        {lesson.resources.length > 0 && (
          <div className="border-t border-white/10 pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Additional Resources
            </h3>
            <div className="grid gap-3">
              {lesson.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-white/5 hover:border-primary/50 transition-all resource-link"
                  data-testid={`resource-link-${index}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    resource.type === 'video' ? 'bg-red-500/20 text-red-400' :
                    resource.type === 'article' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {resource.type === 'video' ? <Play className="w-5 h-5" /> :
                     resource.type === 'article' ? <FileText className="w-5 h-5" /> :
                     <BookOpen className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{resource.type}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {prev && (
            <Link to={`/course/${courseId}/lesson/${prev.lesson.id}`}>
              <Button variant="outline" className="rounded-full" data-testid="btn-prev-lesson">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            </Link>
          )}
          
          <Link to={`/course/${courseId}`}>
            <Button variant="ghost" className="rounded-full">
              Back to Course
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {!isCompleted && (
            <Button 
              onClick={markComplete} 
              disabled={completing}
              className="rounded-full btn-glow"
              data-testid="btn-mark-complete"
            >
              {completing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Mark as Complete
            </Button>
          )}
          
          {next && (
            <Link to={`/course/${courseId}/lesson/${next.lesson.id}`}>
              <Button className="rounded-full btn-glow" data-testid="btn-next-lesson">
                Next Lesson
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
          
          {!next && module.quiz && (
            <Link to={`/course/${courseId}/quiz/${module.id}`}>
              <Button className="rounded-full btn-glow" data-testid="btn-take-quiz">
                Take Module Quiz
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
