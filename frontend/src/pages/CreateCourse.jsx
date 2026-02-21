import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";
import axios from "axios";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Target, 
  Clock, 
  FileText,
  Loader2,
  CheckCircle
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const steps = [
  { id: 1, title: "Topic", icon: BookOpen, description: "What do you want to learn?" },
  { id: 2, title: "Goal", icon: Target, description: "What's your learning objective?" },
  { id: 3, title: "Duration", icon: Clock, description: "How long do you have?" },
  { id: 4, title: "Details", icon: FileText, description: "Any additional context?" },
];

const goalSuggestions = [
  "Get a job as a developer",
  "Pass a certification exam",
  "Build personal projects",
  "Career transition",
  "Academic requirements",
  "Personal interest"
];

export default function CreateCourse() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    goal: "",
    duration_weeks: 4,
    additional_info: ""
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep === 1 && !formData.topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    if (currentStep === 2 && !formData.goal.trim()) {
      toast.error("Please enter your learning goal");
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim() || !formData.goal.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post(`${API}/courses/generate`, formData);
      toast.success("Course generated successfully!");
      navigate(`/course/${response.data.id}`);
    } catch (error) {
      console.error("Error generating course:", error);
      toast.error(error.response?.data?.detail || "Failed to generate course");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="topic" className="text-lg font-medium mb-3 block">
                What would you like to learn?
              </Label>
              <Input
                id="topic"
                data-testid="input-topic"
                placeholder="e.g., Machine Learning, React Development, Data Science..."
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="h-14 text-lg bg-input/50 border-transparent focus:border-primary input-glow"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["Python Programming", "Web Development", "Machine Learning", "Data Science", "Cloud Computing", "Cybersecurity"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setFormData({ ...formData, topic: suggestion })}
                  className="px-4 py-2 rounded-full bg-secondary/50 text-sm hover:bg-secondary transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="goal" className="text-lg font-medium mb-3 block">
                What's your learning goal?
              </Label>
              <Input
                id="goal"
                data-testid="input-goal"
                placeholder="e.g., Build production-ready applications, Pass AWS certification..."
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="h-14 text-lg bg-input/50 border-transparent focus:border-primary input-glow"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {goalSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setFormData({ ...formData, goal: suggestion })}
                  className="px-4 py-2 rounded-full bg-secondary/50 text-sm hover:bg-secondary transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="duration" className="text-lg font-medium mb-3 block">
                How long do you want to spend learning?
              </Label>
              <Select
                value={formData.duration_weeks.toString()}
                onValueChange={(value) => setFormData({ ...formData, duration_weeks: parseInt(value) })}
              >
                <SelectTrigger 
                  className="h-14 text-lg bg-input/50 border-transparent"
                  data-testid="select-duration"
                >
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 week - Quick crash course</SelectItem>
                  <SelectItem value="2">2 weeks - Focused learning</SelectItem>
                  <SelectItem value="4">4 weeks - Comprehensive</SelectItem>
                  <SelectItem value="8">8 weeks - In-depth mastery</SelectItem>
                  <SelectItem value="12">12 weeks - Complete bootcamp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <p className="text-muted-foreground mb-2">Recommended study time</p>
              <p className="text-2xl font-semibold">
                {formData.duration_weeks * 5}-{formData.duration_weeks * 10} hours total
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                About {Math.round((formData.duration_weeks * 7.5) / formData.duration_weeks)} hours per week
              </p>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="additional_info" className="text-lg font-medium mb-3 block">
                Any additional context? (Optional)
              </Label>
              <Textarea
                id="additional_info"
                data-testid="input-additional-info"
                placeholder="e.g., I have basic programming knowledge, I prefer hands-on projects, I'm preparing for interviews..."
                value={formData.additional_info}
                onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                className="min-h-32 text-lg bg-input/50 border-transparent focus:border-primary input-glow resize-none"
              />
            </div>
            
            {/* Summary */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-lg">Course Summary</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Topic</p>
                    <p className="font-medium">{formData.topic || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Goal</p>
                    <p className="font-medium">{formData.goal || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{formData.duration_weeks} weeks</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-2" data-testid="generating-message">Generating Your Course</h2>
          <p className="text-muted-foreground mb-8">
            Our AI is creating a personalized curriculum just for you...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" data-testid="create-course-title">
          Create Your Course
        </h1>
        <p className="text-muted-foreground">
          Tell us what you want to learn and we'll create a personalized curriculum.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div
                key={step.id}
                className={`flex items-center gap-2 ${
                  isCurrent ? 'text-primary' : isCompleted ? 'text-primary/60' : 'text-muted-foreground'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isCurrent ? 'bg-primary text-white' : isCompleted ? 'bg-primary/20' : 'bg-secondary'
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className="hidden sm:block font-medium">{step.title}</span>
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          {(() => {
            const CurrentIcon = steps[currentStep - 1].icon;
            return <CurrentIcon className="w-6 h-6 text-primary" />;
          })()}
          <div>
            <h2 className="text-xl font-semibold">{steps[currentStep - 1].title}</h2>
            <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="rounded-full px-6"
          data-testid="btn-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            className="rounded-full px-6 btn-glow"
            data-testid="btn-next"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            className="rounded-full px-8 btn-glow"
            data-testid="btn-generate"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Course
          </Button>
        )}
      </div>
    </div>
  );
}
