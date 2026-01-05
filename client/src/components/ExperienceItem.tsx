import { motion } from "framer-motion";
import { Calendar, Building } from "lucide-react";
import type { Experience } from "@shared/schema";

interface ExperienceItemProps {
  experience: Experience;
  index: number;
}

export function ExperienceItem({ experience, index }: ExperienceItemProps) {
  const bulletPoints = (experience.description || "")
    .split("\n")
    .map((point) => point.trim())
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 md:pl-0"
    >
      <div className="md:flex items-start justify-between group">
        <div className="hidden md:block w-32 pt-2 text-right pr-8">
          <span className="text-sm font-semibold text-muted-foreground block whitespace-nowrap">
            {experience.startDate}
          </span>
          <span className="text-sm text-muted-foreground/60 block whitespace-nowrap">
            {experience.endDate || "Present"}
          </span>
        </div>
        
        <div className="relative md:w-[2px] md:bg-border md:self-stretch md:mx-4">
          <div className="absolute top-2 left-[-5px] md:left-[-5px] w-3 h-3 rounded-full bg-primary ring-4 ring-background transition-colors group-hover:bg-accent" />
        </div>

        <div className="flex-1 md:pl-8 pb-12">
          <div className="md:hidden flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span>{experience.startDate} - {experience.endDate || "Present"}</span>
          </div>
          
          <h3 className="text-xl font-bold text-foreground font-display">{experience.role}</h3>
          
          <div className="flex items-center gap-2 text-primary font-medium mt-1 mb-3">
            <Building className="w-4 h-4" />
            <span>{experience.company}</span>
          </div>
          
          {bulletPoints.length > 0 ? (
            <ul className="space-y-2 text-muted-foreground">
              {bulletPoints.map((point, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary/70 flex-shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground leading-relaxed">
              {experience.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
