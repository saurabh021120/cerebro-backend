import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import { toast } from "sonner";
import axios from "axios";
import {
  BookOpen,
  Clock,
  Target,
  MessageCircle,
  Play,
  CheckCircle,
  Lock,
  Trophy,
  Sparkles,
  Loader2,
  ChevronRight,
  FileText,
  Award
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CourseDashboard() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    fetchCourse();
    fetchProgress();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`${API}/courses/${courseId}`);
      setCourse(response.data);
      if (response.data.modules.length > 0) {
        setActiveModule(response.data.modules[0].id);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Course not found");
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`${API}/progress/${courseId}`);
      setProgress(response.data);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const calculateOverallProgress = () => {
    if (!course || !progress) return 0;
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedLessons = progress.completed_lessons?.length || 0;
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const isLessonCompleted = (lessonId) => {
    return progress?.completed_lessons?.includes(lessonId) || false;
  };

  const getModuleProgress = (module) => {
    if (!progress) return 0;
    const completedInModule = module.lessons.filter(l => 
      progress.completed_lessons?.includes(l.id)
    ).length;
    return module.lessons.length > 0 
      ? Math.round((completedInModule / module.lessons.length) * 100) 
      : 0;
  };

  const getQuizScore = (moduleId) => {
    return progress?.quiz_scores?.[moduleId] || null;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  const overallProgress = calculateOverallProgress();
  const currentModule = course.modules.find(m => m.id === activeModule);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Course Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                course.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                course.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {course.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                {course.duration_weeks} weeks
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3" data-testid="course-title">
              {course.title}
            </h1>
            <p className="text-muted-foreground mb-6 line-clamp-2">
              {course.description}
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>{course.modules.length} modules</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-primary" />
                <span>{course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-primary" />
                <span>{course.goal}</span>
              </div>
            </div>
          </div>
          
          {/* Progress Card */}
          <div className="lg:w-72 glass-card rounded-xl p-5 bg-card/80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Your Progress</span>
              <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3 mb-4" />
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">XP Earned</p>
                <p className="text-lg font-semibold">{progress?.xp || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-lg font-semibold">{progress?.completed_lessons?.length || 0} lessons</p>
              </div>
            </div>
            
            <Link to={`/tutor/${courseId}`}>
              <Button className="w-full rounded-full" variant="outline" data-testid="btn-ai-tutor">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask AI Tutor
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Modules List */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Modules</h2>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {course.modules.map((module, index) => {
                const moduleProgress = getModuleProgress(module);
                const quizScore = getQuizScore(module.id);
                const isActive = activeModule === module.id;
                
                return (
                  <motion.button
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveModule(module.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      isActive 
                        ? 'glass-card border-primary/50' 
                        : 'bg-card/30 hover:bg-card/50 border border-transparent'
                    }`}
                    data-testid={`module-btn-${index}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        moduleProgress === 100 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-primary/20 text-primary'
                      }`}>
                        {moduleProgress === 100 ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 line-clamp-1">{module.title}</h3>
                        <div className="flex items-center gap-2">
                          <Progress value={moduleProgress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{moduleProgress}%</span>
                        </div>
                        {quizScore !== null && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                            <Trophy className="w-3 h-3" />
                            <span>Quiz: {quizScore}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Module Content */}
        <div className="lg:col-span-2">
          {currentModule && (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{currentModule.title}</h2>
                  <p className="text-sm text-muted-foreground">{currentModule.description}</p>
                </div>
                {currentModule.quiz && (
                  <Link to={`/course/${courseId}/quiz/${currentModule.id}`}>
                    <Button variant="outline" className="rounded-full" data-testid="btn-take-quiz">
                      <Award className="w-4 h-4 mr-2" />
                      Take Quiz
                    </Button>
                  </Link>
                )}
              </div>

              <Tabs defaultValue="lessons">
                <TabsList className="mb-6">
                  <TabsTrigger value="lessons">Lessons</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="lessons">
                  <div className="space-y-3">
                    {currentModule.lessons.map((lesson, index) => {
                      const completed = isLessonCompleted(lesson.id);
                      
                      return (
                        <Link
                          key={lesson.id}
                          to={`/course/${courseId}/lesson/${lesson.id}`}
                          data-testid={`lesson-link-${index}`}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 rounded-xl border transition-all hover:border-primary/50 ${
                              completed 
                                ? 'bg-green-500/5 border-green-500/20' 
                                : 'bg-card/50 border-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                completed 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-secondary text-muted-foreground'
                              }`}>
                                {completed ? (
                                  <CheckCircle className="w-5 h-5" />
                                ) : (
                                  <Play className="w-5 h-5" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">{lesson.title}</h4>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {lesson.duration_minutes} min
                                  </span>
                                  <span>{lesson.resources.length} resources</span>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="resources">
                  <div className="space-y-3">
                    {currentModule.lessons.flatMap(lesson => 
                      lesson.resources.map((resource, idx) => (
                        <a
                          key={`${lesson.id}-${idx}`}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 rounded-xl bg-card/50 border border-white/5 hover:border-primary/50 transition-all resource-link"
                        >
                          <div className="flex items-center gap-3">
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
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
