import { motion } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  FileText, 
  Mail, 
  ChevronDown,
  Code2,
  Database,
  Layout,
  Server,
  ArrowRight,
  Link2,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { ExperienceItem } from "@/components/ExperienceItem";
import { ContactForm } from "@/components/ContactForm";
import { 
  useProfile, 
  useProjects, 
  useExperiences, 
  useEducation, 
  useSkills 
} from "@/hooks/use-portfolio";
import type { Skill, Project, Experience, Profile } from "@shared/schema";

export default function Portfolio() {
  const { data: profile } = useProfile();
  const { data: projects } = useProjects();
  const { data: experiences } = useExperiences();
  const { data: education } = useEducation();
  const { data: skills } = useSkills();

  const defaultProfile: Profile = {
    id: 1,
    name: "Zubair Muwwakil",
    title: "Software Engineer (Full-Stack / Backend)",
    bio: "I build full-stack systems, data pipelines, and dashboards that stay correct under load. Clean architecture, schema-first APIs, and reliable releases are my defaults.",
    email: "zmuwwakil@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/zubairmuwwakil/",
    githubUrl: "https://github.com/ZthEchelon",
    resumeUrl: "https://drive.google.com/file/d/1Z87uMI6RrrPa9KeIhZChkpzl-YYZYgTr/view?usp=sharing",
    imageUrl: null,
  };

  const profileData = {
    ...defaultProfile,
    ...(profile || {}),
    title: defaultProfile.title,
    bio: defaultProfile.bio,
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  type SkillBand = {
    title: string;
    level: "strong" | "working" | "familiar";
    items: string[];
  };

  const fallbackSkillBands: SkillBand[] = [
    {
      title: "Core",
      level: "strong",
      items: ["Java (Spring Boot)", "TypeScript / JavaScript", "React", "SQL"],
    },
    {
      title: "Also",
      level: "working",
      items: ["Node.js", "Python", "Docker", "Postgres", "Prisma", "REST APIs", "Testing (JUnit/Jest)", "CI/CD"],
    },
    {
      title: "Practices",
      level: "familiar",
      items: ["Clean architecture", "API design", "Schema migrations", "Observability basics"],
    },
  ];

  const skillBands: SkillBand[] = (() => {
    if (!skills?.length) return fallbackSkillBands;

    const groups: Record<string, SkillBand> = {
      core: { title: "Core", level: "strong", items: [] },
      also: { title: "Also", level: "working", items: [] },
      practices: { title: "Practices", level: "familiar", items: [] },
    };

    const levelFromProficiency = (value?: Skill["proficiency"]): SkillBand["level"] => {
      if (!value && value !== 0) return "working";
      if (value >= 85) return "strong";
      if (value >= 70) return "working";
      return "familiar";
    };

    skills.forEach((skill) => {
      const key = (skill.category as keyof typeof groups) || "also";
      if (!groups[key]) return;
      const level = levelFromProficiency(skill.proficiency);
      // prefer the strongest label for the group when a higher-skill item appears
      const levelPriority: Record<SkillBand["level"], number> = { strong: 3, working: 2, familiar: 1 };
      if (levelPriority[level] > levelPriority[groups[key].level]) {
        groups[key].level = level;
      }
      groups[key].items.push(skill.name);
    });

    return Object.values(groups).filter((group) => group.items.length > 0);
  })();

  const fallbackExperiences: Experience[] = [
    {
      id: 1,
      company: "SAP Fioneer",
      role: "Software Engineer",
      startDate: "Jan 2022",
      endDate: "Aug 2022",
      description: [
        "Built and hardened Spring Boot services for banking workflows, pairing REST APIs with integration tests and strict validation to keep releases stable.",
        "Added SQL audit logging and data-quality checks so reconciliation events and ledger updates stayed consistent through migrations.",
        "Containerized services with Docker and tightened observability (structured logs + metrics) to speed up debugging and on-call response.",
      ].join("\n"),
    },
    {
      id: 2,
      company: "WeMeta",
      role: "Software Engineer",
      startDate: "Jul 2021",
      endDate: "Feb 2023",
      description: [
        "Delivered full-stack features for marketplace dashboards (React + TypeScript frontend, Node/SQL services) that served thousands of listings daily.",
        "Designed typed REST endpoints and caching around high-traffic search/analytics paths to keep p95 response times predictable.",
        "Shipped background jobs to ingest and normalize external data feeds, improving freshness and reducing manual data cleanup.",
      ].join("\n"),
    },
    {
      id: 3,
      company: "Web Dev / Full Stack (Whitby)",
      role: "Software Engineer",
      startDate: "Dec 2019",
      endDate: "Mar 2023",
      description: [
        "Built and deployed client portals and marketing sites with React/Node/Postgres, moving scheduling and intake off spreadsheets.",
        "Implemented forms, email notifications, and light analytics so teams could track leads and follow-ups without extra tooling.",
        "Set up CI/CD pipelines and Dockerized services to cut release friction and keep environments reproducible.",
      ].join("\n"),
    },
  ];

  type CaseStudyProject = Project & {
    problem?: string;
    buildSummary?: string;
    decisions?: string[];
    results?: string;
    demoUrl?: string;
    caseStudyUrl?: string;
  };

  const projectDetails: Record<string, Partial<CaseStudyProject>> = {
    "Pickleball Session Manager": {
      problem: "Captains were juggling players, courts, and ratings in spreadsheets, leading to unbalanced matches and dropped data.",
      buildSummary: "Built a full-stack session manager that balances courts, schedules matches, and updates ratings automatically.",
      decisions: [
        "Prisma schema + migrations for players, sessions, matches, and rating events to keep data integrity front and center.",
        "Balancing algorithm that groups players by availability and skill to minimize idle time and repeat pairings.",
        "Guardrails on rating updates (idempotent writes, conflict checks) plus audits to explain every change.",
      ],
      results: "Session setup moved from manual sorting to a predictable flow; captains trust rating changes because they're validated and auditable.",
      demoUrl: "https://pickleball.zubairmuwwakil.com",
      caseStudyUrl: "https://www.zubairmuwwakil.com/github-projects-certifications#h.x7x3lu4gcab7",
    },
    "Market Data Pipeline": {
      problem: "Analysts needed reliable end-of-day data with calculated indicators without fighting stale caches or inconsistent formulas.",
      buildSummary: "Developed a Spring Boot pipeline that ingests market data, caches time-series in memory, and serves analytics via REST + a lightweight dashboard.",
      decisions: [
        "Idempotent ingest jobs with retries and checksum validation to prevent duplicate bars.",
        "Normalized database design for tickers and indicators so calculations could be recomputed or extended without schema churn.",
        "Layered caching (in-memory + tuned TTLs) to keep common indicator endpoints snappy while staying consistent with source data.",
      ],
      results: "Indicator responses stay fast and repeatable; adding a new metric is a schema migration and a small service extension instead of a rewrite.",
      caseStudyUrl: "https://www.zubairmuwwakil.com/github-projects-certifications#h.7fnkak3j8h5",
    },
  };

  const fallbackProjects: CaseStudyProject[] = [
    {
      id: 1,
      title: "Pickleball Session Manager",
      description: "Full-stack app for managing sessions, balanced groups, matches, and transparent rating changes.",
      link: "https://www.zubairmuwwakil.com/github-projects-certifications#h.x7x3lu4gcab7",
      githubLink: "https://github.com/ZthEchelon",
      tags: ["React", "Prisma", "Balance Algorithm", "Clean Architecture"],
      ...projectDetails["Pickleball Session Manager"],
    },
    {
      id: 2,
      title: "Market Data Pipeline",
      description: "Spring Boot market data pipeline with cached analytics endpoints and a dashboard.",
      link: "https://www.zubairmuwwakil.com/github-projects-certifications#h.7fnkak3j8h5",
      githubLink: "https://github.com/ZthEchelon",
      tags: ["Java", "Spring Boot", "Data Pipeline", "REST API"],
      ...projectDetails["Market Data Pipeline"],
    },
    {
      id: 3,
      title: "Mind Map Website",
      description: "Interactive mind map tool for plotting ideas, project steps, and timelines.",
      link: "https://mindsky.zubairmuwwakil.com",
      githubLink: "https://github.com/ZthEchelon",
      tags: ["JavaScript", "Interactive UI"],
    },
    {
      id: 4,
      title: "HomeServer Setup",
      description: "Self-hosted storage and backup flow with clear documentation.",
      link: "https://www.zubairmuwwakil.com/homeserver-setup-guide",
      githubLink: "https://github.com/ZthEchelon",
      tags: ["Infrastructure", "Docker", "Automation"],
    },
  ];

  const projectSource: CaseStudyProject[] = (
    projects && projects.length > 0 ? (projects as CaseStudyProject[]) : fallbackProjects
  ).map((project) => {
    const details = projectDetails[project.title];
    return {
      ...project,
      ...details,
      githubLink: project.githubLink || details?.githubLink || profileData.githubUrl,
      demoUrl: details?.demoUrl || project.demoUrl || project.link,
      caseStudyUrl: details?.caseStudyUrl || project.caseStudyUrl || project.link,
    };
  });

  const caseStudyProjects = projectSource.filter((p) => projectDetails[p.title]);
  const otherProjects = projectSource.filter((p) => !projectDetails[p.title]);
  const experienceList = experiences && experiences.length > 0 ? experiences : fallbackExperiences;

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (!profile && !projects && !experiences) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <span className="font-display font-bold text-xl tracking-tight text-primary">ZM.</span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">About</button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-primary transition-colors">Skills</button>
            <button onClick={() => scrollToSection('experience')} className="hover:text-primary transition-colors">Experience</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-primary transition-colors">Projects</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">Contact</button>
          </div>
          <Button 
            size="sm" 
            onClick={() => scrollToSection('contact')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20"
          >
            Hire Me
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm inline-block mb-6">
                  Software Engineer (Full-Stack / Backend)
                </span>
                <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight leading-[1.1] mb-4">
                  <span className="text-gradient block">{profileData.name}</span>
                  builds reliable software.
                </h1>
                <p className="text-xl md:text-2xl text-foreground leading-relaxed max-w-2xl font-semibold">
                  I ship data-heavy products end-to-end and keep reliability, data integrity, and performance front and center.
                </p>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mt-3">
                  Finance/data background with a clean-architecture mindset: typed APIs, schema-first designs, and thoughtful instrumentation so releases stay boring.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                <Button 
                  size="lg" 
                  className="rounded-xl h-12 gap-2 shadow-lg shadow-primary/25"
                  onClick={() => scrollToSection('projects')}
                >
                  View Projects <ArrowRight className="w-4 h-4" />
                </Button>
                {profileData.resumeUrl && (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-xl h-12 gap-2" 
                    asChild
                  >
                    <a href={profileData.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="w-5 h-5" /> Resume (PDF)
                    </a>
                  </Button>
                )}
                {profileData.githubUrl && (
                  <Button variant="ghost" size="icon" className="rounded-full" asChild>
                    <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <Github className="w-5 h-5" />
                    </a>
                  </Button>
                )}
                {profileData.linkedinUrl && (
                  <Button variant="ghost" size="icon" className="rounded-full" asChild>
                    <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </Button>
                )}
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                {[
                  "Java / Spring Boot • React • SQL • Docker",
                  "Built data pipelines + web apps",
                  "Open to US remote (US citizen)",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="px-3 py-2 bg-secondary text-secondary-foreground text-sm rounded-full border border-border/60"
                  >
                    {chip}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 p-2 rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-card relative">
                  {/* Abstract placeholder or profile image */}
                  {profileData.imageUrl ? (
                    <img src={profileData.imageUrl} alt={profileData.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-9xl opacity-10 font-display font-bold">ZM</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Button variant="ghost" size="icon" onClick={() => scrollToSection('about')}>
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="About" 
            subtitle="How I build and where I've proven it." 
            centered={false}
          />

          <div className="grid lg:grid-cols-3 gap-10 mt-8">
            <div className="lg:col-span-2 space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>I build systems, web apps, and data pipelines that stay correct when traffic spikes.</p>
              <p>I care about clean, maintainable architecture: typed contracts, schema migrations, and observability so reliability and performance are measurable.</p>
              <p>Shipped: Pickleball Session Manager (balanced scheduling + rating changes), Market Data Pipeline (Spring Boot ingest + cached indicators), and a self-hosted HomeServer.</p>
              <p>Looking for backend/full-stack SWE roles where Java/Spring Boot or TypeScript/Node are core to the stack.</p>
              <p>Also built the pickleball product for local clubs—pickleball stays, but now it's proof of execution.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">What I'm looking for</span>
                </div>
                <p className="text-foreground font-semibold">
                  Backend / Full-Stack SWE • Java/Spring Boot or TS/Node • Remote US
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Proof / Links</span>
                </div>
                <div className="flex flex-col gap-2">
                  {profileData.resumeUrl && (
                    <a
                      href={profileData.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                    >
                      <FileText className="w-4 h-4" /> Resume PDF
                    </a>
                  )}
                  {profileData.githubUrl && (
                    <a
                      href={profileData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                    >
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  {profileData.linkedinUrl && (
                    <a
                      href={profileData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Skills & Practices" 
            subtitle="Strong where it matters, honest about depth."
            centered 
          />
          
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {skillBands.map((band, idx) => {
              const icons = {
                Core: <Server className="w-6 h-6 text-primary" />,
                Also: <Layout className="w-6 h-6 text-primary" />,
                Practices: <Database className="w-6 h-6 text-primary" />,
              };

              const levelLabels: Record<typeof band.level, string> = {
                strong: "Strong",
                working: "Working",
                familiar: "Familiar",
              };

              return (
                <motion.div 
                  key={band.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        {icons[band.title as keyof typeof icons] || <Code2 className="w-6 h-6 text-primary" />}
                      </div>
                      <h3 className="text-lg font-bold font-display">{band.title}</h3>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide bg-secondary px-3 py-1 rounded-full text-secondary-foreground">
                      {levelLabels[band.level]}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {band.items.map((item) => (
                      <span 
                        key={item} 
                        className="px-3 py-2 bg-muted text-sm rounded-full border border-border/60"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Experience" subtitle="Built, shipped, and operated software with measurable impact." />
          
          <div className="space-y-12">
            {experienceList.map((exp, index) => (
              <ExperienceItem key={exp.id} experience={exp} index={index} />
            ))}
          </div>

          <div className="mt-20">
            <h3 className="text-2xl font-bold font-display mb-8">Education</h3>
            <div className="grid gap-6">
              {education?.map((edu, index) => (
                <motion.div 
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-6 rounded-xl border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-lg font-bold font-display">{edu.school}</h4>
                    <p className="text-primary font-medium">{edu.degree}, {edu.field}</p>
                  </div>
                  <div className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full w-fit">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Projects & Case Studies" 
            subtitle="How I design, build, and ship software—end-to-end."
            centered
          />
          
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            {caseStudyProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {otherProjects.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold font-display">Other Projects</h3>
                <span className="text-sm text-muted-foreground">Smaller builds that still ship value.</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherProjects.map((project, index) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    index={index + caseStudyProjects.length} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeader 
                title="Let's Work Together" 
                subtitle="Email or LinkedIn are fastest. The form below also reaches me directly."
              />
              
              <div className="space-y-8 mt-8">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-display mb-1">Email Me</h4>
                    <p className="text-muted-foreground mb-2">Send a short note with what you need. I'll reply quickly.</p>
                    <a href={`mailto:${profileData.email}`} className="text-primary font-medium hover:underline">
                      {profileData.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl text-primary">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-display mb-1">Connect on LinkedIn</h4>
                    <p className="text-muted-foreground mb-2">Happy to connect or chat about backend/full-stack roles.</p>
                    <a 
                      href={profileData.linkedinUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:pt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-background text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {profileData.name}. All rights reserved. Built with React & Tailwind.
          </p>
        </div>
      </footer>
    </div>
  );
}
