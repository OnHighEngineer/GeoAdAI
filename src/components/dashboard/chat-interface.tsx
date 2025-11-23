'use client';

import { useState, useRef, useEffect } from 'react';
import type { GenerateAdPlanInput } from '@/ai/flows/generate-ad-plan';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2, Send, Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

type ChatInterfaceProps = {
  onSubmit: (data: GenerateAdPlanInput) => void;
  isPending: boolean;
};

type Message = {
  sender: 'bot' | 'user';
  text?: string;
  options?: string[];
  examples?: string[];
};

const questions = [
  {
    key: 'business_name',
    text: "What's your business name?",
  },
  {
    key: 'business_description',
    text: 'Please provide a brief, 1-2 line description of your business.',
  },
  {
    key: 'country',
    text: "Which country is your business located in?",
  },
  {
    key: 'city',
    text: 'What city?',
  },
  {
    key: 'area',
    text: 'And the area or neighborhood?',
  },
  {
    key: 'urban_type',
    text: 'What is the urban type of your location?',
    options: ['Urban', 'Semi-Urban', 'Rural'],
  },
  {
    key: 'campaign_objective',
    text: 'What is your main campaign objective?',
    examples: [
      'Increase in-store visits',
      'Boost online orders',
      'Increase brand awareness',
      'App installs',
    ],
  },
  {
    key: 'budget_level',
    text: 'What is your budget level?',
    options: ['low', 'medium', 'high'],
  },
  {
    key: 'preferred_channels',
    text: 'What are your preferred ad channels?',
    examples: ['Mobile', 'In-App', 'Display', 'CTV', 'All channels'],
  },
  {
    key: 'target_customer_notes',
    text: 'Do you have any notes about your target customer? (This is optional)',
    examples: [
      'Young professionals near tech parks',
      'Families on weekends',
      'College students nearby',
    ],
  },
];

export function ChatInterface({ onSubmit, isPending }: ChatInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<GenerateAdPlanInput>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Greet the user and ask the first question
    setMessages([
      { sender: 'bot', text: "Hello! I'm here to help you create an ad strategy." },
      {
        sender: 'bot',
        text: questions[0].text,
        examples: questions[0].examples,
      },
    ]);
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat on new message
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserInput = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const userAnswer = inputValue.trim();
    if (!userAnswer && currentQuestion.key !== 'target_customer_notes') {
      // Simple validation for now
      setMessages(prev => [...prev, { sender: 'bot', text: 'Please provide an answer.' }]);
      return;
    }

    // Add user message to chat
    setMessages(prev => [...prev, { sender: 'user', text: userAnswer }]);
    setInputValue('');

    const newAnswers = { ...answers, [currentQuestion.key]: userAnswer };
    setAnswers(newAnswers);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      const nextQuestion = questions[nextQuestionIndex];
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: nextQuestion.text,
          options: nextQuestion.options,
          examples: nextQuestion.examples,
        },
      ]);
    } else {
      // All questions answered
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Great, I have all the information I need. Generating your ad plan now...',
        },
      ]);
      onSubmit(newAnswers as GenerateAdPlanInput);
    }
  };
  
  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    // We need to wait for state to update before submitting
    setTimeout(() => {
        const submissionButton = document.getElementById('chat-submit-button');
        submissionButton?.click();
    }, 0);
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="flex flex-col h-[calc(100vh-10rem)]">
      <div ref={scrollAreaRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'bot' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            <div
              className={`max-w-md rounded-lg px-4 py-2 ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p>{msg.text}</p>
              {msg.options && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.options.map(opt => (
                    <Badge
                      key={opt}
                      variant="outline"
                      className="cursor-pointer bg-background hover:bg-accent"
                      onClick={() => handleOptionSelect(opt)}
                    >
                      {opt}
                    </Badge>
                  ))}
                </div>
              )}
               {msg.examples && (
                <div className="mt-2 text-xs text-muted-foreground">
                    <p className="font-semibold">Examples:</p>
                    <ul className="list-disc list-inside">
                        {msg.examples.map(ex => <li key={ex}>{ex}</li>)}
                    </ul>
                </div>
               )}
            </div>
          </div>
        ))}
        {isPending && (
             <div className="flex items-end gap-2 justify-start">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                     <Sparkles className="w-5 h-5" />
                 </div>
                 <div className="max-w-md rounded-lg px-4 py-2 bg-muted">
                    <Loader2 className="animate-spin" />
                 </div>
             </div>
        )}
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type your answer..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUserInput()}
              disabled={isPending || currentQuestionIndex >= questions.length}
            />
          <Button
            id="chat-submit-button"
            onClick={handleUserInput}
            disabled={isPending || currentQuestionIndex >= questions.length}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
