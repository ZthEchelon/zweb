import { motion } from "framer-motion";
import { Github, ExternalLink, Tag, FileText } from "lucide-react";
import type { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: Project & {
    problem?: string;
    buildSummary?: string;
    decisions?: string[];
    results?: string;
    demoUrl?: string;
    caseStudyUrl?: string;
  };
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const decisions = project.decisions || [];
  const isCaseStudy = Boolean(project.problem || project.buildSummary || decisions.length > 0 || project.results);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card rounded-2xl border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col h-full p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary/70 mb-2">
            {isCaseStudy ? "Case Study" : "Project"}
          </p>
          <h3 className="text-2xl font-bold font-display group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground mt-2">{project.description}</p>
        </div>
        <span className="p-2 bg-primary/10 rounded-xl text-primary">
          <Tag className="w-5 h-5" />
        </span>
      </div>

      <div className="space-y-3 mt-6">
        {project.problem && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Problem</p>
            <p className="text-foreground">{project.problem}</p>
          </div>
        )}
        {project.buildSummary && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">What I built</p>
            <p className="text-foreground">{project.buildSummary}</p>
          </div>
        )}
        {decisions.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Key technical decisions</p>
            <ul className="space-y-2 text-muted-foreground">
              {decisions.map((decision, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary/70 flex-shrink-0" />
                  <span className="leading-relaxed">{decision}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {project.results && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Results / impact</p>
            <p className="text-foreground">{project.results}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-6">
        {project.tags?.map((tag) => (
          <span 
            key={tag} 
            className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-auto pt-4">
        {project.demoUrl && (
          <Button asChild size="sm" className="rounded-xl">
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              Live Demo <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </Button>
        )}
        {project.githubLink && (
          <Button variant="outline" asChild size="sm" className="rounded-xl">
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" /> GitHub
            </a>
          </Button>
        )}
        {project.caseStudyUrl && (
          <Button variant="ghost" asChild size="sm" className="rounded-xl">
            <a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="w-4 h-4 mr-2" /> Read Case Study
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
