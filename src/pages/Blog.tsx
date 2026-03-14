import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { FinPilotBrandFooter } from "@/components/FinPilotBrandFooter";
import { SEOHead } from "@/components/SEOHead";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BlogFilterSidebar } from "@/components/BlogFilterSidebar";
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import blogHero from "@/assets/blog-hero.jpg";
import fintechProfessional from "@/assets/fintech-professional.jpg";
import creditAnalystProfessional from "@/assets/credit-analyst-professional.jpg";
import riskManagementProfessional from "@/assets/risk-management-professional.jpg";
import digitalTrainingProfessional from "@/assets/digital-training-professional.jpg";
import aiAnalyticsProfessional from "@/assets/ai-analytics-professional.jpg";
import microlearningProfessional from "@/assets/microlearning-professional.jpg";
import adaptiveLearningProfessional from "@/assets/adaptive-learning-professional.jpg";
import gamificationProfessional from "@/assets/gamification-professional.jpg";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [titleFilter, setTitleFilter] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 8;

  const posts = [
    { id: 1, title: "The Future of Financial Technology in Commercial Lending", excerpt: "Explore how emerging technologies are reshaping the commercial lending landscape.", author: "Sarah Johnson", date: "2025-08-15", category: "Technology", readTime: "5 min read", image: fintechProfessional },
    { id: 2, title: "Essential Skills for Modern Credit Analysts", excerpt: "A comprehensive guide to the key competencies every credit analyst needs.", author: "Michael Chen", date: "2025-08-05", category: "Career Development", readTime: "8 min read", image: creditAnalystProfessional },
    { id: 3, title: "Risk Management Best Practices for 2024", excerpt: "Stay ahead of the curve with the latest risk management strategies.", author: "Dr. Emily Rodriguez", date: "2025-07-22", category: "Risk Management", readTime: "6 min read", image: riskManagementProfessional },
    { id: 4, title: "Digital Transformation in Corporate Training", excerpt: "How organizations are leveraging digital platforms to enhance learning.", author: "Sarah Johnson", date: "2025-07-10", category: "Technology", readTime: "7 min read", image: digitalTrainingProfessional },
    { id: 5, title: "Maximizing ROI with AI-Powered Learning Platforms", excerpt: "Discover how AI is revolutionizing corporate training efficiency.", author: "Dr. Emily Rodriguez", date: "2025-06-28", category: "Technology", readTime: "6 min read", image: aiAnalyticsProfessional },
    { id: 6, title: "Microlearning: The Future of Professional Development", excerpt: "Why bite-sized learning modules are more effective for busy professionals.", author: "Michael Chen", date: "2025-06-15", category: "Career Development", readTime: "5 min read", image: microlearningProfessional },
    { id: 7, title: "Adaptive Learning Systems in Financial Training", excerpt: "How personalized learning paths are transforming professional education.", author: "Sarah Johnson", date: "2025-05-18", category: "Technology", readTime: "7 min read", image: adaptiveLearningProfessional },
    { id: 8, title: "Gamification Strategies for Enhanced Learning Engagement", excerpt: "Explore how interactive elements boost completion rates in online training.", author: "Dr. Emily Rodriguez", date: "2025-05-05", category: "Technology", readTime: "6 min read", image: gamificationProfessional },
    { id: 9, title: "Commercial Lending Best Practices for 2024", excerpt: "Essential strategies every commercial lender needs to know.", author: "Michael Chen", date: "2025-04-20", category: "Commercial Lending", readTime: "8 min read", image: creditAnalystProfessional },
    { id: 10, title: "Optimizing Business Finance Operations", excerpt: "Streamline financial processes and enhance profitability.", author: "Sarah Johnson", date: "2025-04-08", category: "Business Finance", readTime: "7 min read", image: fintechProfessional },
    { id: 11, title: "SBA Lending: A Complete Guide for Lenders", excerpt: "Navigate complexities of SBA loan programs and eligibility.", author: "Dr. Emily Rodriguez", date: "2025-03-25", category: "SBA Loans", readTime: "9 min read", image: riskManagementProfessional },
    { id: 12, title: "USDA Rural Development Loan Programs", excerpt: "Understanding USDA loan programs for rural businesses.", author: "Michael Chen", date: "2025-03-12", category: "USDA Loans", readTime: "7 min read", image: digitalTrainingProfessional },
    { id: 13, title: "Capital Markets Trends and Opportunities", excerpt: "Explore current capital market conditions and emerging opportunities.", author: "Sarah Johnson", date: "2025-02-28", category: "Capital Markets", readTime: "8 min read", image: aiAnalyticsProfessional }
  ];

  const categories = ["All", "Commercial Lending", "Business Finance", "SBA Loans", "USDA Loans", "Capital Markets", "Technology", "Career Development", "Risk Management"];

  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = category === "All" ? posts.length : posts.filter(p => p.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  const filterByDate = (post: unknown) => {
    if (selectedDateRange === 'all') return true;
    const postDate = new Date(post.date);
    const now = new Date();
    switch (selectedDateRange) {
      case 'this-month': return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
      case 'last-3-months': return postDate >= new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      case 'last-6-months': return postDate >= new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      case 'this-year': return postDate.getFullYear() === now.getFullYear();
      case 'last-year': return postDate.getFullYear() === now.getFullYear() - 1;
      default: return true;
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesTitle = titleFilter === '' || post.title.toLowerCase().includes(titleFilter.toLowerCase());
    return matchesCategory && matchesTitle && filterByDate(post);
  });

  const handleCategoryChange = (category: string) => { setSelectedCategory(category); setCurrentPage(1); };
  const handleTitleFilterChange = (title: string) => { setTitleFilter(title); setCurrentPage(1); };
  const handleDateRangeChange = (range: string) => { setSelectedDateRange(range); setCurrentPage(1); };

  const totalPages = Math.ceil(filteredPosts.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <>
      <SEOHead
        title="Finance Blog & Resources | FinPilot Professional Learning Insights"
        description="Expert insights on commercial lending, business finance, SBA loans, and professional development."
        keywords="finance blog, commercial lending insights, business finance articles"
        canonicalUrl="https://finpilot.com/blog"
      />
      <div className="bg-background min-h-screen">
        {/* Hero */}
        <div className="relative h-72 sm:h-80 md:h-[28rem] overflow-hidden">
          <motion.img
            src={blogHero}
            alt="Professional blog and knowledge sharing"
            className="w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.2, 0, 0.38, 0.9] }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-halo-navy/85 via-halo-navy/60 to-transparent flex items-center justify-center">
            <motion.div
              className="text-center text-white max-w-4xl mx-auto px-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-3 sm:mb-4 bg-white/15 text-white border border-white/30 backdrop-blur-sm text-xs sm:text-sm">
                <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" />
                Industry Insights & Resources
              </Badge>
              <h1 className="hero-title mb-3 sm:mb-4">Blog & Resources</h1>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                Stay informed with the latest insights, trends, and best practices in finance and professional development.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="page-container py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <AnimatedSection className="lg:w-80 flex-shrink-0">
              <BlogFilterSidebar
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                titleFilter={titleFilter}
                onTitleFilterChange={handleTitleFilterChange}
                selectedDateRange={selectedDateRange}
                onDateRangeChange={handleDateRangeChange}
                counts={{ all: posts.length, ...categoryCounts }}
              />
            </AnimatedSection>

            <div className="flex-1 min-w-0">
              <AnimatedSection className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {selectedCategory === 'All'
                    ? `Latest Articles (${filteredPosts.length})`
                    : `${selectedCategory} Articles (${filteredPosts.length})`}
                </h2>
              </AnimatedSection>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
                {currentPosts.map((post) => (
                  <StaggerItem key={post.id}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                      <Card className="hover:shadow-lg transition-shadow overflow-hidden h-full">
                        <div className="h-40 md:h-48 overflow-hidden">
                          <motion.img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                        <CardHeader className="p-4 md:p-6">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className="text-xs bg-transparent text-halo-orange border-none">{post.category}</Badge>
                            <span className="text-xs md:text-sm text-muted-foreground">{post.readTime}</span>
                          </div>
                          <div className="relative inline-block">
                            <CardTitle className="text-lg md:text-xl hover:text-primary cursor-pointer text-foreground">{post.title}</CardTitle>
                            <div className="h-0.5 bg-halo-orange mt-2 w-full" />
                          </div>
                          <CardDescription className="text-sm text-muted-foreground mt-2">{post.excerpt}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6 pt-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                            <Link to={`/article/${post.id}`}>
                              <Button className="text-xs md:text-sm bg-halo-navy text-white hover:bg-halo-navy/90" size="sm">
                                Read More
                                <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 md:mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => {
                        const page = i + 1;
                        const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                        if (!showPage) {
                          if (page === currentPage - 2 || page === currentPage + 2) return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>;
                          return null;
                        }
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page} className="cursor-pointer">{page}</PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              <div className="text-center mt-6 text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} articles
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </div>
            </div>
          </div>
        </div>

        <FinPilotBrandFooter />
      </div>
    </>
  );
};

export default Blog;
