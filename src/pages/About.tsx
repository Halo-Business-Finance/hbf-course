import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Award, TrendingUp, CheckCircle, Building, Zap, Clock, Users2, Monitor, Cloud, Cpu, Server, Smartphone, Globe, Database, Lock, Shield } from "lucide-react";
import { FinPilotBrandFooter } from "@/components/FinPilotBrandFooter";
import { SEOHead } from "@/components/SEOHead";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { Link } from "react-router-dom";
import aboutHero from "@/assets/about-hero.jpg";
import companStory from "@/assets/company-story.jpg";
import teamSarah from "@/assets/team-sarah.jpg";
import teamMichael from "@/assets/team-michael.jpg";
import teamEmily from "@/assets/team-emily.jpg";

const About = () => {
  const companyInfo = [
    { label: "Industry Focus", value: "Commercial Lending", icon: Building, description: "Specialized training for commercial finance professionals" },
    { label: "Learning Modules", value: "12+", icon: BookOpen, description: "Comprehensive curriculum covering all aspects of business finance" },
    { label: "Certification Rate", value: "96%", icon: Award, description: "Students successfully completing our certification program" },
    { label: "Career Advancement", value: "87%", icon: TrendingUp, description: "Graduates reporting career growth within 6 months" },
    { label: "Course Duration", value: "4-6 weeks", icon: Clock, description: "Flexible learning paths designed for working professionals" },
    { label: "Expert Instructors", value: "15+", icon: Users2, description: "Industry veterans with decades of lending experience" }
  ];

  const platformFeatures = [
    { title: "Interactive Learning Management System", description: "Modern LMS with progress tracking, real-time assessments, and personalized learning paths", icon: Monitor, features: ["Progress Analytics", "Adaptive Learning", "Real-time Feedback", "Mobile Access"] },
    { title: "Cloud-Based Infrastructure", description: "Scalable, reliable platform with 99.9% uptime and global accessibility", icon: Cloud, features: ["Global CDN", "Auto Scaling", "24/7 Monitoring", "Backup & Recovery"] },
    { title: "AI-Powered Recommendations", description: "Machine learning algorithms provide personalized course recommendations and study plans", icon: Cpu, features: ["Smart Recommendations", "Learning Analytics", "Performance Prediction", "Content Optimization"] }
  ];

  const securityFeatures = [
    { title: "Enterprise-Grade Security", description: "Bank-level security protocols protecting sensitive financial training data", icon: Shield, details: ["AES-256 Encryption", "Multi-Factor Authentication", "SOC 2 Compliance", "GDPR Compliant"] },
    { title: "Data Protection & Privacy", description: "Comprehensive data protection measures ensuring student privacy and regulatory compliance", icon: Lock, details: ["End-to-End Encryption", "Privacy Controls", "Data Anonymization", "Secure APIs"] },
    { title: "Secure Infrastructure", description: "Robust infrastructure with advanced threat detection and prevention systems", icon: Server, details: ["DDoS Protection", "Intrusion Detection", "Security Monitoring", "Vulnerability Scanning"] }
  ];

  const platformAdvantages = [
    { title: "Flexible Learning Experience", description: "Learn at your own pace with mobile-friendly design and offline capabilities", icon: Smartphone, benefits: ["Self-Paced Learning", "Mobile Optimization", "Offline Access", "Cross-Device Sync"] },
    { title: "Industry Integration", description: "Direct connections to leading financial institutions and lending software providers", icon: Globe, benefits: ["Partner Network", "Job Placement Assistance", "Industry Connections", "Real-World Projects"] },
    { title: "Advanced Analytics", description: "Comprehensive learning analytics and performance insights for continuous improvement", icon: Database, benefits: ["Learning Insights", "Performance Metrics", "Progress Tracking", "Skill Assessment"] }
  ];

  const team = [
    { name: "Sarah Johnson", role: "CEO & Founder", background: "Former VP of Learning at Fortune 500 company", image: teamSarah },
    { name: "Michael Chen", role: "Chief Technology Officer", background: "15+ years in EdTech and enterprise software", image: teamMichael },
    { name: "Dr. Emily Rodriguez", role: "Head of Curriculum", background: "PhD in Education, former university professor", image: teamEmily }
  ];

  return (
    <>
      <SEOHead 
        title="About FinPilot | Professional Commercial Lending Training Platform"
        description="Learn about FinPilot's mission to advance careers in commercial lending through comprehensive training programs."
        keywords="Halo Business Finance, commercial lending training company, FinPilot program, business finance education"
        canonicalUrl="https://finpilot.com/about"
      />
      <div className="bg-background min-h-screen">
        {/* Hero Section */}
        <div className="relative h-72 sm:h-80 md:h-[28rem] overflow-hidden">
          <motion.img
            src={aboutHero}
            alt="Professional team collaboration"
            className="w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.2, 0, 0.38, 0.9] }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-halo-navy/85 via-halo-navy/60 to-transparent flex items-center">
            <div className="page-container">
              <motion.div
                className="max-w-2xl text-white"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0, 0.38, 0.9] }}
              >
                <Badge className="mb-3 sm:mb-4 bg-white/15 text-white border border-white/30 backdrop-blur-sm text-xs sm:text-sm">
                  <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" />
                  About Us
                </Badge>
                <h1 className="hero-title mb-3 sm:mb-4 leading-tight">About FinPilot</h1>
                <p className="text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed text-white/90">
                  FinPilot is a comprehensive training platform designed to advance careers in commercial lending and business finance.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="page-container py-8 md:py-12">
          {/* Our Story */}
          <AnimatedSection className="mb-12 md:mb-16">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Our Story</h2>
            </div>
            <div className="max-w-6xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <motion.div
                      className="h-64 lg:h-auto order-first lg:order-last overflow-hidden"
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: [0.2, 0, 0.38, 0.9] }}
                    >
                      <img src={companStory} alt="Halo Business Finance team collaboration" className="w-full h-full object-cover rounded-lg lg:rounded-r-lg lg:rounded-l-none" />
                    </motion.div>
                    <div className="p-8 order-last lg:order-first">
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        With over 15 years of experience in capital markets, SBA, and commercial lending, Halo Business Finance created the FinPilot course to address the growing need for specialized training in commercial lending.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Our curriculum combines theoretical knowledge with practical, hands-on training that reflects current industry practices.
                      </p>
                      <Button size="lg" asChild className="bg-halo-orange hover:bg-halo-orange/90 text-white">
                        <Link to="/signup" className="flex items-center gap-2">
                          Start Free Trial
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>

          {/* Stats Grid */}
          <StaggerContainer className="card-grid-3 mb-12 md:mb-16">
            {companyInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <StaggerItem key={index}>
                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                    <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-halo-navy" />
                        </div>
                        <div className="flex-1">
                          <div className="text-2xl font-bold text-foreground mb-1">{info.value}</div>
                          <div className="text-sm font-medium text-primary mb-2">{info.label}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">{info.description}</div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Platform Features */}
          <AnimatedSection className="mb-12 md:mb-16">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="section-title text-foreground">Advanced Learning Platform</h2>
            </div>
            <StaggerContainer className="card-grid-3 mb-8">
              {platformFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <StaggerItem key={index}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                      <Card className="hover:shadow-lg transition-shadow h-full">
                        <CardHeader>
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Icon className="h-6 w-6 text-halo-navy" />
                          </div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                          <CardDescription>{feature.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {feature.features.map((feat, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-halo-orange" />
                                <span className="text-sm text-foreground">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </AnimatedSection>

          {/* Security Features */}
          <AnimatedSection className="mb-12 md:mb-16">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="section-title text-foreground">Enterprise Security & Compliance</h2>
            </div>
            <StaggerContainer className="card-grid-3 mb-8">
              {securityFeatures.map((security, index) => {
                const Icon = security.icon;
                return (
                  <StaggerItem key={index}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                      <Card className="hover:shadow-lg transition-shadow h-full">
                        <CardHeader>
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Icon className="h-6 w-6 text-halo-navy" />
                          </div>
                          <CardTitle className="text-xl">{security.title}</CardTitle>
                          <CardDescription>{security.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {security.details.map((detail, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-halo-orange" />
                                <span className="text-sm text-foreground font-medium">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
            <AnimatedSection delay={0.2}>
              <Card className="bg-halo-navy text-white">
                <CardContent className="p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Financial-Grade Security</h3>
                    <p className="leading-relaxed max-w-4xl mx-auto mb-6 text-white/90">
                      We understand that financial training involves sensitive data. That's why we've implemented bank-level security measures including end-to-end encryption, multi-factor authentication, and compliance with SOC 2 and GDPR standards.
                    </p>
                    <Button size="lg" asChild className="bg-halo-orange hover:bg-halo-orange/90 text-white">
                      <Link to="/signup" className="flex items-center gap-2">
                        Start Free Trial
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </AnimatedSection>

          {/* Platform Advantages */}
          <AnimatedSection className="mb-12 md:mb-16">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="section-title text-foreground">Platform Advantages</h2>
            </div>
            <StaggerContainer className="card-grid-3 mb-8">
              {platformAdvantages.map((advantage, index) => {
                const Icon = advantage.icon;
                return (
                  <StaggerItem key={index}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                      <Card className="hover:shadow-lg transition-shadow h-full">
                        <CardHeader>
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Icon className="h-6 w-6 text-halo-navy" />
                          </div>
                          <CardTitle className="text-xl">{advantage.title}</CardTitle>
                          <CardDescription>{advantage.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {advantage.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-halo-orange" />
                                <span className="text-sm text-foreground">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnimatedSection delay={0.1}>
                <Card className="bg-gradient-to-br from-halo-orange/5 to-halo-navy/5 h-full">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-halo-navy" />
                      Global Accessibility
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Access your training materials from anywhere in the world with our cloud-based platform. Our global content delivery network ensures fast loading times regardless of your location.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <Card className="bg-gradient-to-br from-halo-navy/5 to-halo-orange/5 h-full">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Database className="h-5 w-5 text-halo-navy" />
                      Continuous Innovation
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our platform continuously evolves with regular updates, new features, and enhanced capabilities to ensure you're always learning with the most advanced tools available.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
            <AnimatedSection className="text-center mt-8">
              <Button size="lg" asChild className="bg-halo-orange hover:bg-halo-orange/90 text-white">
                <Link to="/signup" className="flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </AnimatedSection>
          </AnimatedSection>

          {/* Leadership Team */}
          <AnimatedSection>
            <div className="text-center mb-6 md:mb-8">
              <h2 className="section-title text-foreground">Leadership Team</h2>
            </div>
            <StaggerContainer className="card-grid-3">
              {team.map((member, index) => (
                <StaggerItem key={index}>
                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                    <Card className="h-full">
                      <CardHeader className="text-center">
                        <motion.div
                          className="mx-auto w-20 h-20 rounded-full mb-4 overflow-hidden"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.2 }}
                        >
                          <img src={member.image} alt={`${member.name} - ${member.role}`} className="w-full h-full object-cover" />
                        </motion.div>
                        <CardTitle>{member.name}</CardTitle>
                        <CardDescription className="font-medium text-primary">{member.role}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground">{member.background}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </AnimatedSection>

          <FinPilotBrandFooter />
        </div>
      </div>
    </>
  );
};

export default About;
