import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Brain, Lightbulb, Target, Star, ChevronRight } from 'lucide-react';
import { DragDropContainer } from './interactive/DragDropContainer';
import { ScenarioSimulation } from './interactive/ScenarioSimulation';
import { KnowledgeCheck } from './interactive/KnowledgeCheck';
import { useToast } from '@/hooks/use-toast';
import { LessonPlayerHeader } from './lesson/LessonPlayerHeader';
import { LessonSectionNav } from './lesson/LessonSectionNav';

interface InteractiveLessonPlayerProps {
  lesson: unknown;
  learningProfile: unknown;
  onComplete: (lessonId: string, score: number, timeSpent: number) => void;
}

export const InteractiveLessonPlayer = ({ lesson, learningProfile, onComplete }: InteractiveLessonPlayerProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(() => Date.now());
  const [sectionScores, setSectionScores] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const { toast } = useToast();

  const sections = [
    {
      type: 'introduction',
      title: 'Introduction',
      icon: Target,
      content: generateIntroContent(lesson, learningProfile)
    },
    {
      type: 'main-content',
      title: 'Main Content',
      icon: Brain,
      content: getAdaptiveContent(lesson, learningProfile)
    },
    ...lesson.interactive_elements.map((element: unknown, index: number) => ({
      type: 'interactive',
      title: element.title,
      icon: Lightbulb,
      content: element,
      index
    })),
    {
      type: 'summary',
      title: 'Summary & Assessment',
      icon: CheckCircle,
      content: generateSummaryContent(lesson)
    }
  ];

  useEffect(() => {
    setProgress((currentSection / (sections.length - 1)) * 100);
  }, [currentSection, sections.length]);

  function generateIntroContent(lesson: unknown, profile: unknown) {
    return {
      title: `Welcome to ${lesson.title}`,
      objectives: lesson.learning_objectives,
      duration: lesson.estimated_duration,
      difficulty: lesson.difficulty_level,
      personalizedMessage: getPersonalizedMessage(profile),
      prerequisites: lesson.prerequisites
    };
  }

  function getPersonalizedMessage(profile: unknown) {
    const messages = {
      visual: "This lesson includes visual diagrams and interactive elements perfect for your learning style.",
      auditory: "This lesson features audio explanations and discussion points tailored for you.",
      kinesthetic: "Get ready for hands-on activities and interactive simulations in this lesson.",
      reading: "This lesson provides comprehensive text and detailed explanations for thorough understanding."
    };
    return messages[profile.learning_style as keyof typeof messages] || messages.visual;
  }

  function getAdaptiveContent(lesson: unknown, profile: unknown) {
    const difficulty = lesson.difficulty_level;
    const style = profile.learning_style;
    
    const content = difficulty <= 3
      ? lesson.adaptive_content.difficulty_variants.beginner
      : difficulty <= 7
        ? lesson.adaptive_content.difficulty_variants.intermediate
        : lesson.adaptive_content.difficulty_variants.advanced;
    
    return {
      main: content,
      examples: generateExamples(lesson.title, difficulty),
      keyPoints: generateKeyPoints(lesson.title),
      multimedia: getMultimediaContent(lesson.content_type, lesson.title)
    };
  }

  function generateExamples(title: string, difficulty: number) {
    const examples = {
      basic: [
        "A small business applies for a $150,000 SBA Express loan for equipment",
        "The application process takes 2-3 weeks with proper documentation"
      ],
      intermediate: [
        "A manufacturing company seeks $350,000 SBA Express loan for expansion",
        "Multiple collateral requirements and detailed financial projections needed"
      ],
      advanced: [
        "A multi-location franchise uses SBA Express for working capital optimization",
        "Complex cash flow analysis and debt service coverage ratio calculations"
      ]
    };
    
    if (difficulty <= 3) return examples.basic;
    if (difficulty <= 7) return examples.intermediate;
    return examples.advanced;
  }

  function generateKeyPoints(title: string) {
    const keyPoints = {
      'SBA Express Loan Fundamentals': [
        'Maximum loan amount: $500,000',
        'Faster processing: 36 hours or less',
        'Lower SBA guarantee: 50%'
      ],
      'Application Process': [
        'Submit application to approved lender',
        'Provide required documentation',
        'Await lender decision'
      ]
    };
    
    return keyPoints[title as keyof typeof keyPoints] || [
      `Key concept 1 for ${title}`,
      `Key concept 2 for ${title}`,
      `Key concept 3 for ${title}`
    ];
  }

  function getMultimediaContent(contentType: string, title: string) {
    return {
      video: contentType === 'video' ? `/videos/${title.toLowerCase().replace(/\s+/g, '-')}.mp4` : null,
      images: [`/images/${title.toLowerCase().replace(/\s+/g, '-')}-diagram.jpg`],
      audio: contentType === 'video' ? `/audio/${title.toLowerCase().replace(/\s+/g, '-')}.mp3` : null
    };
  }

  function generateSummaryContent(lesson: unknown) {
    return {
      title: 'Lesson Complete!',
      keyTakeaways: lesson.learning_objectives,
      nextSteps: [
        'Review key concepts',
        'Complete practice exercises',
        'Apply knowledge in real scenarios'
      ],
      assessmentQuestions: generateAssessmentQuestions(lesson.title)
    };
  }

  function generateAssessmentQuestions(title: string) {
    return [
      {
        question: `What is the maximum loan amount for SBA Express loans?`,
        options: ['$350,000', '$500,000', '$750,000', '$1,000,000'],
        correct: 1,
        explanation: 'SBA Express loans have a maximum amount of $500,000.'
      },
      {
        question: `How long does SBA Express loan processing typically take?`,
        options: ['24 hours', '36 hours', '5 days', '2 weeks'],
        correct: 1,
        explanation: 'SBA Express loans are processed within 36 hours or less.'
      }
    ];
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Calculate final score and time spent
      const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60); // minutes
      const averageScore = sectionScores.length > 0 
        ? sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length 
        : 85;
      
      onComplete(lesson.id, averageScore, timeSpent);
    }
  };

  const handleSectionScore = (score: number) => {
    const newScores = [...sectionScores];
    newScores[currentSection] = score;
    setSectionScores(newScores);
  };

  const renderSectionContent = (section: unknown) => {
    switch (section.type) {
      case 'introduction':
        return <IntroductionSection content={section.content} />;
      case 'main-content':
        return <MainContentSection content={section.content} />;
      case 'interactive':
        return renderInteractiveElement(section.content, section.index);
      case 'summary':
        return <SummarySection content={section.content} onScore={handleSectionScore} />;
      default:
        return <div>Unknown section type</div>;
    }
  };

  const renderInteractiveElement = (element: unknown, index: number) => {
    switch (element.type) {
      case 'drag-drop':
        return <DragDropContainer element={element} onScore={handleSectionScore} />;
      case 'scenario-simulation':
        return <ScenarioSimulation element={element} onScore={handleSectionScore} />;
      case 'knowledge-check':
        return <KnowledgeCheck element={element} onScore={handleSectionScore} />;
      default:
        return <div>Interactive element: {element.title}</div>;
    }
  };

  const currentSectionData = sections[currentSection];

  return (
    <div className="space-y-6">
      {/* Lesson Header - Extracted component */}
      <LessonPlayerHeader
        lessonTitle={lesson.title}
        currentSection={currentSection}
        totalSections={sections.length}
        sectionTitle={currentSectionData.title}
        SectionIcon={currentSectionData.icon}
        estimatedDuration={lesson.estimated_duration}
        difficultyLevel={lesson.difficulty_level}
        progress={progress}
      />

      {/* Section Navigation - Extracted component */}
      <LessonSectionNav
        sections={sections}
        currentSection={currentSection}
        onSectionSelect={setCurrentSection}
      />

      {/* Main Content */}
      <Card className="min-h-[500px] border-2 border-border shadow-xs">
        <CardContent className="p-6 sm:p-8">
          {renderSectionContent(currentSectionData)}
        </CardContent>
      </Card>

      {/* Navigation Controls - Professional bar */}
      <Card className="border border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showHints && (
                <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                  💡 Hints enabled
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {showHints ? 'Hide' : 'Show'} Hints
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              {currentSection > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentSection(currentSection - 1)}
                  className="border-border"
                >
                  Previous
                </Button>
              )}
              <Button onClick={handleNext} variant="navy" className="min-w-[140px]">
                {currentSection === sections.length - 1 ? 'Complete Lesson' : 'Next Section'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Section Components
const IntroductionSection = ({ content }: { content: unknown }) => (
  <div className="space-y-6">
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">{content.title}</h2>
      <p className="text-muted-foreground text-lg">{content.personalizedMessage}</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {content.objectives.map((objective: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-primary" />
                <span className="text-sm">{objective}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Duration</span>
            <span className="text-sm text-muted-foreground">{content.duration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Difficulty</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < content.difficulty ? 'text-halo-orange fill-current' : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
          {content.prerequisites.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Prerequisites</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {content.prerequisites.map((prereq: string, index: number) => (
                  <span key={index} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);

const MainContentSection = ({ content }: { content: unknown }) => (
  <div className="space-y-6">
    <div className="prose prose-gray max-w-none">
      <div className="text-lg leading-relaxed">
        {content.main}
      </div>
    </div>
    
          {content.multimedia.video && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Video: {content.multimedia.video}</p>
            </div>
          )}
    
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Key Points</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {content.keyPoints.map((point: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5">
                  {index + 1}
                </div>
                <span className="text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {content.examples.map((example: string, index: number) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const SummarySection = ({ content, onScore }: { content: unknown; onScore: (score: number) => void }) => {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = () => {
    const correct = content.assessmentQuestions.reduce((count: number, question: unknown, index: number) => {
      return count + (answers[index] === question.correct ? 1 : 0);
    }, 0);
    
    const score = (correct / content.assessmentQuestions.length) * 100;
    onScore(score);
    setShowResults(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">{content.title}</h2>
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-success" />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {content.keyTakeaways.map((takeaway: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-primary" />
                <span className="text-sm">{takeaway}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.assessmentQuestions.map((question: unknown, qIndex: number) => (
            <div key={qIndex} className="space-y-3">
              <h4 className="font-medium">{question.question}</h4>
              <div className="space-y-2">
                {question.options.map((option: string, oIndex: number) => (
                  <Button
                    key={oIndex}
                    variant={answers[qIndex] === oIndex ? "default" : "outline-solid"}
                    className="w-full justify-start"
                    onClick={() => !showResults && setAnswers({...answers, [qIndex]: oIndex})}
                    disabled={showResults}
                  >
                    {option}
                    {showResults && oIndex === question.correct && (
                      <CheckCircle className="h-4 w-4 ml-auto text-success" />
                    )}
                  </Button>
                ))}
              </div>
              {showResults && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
          
          {!showResults && (
            <Button onClick={handleSubmit} className="w-full">
              Submit Assessment
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};