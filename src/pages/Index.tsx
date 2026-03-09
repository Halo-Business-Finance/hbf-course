import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Users, Award, TrendingUp, Play, CheckCircle, Star, Zap, Target, Shield } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { FinPilotBrandFooter } from "@/components/FinPilotBrandFooter";
import { DemoVideoModal } from "@/components/DemoVideoModal";
import { CurriculumModal } from "@/components/CurriculumModal";
import { SEOHead } from "@/components/SEOHead";
import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import businessTeam from "@/assets/business-team.jpg";
import careerSuccessImage from "@/assets/career-success.jpg";
const learningPathsImage = "/lovable-uploads/49422402-b861-468e-8955-3f3cdaf3530c.png";
const softwareTrainingImage = "/lovable-uploads/49422402-b861-468e-8955-3f3cdaf3530c.png";

const Index = () => {
  const { user } = useAuth();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [selectedLearningPath, setSelectedLearningPath] = useState<any>(null);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const testimonials = [
    { name: "Sarah Johnson", role: "Senior Loan Officer", company: "First National Bank", content: "The FinPilot program transformed my understanding of commercial lending. I received a promotion within 6 months of completion.", rating: 5 },
    { name: "Michael Chen", role: "Business Development Manager", company: "Capital Solutions Group", content: "Exceptional curriculum and real-world case studies. This program gave me the confidence to handle complex deals.", rating: 5 },
    { name: "Emily Rodriguez", role: "Credit Analyst", company: "Metro Commercial Finance", content: "The interactive tools and expert instructors made complex concepts easy to understand and apply immediately.", rating: 5 },
  ];

  const learningPaths = [
    { title: "Business Finance Foundations", duration: "4 weeks", modules: 8, description: "Master the fundamentals of business finance, financial analysis, and lending principles.", features: ["Financial Statement Analysis", "Cash Flow Management", "Risk Assessment", "Industry Best Practices"] },
    { title: "Commercial Lending Mastery", duration: "6 weeks", modules: 12, description: "Advanced commercial lending strategies, underwriting, and portfolio management.", features: ["Advanced Underwriting", "Deal Structuring", "Portfolio Management", "Regulatory Compliance"] },
    { title: "SBA Loan Specialist", duration: "3 weeks", modules: 6, description: "Comprehensive training on SBA loan programs, application processes, and compliance.", features: ["SBA Program Guide", "Application Process", "Documentation", "Compliance Requirements"] },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "FinPilot",
    "description": "Professional business finance training and certification platform for commercial lending professionals",
    "url": "https://finpilot.com",
    "logo": "https://finpilot.com/logo.png",
    "address": { "@type": "PostalAddress", "addressCountry": "US" },
    "offers": [
      { "@type": "Course", "name": "Business Finance Foundations", "description": "Master the fundamentals of business finance, financial analysis, and lending principles", "provider": { "@type": "Organization", "name": "FinPilot" } },
      { "@type": "Course", "name": "Commercial Lending Mastery", "description": "Advanced commercial lending strategies, underwriting, and portfolio management", "provider": { "@type": "Organization", "name": "FinPilot" } },
    ],
  };

  return (
    <>
      <SEOHead
        title="FinPilot - Master Business Finance & Commercial Lending | Professional Training"
        description="Transform your career with FinPilot's comprehensive business finance and commercial lending program. 96% certification success rate. Join 10,000+ professionals who've advanced their careers."
        keywords="business finance training, commercial lending certification, SBA loans, credit analysis, financial training, lending education, finance courses"
        structuredData={structuredData}
        canonicalUrl="https://finpilot.com"
      />
      <div className="min-h-screen bg-background">

        {/* Hero Section */}
        <div className="relative py-24 sm:py-32 md:py-40 lg:py-48">
          <img
            src={businessTeam}
            alt="Professional business team collaborating on commercial lending"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-halo-navy/90 via-halo-navy/65 to-halo-navy/20" />
          <div className="page-container relative z-10">
            <motion.div
              className="max-w-3xl text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Badge className="mb-5 sm:mb-6 bg-white/10 text-white border border-white/25 backdrop-blur-md text-xs sm:text-sm px-4 py-1.5 hover:bg-white/15 transition-colors">
                  <Zap className="h-3.5 w-3.5 mr-2" />
                  #1 Commercial Lending Training Platform
                </Badge>
              </motion.div>
              <motion.h1
                className="hero-title mb-5 sm:mb-6 text-white tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                Master Business Finance &{" "}
                <span className="text-halo-orange">Commercial Lending</span>
              </motion.h1>
              <motion.p
                className="text-base sm:text-xl md:text-2xl mb-3 sm:mb-4 text-white/90 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Professional Training Platform for Finance Excellence
              </motion.p>
              <motion.p
                className="text-sm sm:text-base mb-8 sm:mb-10 text-white/75 max-w-2xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                Transform your career with our comprehensive business finance and commercial lending program. Experience Stanford-level curriculum designed by industry experts.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-halo-orange hover:bg-halo-orange/90 text-white font-semibold shadow-hero text-sm sm:text-base px-8 py-6 min-h-[48px] hover:scale-[1.02] transition-transform">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/course-catalog">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm font-medium text-sm sm:text-base px-8 py-6 min-h-[48px] hover:scale-[1.02] transition-transform">
                    <Play className="mr-2 h-4 w-4" />
                    Explore Courses
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        <section className="border-y border-border py-10 sm:py-12 bg-background">
          <div className="page-container">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center" staggerDelay={0.1}>
              {[
                { value: "10,000+", label: "Professionals Trained" },
                { value: "96%", label: "Certification Rate" },
                { value: "150+", label: "Expert Modules" },
                { value: "4.9/5", label: "Average Rating" },
              ].map((stat, i) => (
                <StaggerItem key={i}>
                  <div className="space-y-1.5">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-halo-navy">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Learning Paths Section */}
        <section className="mobile-section bg-background" aria-labelledby="learning-paths-heading">
          <div className="page-container">
            <AnimatedSection>
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-10 md:mb-14">
                <div className="order-2 lg:order-1">
                  <motion.img
                    src={learningPathsImage}
                    alt="Professional conference room meeting discussing real estate properties and commercial lending"
                    width="1920" height="861" loading="lazy" decoding="async"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 586px"
                    className="w-full h-auto rounded-xl shadow-elevated"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-center lg:text-left space-y-4 order-1 lg:order-2">
                  <h2 id="learning-paths-heading" className="text-responsive-2xl font-bold text-halo-navy">
                    Choose Your Path to Success
                  </h2>
                  <Badge className="inline-flex items-center gap-2 bg-white text-halo-orange text-sm md:text-base px-3 py-1 border-0 transition-none hover:bg-white hover:text-halo-orange">
                    <Target className="h-4 w-4" />
                    Structured Learning Paths
                  </Badge>
                  <p className="text-responsive-sm text-foreground max-w-3xl mx-auto lg:mx-0">
                    <span className="font-medium text-primary">From Novice to Expert: We Train You Right.</span> Comprehensive training programs designed to meet you where you are and take you where you want to go.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" staggerDelay={0.12}>
              {learningPaths.map((path, index) => (
                <StaggerItem key={index}>
                  <Card className="relative border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-elevated group hover:-translate-y-1 h-full">
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-end">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-halo-orange/10">
                          <BookOpen className="h-4 w-4 text-halo-orange" />
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {path.title}
                      </CardTitle>
                      <Badge className="text-xs text-halo-orange bg-white border-0 w-fit">
                        {path.duration} • {path.modules} modules
                      </Badge>
                      <CardDescription className="text-responsive-sm leading-relaxed text-foreground">
                        {path.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        {path.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-responsive-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        className="w-full bg-halo-navy hover:bg-halo-navy/90 text-white group-hover:shadow-md transition-all"
                        onClick={() => {
                          setSelectedLearningPath(path);
                          setIsCurriculumModalOpen(true);
                        }}
                      >
                        View Curriculum
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Features Section */}
        <section className="mobile-section bg-white" aria-labelledby="features-heading">
          <div className="page-container">
            <AnimatedSection>
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-10 md:mb-14">
                <div className="text-center lg:text-left space-y-4">
                  <h2 id="features-heading" className="text-responsive-2xl font-bold text-halo-navy">
                    The #1 Course for Tomorrow's Lending Leaders
                  </h2>
                  <Badge className="inline-flex items-center gap-2 bg-white text-halo-orange text-sm md:text-base px-3 py-1 border-0 transition-none hover:bg-white hover:text-halo-orange">
                    <Award className="h-4 w-4" />
                    <span className="hidden sm:inline">The Gold Standard in Commercial Lending Software Training</span>
                    <span className="sm:hidden">Gold Standard Training</span>
                  </Badge>
                  <p className="text-responsive-sm text-foreground max-w-3xl mx-auto lg:mx-0">
                    <span className="font-medium text-foreground">The Definitive Course for Commercial Lending Software.</span> Building Tomorrow's Lending Experts Today through industry-leading curriculum designed to accelerate your success.
                  </p>
                </div>
                <div>
                  <motion.img
                    src={softwareTrainingImage}
                    alt="Professional conference room meeting discussing commercial lending and financial services"
                    width="1920" height="861" loading="lazy" decoding="async"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 586px"
                    className="w-full h-auto rounded-xl shadow-elevated"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </AnimatedSection>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" staggerDelay={0.1}>
              {[
                { icon: BookOpen, title: "Expert Curriculum", description: "Master Lending Software. Minimize Complications. 8 comprehensive modules covering everything from credit analysis to portfolio management." },
                { icon: Users, title: "Industry Experts", description: "Knowledge is Power. We Teach You How to Use It. Learn from seasoned professionals with decades of experience in business lending." },
                { icon: Award, title: "Certification", description: "Confidence in Every Commercial Lending Deal. Earn recognized certificates that validate your expertise in business finance." },
                { icon: TrendingUp, title: "Career Growth", description: "Level Up Your Lending Career. Advance your career with in-demand skills that employers are actively seeking." },
              ].map((feature, index) => (
                <StaggerItem key={index}>
                  <Card className="text-center border hover:border-primary/20 transition-all duration-300 hover:shadow-elevated group hover:-translate-y-1 h-full">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-halo-orange/10 group-hover:bg-halo-orange/15 group-hover:scale-110 transition-all duration-300">
                        <feature.icon className="h-7 w-7 text-halo-orange" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-responsive-sm leading-relaxed text-foreground">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <AnimatedSection delay={0.2} className="text-center mt-10 md:mt-14">
              <Link to="/signup">
                <Button size="lg" className="bg-halo-navy hover:bg-halo-navy/90 text-white shadow-elevated hover:shadow-hero hover:scale-[1.02] transition-all">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mobile-section bg-background" aria-labelledby="testimonials-heading">
          <div className="page-container">
            <AnimatedSection className="text-center space-y-4 mb-12 md:mb-16">
              <h2 id="testimonials-heading" className="text-responsive-2xl font-bold text-halo-navy">
                What Our Graduates Say
              </h2>
              <Badge className="inline-flex items-center gap-2 bg-white text-halo-orange border-0">
                <Star className="h-4 w-4" />
                Success Stories
              </Badge>
            </AnimatedSection>

            <StaggerContainer className="card-grid-3" staggerDelay={0.12}>
              {testimonials.map((testimonial, index) => (
                <StaggerItem key={index}>
                  <Card className="border hover:border-primary/20 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 h-full">
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-halo-orange text-halo-orange" />
                        ))}
                      </div>
                      <p className="text-foreground leading-relaxed italic text-responsive-sm">
                        "{testimonial.content}"
                      </p>
                      <div className="pt-4 border-t border-border">
                        <div className="font-semibold text-halo-navy text-responsive-sm">{testimonial.name}</div>
                        <div className="text-responsive-xs text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mobile-section relative overflow-hidden">
          <div className="absolute inset-0 bg-halo-navy" />
          <div className="page-container relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <AnimatedSection className="order-1 lg:order-2">
                <motion.img
                  src={careerSuccessImage}
                  alt="Professional career success and advancement"
                  width="1024" height="768" loading="lazy" decoding="async"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 586px"
                  className="w-full h-auto rounded-xl shadow-hero"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatedSection>

              <AnimatedSection className="space-y-6 md:space-y-8 order-2 lg:order-1" delay={0.1}>
                <div className="space-y-4">
                  <h2 className="text-responsive-lg font-bold text-white">
                    Transform Your Skills. Transform Your Career.
                  </h2>
                  <p className="text-responsive-sm text-white/90 leading-relaxed">
                    <span className="block mb-2 font-medium text-white">Unlock Your Potential in Commercial Lending.</span>
                    Join thousands of professionals who have advanced their careers through our comprehensive training program. Financial Success, Simplified.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/course-catalog">
                    <Button variant="outline" className="w-full sm:w-auto border-white/40 text-white bg-transparent hover:bg-white hover:text-halo-navy transition-all hover:scale-[1.02]">
                      <Shield className="mr-2 h-4 w-4" />
                      Learn More
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col justify-start items-start gap-4 pt-6 md:pt-8 text-white text-responsive-xs">
                  {["Free 3-Day Trial", "Advance Your Career", "Industry-Recognized Certification", "No Risk, 30-Day Money Back Guarantee"].map((text, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i, duration: 0.3 }}
                    >
                      <CheckCircle className="h-4 w-4 text-halo-orange" />
                      <span>{text}</span>
                    </motion.div>
                  ))}
                  <Link to="/signup" className="mt-3">
                    <Button className="bg-halo-orange hover:bg-halo-orange/90 text-white shadow-hero group hover:scale-[1.02] transition-all">
                      <ArrowRight className="mr-2 h-3 w-3 text-white group-hover:translate-x-0.5 transition-transform" />
                      Start Free Trial Now
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Footer */}
        <FinPilotBrandFooter />
        <DemoVideoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
        {selectedLearningPath && <CurriculumModal open={isCurriculumModalOpen} onOpenChange={setIsCurriculumModalOpen} learningPath={selectedLearningPath} />}
      </div>
    </>
  );
};
export default Index;
