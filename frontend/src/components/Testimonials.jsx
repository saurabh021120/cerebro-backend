import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    content: 'Cerebro transformed how I learn new technologies. The AI-generated courses are incredibly well-structured and personalized to my goals.',
    avatar: 'SJ',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager',
    content: 'I\'ve tried many learning platforms, but Cerebro stands out. The progress tracking and interactive quizzes keep me motivated every day.',
    avatar: 'MC',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Data Scientist',
    content: 'The ability to create custom courses tailored to my specific learning objectives is a game-changer. Highly recommend!',
    avatar: 'ER',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    name: 'David Park',
    role: 'UX Designer',
    content: 'Cerebro made learning design principles fun and engaging. The AI understands exactly what I need to improve.',
    avatar: 'DP',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    name: 'Lisa Thompson',
    role: 'Marketing Specialist',
    content: 'Finally, a platform that adapts to my busy schedule. I can learn at my own pace with content that\'s always relevant.',
    avatar: 'LT',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    name: 'James Wilson',
    role: 'Full Stack Developer',
    content: 'The structured modules and comprehensive lessons helped me transition into full-stack development seamlessly.',
    avatar: 'JW',
    gradient: 'from-indigo-500 to-purple-500'
  }
];

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
          What Our <span className="gradient-text">Learners Say</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of learners who are achieving their goals with Cerebro
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="glass-card rounded-2xl p-6 hover:border-primary/50 transition-all"
          >
            {/* Quote Icon */}
            <div className="mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Quote className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Content */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              "{testimonial.content}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-semibold`}>
                {testimonial.avatar}
              </div>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
