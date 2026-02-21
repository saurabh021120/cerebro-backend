import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import MarkdownContent from "../components/MarkdownContent";
import {
  Send,
  Sparkles,
  User,
  Loader2,
  Play,
  Square,
  Users,
  Award
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const topicSuggestions = [
  "JavaScript & React",
  "Python & Machine Learning",
  "Data Structures & Algorithms",
  "System Design",
  "Cloud Computing (AWS/GCP)",
  "Database Design",
  "Backend Development",
  "DevOps & CI/CD"
];

export default function AIInterview() {
  const [sessionId, setSessionId] = useState(null);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startInterview = async () => {
    if (!topic.trim()) {
      toast.error("Please enter an interview topic");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/interview/start`, {
        topic: topic.trim(),
        difficulty
      });

      setSessionId(response.data.session_id);
      setMessages([{ role: "interviewer", content: response.data.message }]);
      toast.success("Interview started! Good luck!");
    } catch (error) {
      console.error("Error starting interview:", error);
      toast.error("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const sendResponse = async () => {
    if (!input.trim() || sending) return;

    const userResponse = input.trim();
    setInput("");
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: "candidate", content: userResponse }]);
    setSending(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await axios.post(`${API}/interview/respond`, {
        session_id: sessionId,
        answer: userResponse,
        conversation_history: conversationHistory
      });

      setMessages(prev => [...prev, { 
        role: "interviewer", 
        content: response.data.response 
      }]);
    } catch (error) {
      console.error("Error sending response:", error);
      toast.error("Failed to get response");
      setMessages(prev => prev.slice(0, -1));
      setInput(userResponse);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const endInterview = async () => {
    setEnding(true);
    try {
      const response = await axios.post(`${API}/interview/end/${sessionId}`);
      setFeedback(response.data.feedback);
      toast.success("Interview ended! Check your feedback.");
    } catch (error) {
      console.error("Error ending interview:", error);
      toast.error("Failed to end interview");
    } finally {
      setEnding(false);
    }
  };

  const resetInterview = () => {
    setSessionId(null);
    setMessages([]);
    setFeedback(null);
    setTopic("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendResponse();
    }
  };

  // Feedback view
  if (feedback) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2" data-testid="feedback-title">Interview Feedback</h2>
            <p className="text-muted-foreground">Here's your performance review from the AI interviewer</p>
          </div>

          <div className="bg-card/50 rounded-xl p-6 mb-8">
            <MarkdownContent content={feedback} />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={resetInterview}
              className="rounded-full"
              data-testid="btn-new-interview"
            >
              Start New Interview
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Setup view
  if (!sessionId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="interview-setup-title">
            AI Mock Interview
          </h1>
          <p className="text-muted-foreground">
            Practice your interview skills with an AI interviewer
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
          {/* Topic Input */}
          <div>
            <label className="text-sm font-medium mb-3 block">Interview Topic</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., JavaScript & React, System Design..."
              className="h-12 bg-input/50 border-transparent focus:border-primary"
              data-testid="input-topic"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {topicSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setTopic(suggestion)}
                  className="px-3 py-1 rounded-full bg-secondary/50 text-xs hover:bg-secondary transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm font-medium mb-3 block">Difficulty Level</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="h-12 bg-input/50 border-transparent" data-testid="select-difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner - Entry Level</SelectItem>
                <SelectItem value="intermediate">Intermediate - Mid Level</SelectItem>
                <SelectItem value="advanced">Advanced - Senior Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tips */}
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Interview Tips
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Take your time to think before answering</li>
              <li>• Explain your thought process clearly</li>
              <li>• Ask clarifying questions if needed</li>
              <li>• Be honest about what you don't know</li>
            </ul>
          </div>

          {/* Start Button */}
          <Button
            onClick={startInterview}
            disabled={loading || !topic.trim()}
            className="w-full h-12 rounded-full btn-glow"
            data-testid="btn-start-interview"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Play className="w-5 h-5 mr-2" />
            )}
            Start Interview
          </Button>
        </div>
      </div>
    );
  }

  // Interview chat view
  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" data-testid="interview-title">
            <Users className="w-5 h-5 text-primary" />
            Mock Interview
          </h1>
          <p className="text-sm text-muted-foreground">
            {topic} • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
          </p>
        </div>
        
        <Button 
          variant="destructive" 
          onClick={endInterview}
          disabled={ending}
          className="rounded-full"
          data-testid="btn-end-interview"
        >
          {ending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Square className="w-4 h-4 mr-2" />
          )}
          End Interview
        </Button>
      </div>

      {/* Chat Container */}
      <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${message.role === "candidate" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.role === "candidate" 
                    ? "bg-primary/20 text-primary" 
                    : "bg-accent/20 text-accent"
                }`}>
                  {message.role === "candidate" ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Users className="w-5 h-5" />
                  )}
                </div>
                <div className={`max-w-[80%] ${
                  message.role === "candidate" ? "chat-bubble-user" : "chat-bubble-ai"
                } p-4`}>
                  {message.role === "candidate" ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  ) : (
                    <MarkdownContent content={message.content} />
                  )}
                </div>
              </motion.div>
            ))}
            
            {sending && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="chat-bubble-ai p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-muted-foreground">Interviewer is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-3">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              className="flex-1 min-h-12 max-h-32 bg-input/50 border-transparent focus:border-primary resize-none"
              disabled={sending}
              data-testid="interview-input"
            />
            <Button
              onClick={sendResponse}
              disabled={!input.trim() || sending}
              className="h-12 px-6 rounded-xl btn-glow self-end"
              data-testid="btn-send-response"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • Click "End Interview" when you're ready for feedback
          </p>
        </div>
      </div>
    </div>
  );
}
