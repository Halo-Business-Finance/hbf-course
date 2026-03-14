import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, MessageCircle, Mail, Clock, CheckCircle, ArrowRight, Search, ThumbsUp, ThumbsDown } from "lucide-react";
import { FinPilotBrandFooter } from "@/components/FinPilotBrandFooter";
import { SEOHead } from "@/components/SEOHead";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import supportHero from "@/assets/support-hero.jpg";
import LeadIntakeModal from "@/components/LeadIntakeModal";

const Support = () => {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'sales' | 'demo'>('sales');
  const [searchTerm, setSearchTerm] = useState('');
  const [faqFeedback, setFaqFeedback] = useState<Record<number, 'helpful' | 'not-helpful' | null>>({});

  const handleFeedback = (index: number, feedback: 'helpful' | 'not-helpful') => {
    setFaqFeedback(prev => ({ ...prev, [index]: feedback }));
    toast({
      title: feedback === 'helpful' ? "Thank you!" : "Thanks for your feedback",
      description: feedback === 'helpful' ? "We're glad this answer was helpful." : "We'll work on improving this answer.",
    });
  };

  const allFaqs = [
    { question: "What is an online course and how does it work?", answer: "An online course is a structured learning experience delivered over the internet. Our courses offer both live sessions and self-paced content." },
    { question: "How long is the free trial?", answer: "We offer a free 3-day trial that gives you full access to our platform and courses. No credit card required." },
    { question: "How do I sign up for a course?", answer: "Browse our course catalog, select the course you want, click 'Enroll Now', create your account, and complete the payment process." },
    { question: "Can courses be taken at one's own pace?", answer: "Yes! Most of our courses are self-paced, allowing you to learn whenever it's convenient for you." },
    { question: "What are the prerequisites for courses?", answer: "Prerequisites vary by course and are clearly listed on each course page. Most beginner courses have no prerequisites." },
    { question: "What materials are required for courses?", answer: "All course materials are provided digitally within our platform. You'll only need a computer or mobile device with internet access." },
    { question: "Who are the instructors?", answer: "Our instructors are industry experts with extensive experience in finance and lending. Each instructor's bio is available on their course pages." },
    { question: "How are assignments and exams submitted?", answer: "All assignments and exams are completed directly within our platform. Simply click submit when you're finished." },
    { question: "How will feedback on work be received?", answer: "You'll receive automated feedback immediately for quizzes. For subjective work, instructors provide detailed feedback within 48-72 hours." },
    { question: "How often is course content updated?", answer: "We continuously update our course content. Major updates are released quarterly, with minor updates as needed." },
    { question: "Do you offer certificates upon completion?", answer: "Yes, you'll receive a certificate of completion for each course you finish. These can be downloaded and shared on LinkedIn." },
    { question: "What are the minimum technology requirements?", answer: "You need a device with internet access, a modern web browser, and a stable internet connection. No special software required." },
    { question: "What should be done if there are trouble logging in?", answer: "Click 'Forgot Password' on the login page to reset your password. If issues persist, clear your browser cache or contact support." },
    { question: "Can courses be accessed on different devices?", answer: "Yes! Our platform works on computers, tablets, and smartphones with cross-device syncing." },
    { question: "How much do courses cost?", answer: "Course prices vary. We offer monthly subscriptions and annual plans. Payment plans and corporate discounts are available." },
    { question: "What is the refund or cancellation policy?", answer: "We offer a 30-day money-back guarantee for all courses. Contact our support team for a full refund within 30 days." },
    { question: "How can progress be tracked?", answer: "Your dashboard shows completion percentages, quiz scores, time spent learning, and certificates earned." },
    { question: "What is the privacy policy regarding personal data?", answer: "We take your privacy seriously. Your personal information is encrypted and never shared with third parties." },
  ];

  const filteredFaqs = allFaqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const supportOptions = [
    { icon: MessageCircle, title: "Live Chat", description: "Connect with our support specialists instantly", action: "Start Conversation", available: "Available 24/7", responseTime: "Avg. 2 min response", onClick: () => console.log("Opening live chat...") },
    { icon: Mail, title: "Contact Sales", description: "Speak with our sales team about custom solutions", action: "Contact Sales", available: "Mon-Fri 9AM-6PM EST", responseTime: "Same day response", onClick: () => { setModalType('sales'); setIsLeadModalOpen(true); } },
    { icon: CheckCircle, title: "Schedule Demo", description: "Book a personalized demo of FinPilot", action: "Schedule a Demo", available: "Flexible scheduling", responseTime: "Demo within 24hrs", onClick: () => { setModalType('demo'); setIsDemoModalOpen(true); } }
  ];

  return (
    <>
      <SEOHead
        title="Support Center | FinPilot Customer Support & Help Resources"
        description="Get expert support for your FinPilot training. Live chat, FAQs, and help resources available 24/7."
        keywords="FinPilot support, customer help, training support"
        canonicalUrl="https://finpilot.com/support"
      />
      <div className="bg-background min-h-screen">
        {/* Hero */}
        <div className="relative h-72 sm:h-80 md:h-112 overflow-hidden">
          <motion.img
            src={supportHero}
            alt="Professional customer support"
            className="w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.2, 0, 0.38, 0.9] }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-halo-navy/85 via-halo-navy/60 to-transparent flex items-center">
            <div className="page-container">
              <motion.div
                className="max-w-2xl text-white"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Badge className="mb-3 sm:mb-4 bg-white/15 text-white border border-white/30 backdrop-blur-xs text-xs sm:text-sm">
                  <HelpCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" />
                  Support Center
                </Badge>
                <h1 className="hero-title mb-3 sm:mb-4">We're here to help</h1>
                <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-xl">
                  Get the support you need to succeed. Our dedicated team is ready to assist you every step of the way.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="page-container py-10 sm:py-14 md:py-16">
          <LeadIntakeModal isOpen={isLeadModalOpen} onOpenChange={setIsLeadModalOpen} leadType="sales" leadSource="support_page" />
          <LeadIntakeModal isOpen={isDemoModalOpen} onOpenChange={setIsDemoModalOpen} leadType="demo" leadSource="support_page" />

          {/* Support Options */}
          <AnimatedSection className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Contact Our Support Team</h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">Choose the best way to reach us.</p>
            </div>

            <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
              {supportOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <StaggerItem key={index}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                      <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Icon className="h-6 w-6 text-halo-orange" />
                          </div>
                          <h3 className="text-lg font-bold text-foreground mb-2">{option.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                          <div className="space-y-1 mb-4">
                            <div className="flex items-center justify-center gap-2 text-xs">
                              <Clock className="h-3 w-3 text-primary" />
                              <span className="text-muted-foreground">{option.available}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-primary" />
                              <span className="text-muted-foreground">{option.responseTime}</span>
                            </div>
                          </div>
                          <Button onClick={option.onClick} className="w-full bg-halo-navy hover:bg-halo-navy/90 text-white">
                            {option.action}
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Contact Form */}
              <AnimatedSection delay={0.1}>
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-halo-orange" />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-foreground mb-1">Send Message</div>
                      <div className="text-sm font-medium text-primary mb-2">Contact Form</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">Our team will get back to you within 4 hours.</div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="First Name" className="h-12 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg" />
                      <Input placeholder="Last Name" className="h-12 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg" />
                    </div>
                    <Input type="email" placeholder="Email Address" className="h-12 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg" />
                    <Input placeholder="Subject" className="h-12 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg" />
                    <Textarea placeholder="Tell us how we can help you..." rows={4} className="border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg resize-none" />
                    <Button className="w-full h-12 bg-halo-navy hover:bg-halo-navy/90 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
                      Send Message
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">We typically respond within 4 hours during business hours</p>
                  </div>
                </Card>
              </AnimatedSection>

              {/* FAQ Widget */}
              <AnimatedSection delay={0.2}>
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                      <HelpCircle className="h-6 w-6 text-halo-orange" />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-foreground mb-1">Get Answers</div>
                      <div className="text-sm font-medium text-primary mb-2">Frequently Asked Questions</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">Find quick answers to common questions.</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search frequently asked questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 border-muted focus:border-primary"
                      />
                    </div>
                    {searchTerm && (
                      <p className="text-xs text-muted-foreground mt-2">{filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} found</p>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {filteredFaqs.length === 0 ? (
                      <div className="text-center py-8">
                        <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No FAQs match your search.</p>
                        <Button variant="link" className="text-primary p-0 h-auto mt-2" onClick={() => setSearchTerm('')}>Clear search</Button>
                      </div>
                    ) : (
                      <Accordion type="single" collapsible className="w-full space-y-0">
                        {filteredFaqs.map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`} className="border-0 border-b border-muted last:border-b-0">
                            <AccordionTrigger className="py-4 px-0 text-left hover:no-underline hover:bg-muted/50 transition-colors rounded-none group">
                              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors pr-4">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-0 px-0 space-y-4">
                              <div className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</div>
                              <div className="border-t border-muted pt-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Was this helpful?</span>
                                  <div className="flex items-center gap-2">
                                    <Button variant={faqFeedback[index] === 'helpful' ? 'default' : 'ghost'} size="sm" className="h-8 px-3" onClick={() => handleFeedback(index, 'helpful')}>
                                      <ThumbsUp className="h-3 w-3 mr-1" /><span className="text-xs">Yes</span>
                                    </Button>
                                    <Button variant={faqFeedback[index] === 'not-helpful' ? 'destructive' : 'ghost'} size="sm" className="h-8 px-3" onClick={() => handleFeedback(index, 'not-helpful')}>
                                      <ThumbsDown className="h-3 w-3 mr-1" /><span className="text-xs">No</span>
                                    </Button>
                                  </div>
                                </div>
                                {faqFeedback[index] && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {faqFeedback[index] === 'helpful' ? "✓ Thank you for your feedback!" : "We'll work on improving this answer."}
                                  </p>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </div>
                </Card>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>

        <FinPilotBrandFooter />
      </div>
    </>
  );
};

export default Support;
