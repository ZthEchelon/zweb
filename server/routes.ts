import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.profile.get.path, async (req, res) => {
    const profile = await storage.getProfile();
    res.json(profile || {});
  });

  app.get(api.experiences.list.path, async (req, res) => {
    const experiences = await storage.getExperiences();
    res.json(experiences);
  });

  app.get(api.education.list.path, async (req, res) => {
    const education = await storage.getEducation();
    res.json(education);
  });

  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.skills.list.path, async (req, res) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });

  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      await storage.createContactMessage(input);
      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input" });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed Data
  const existingProfile = await storage.getProfile();
  if (!existingProfile) {
    await storage.createProfile({
      name: "Zubair Muwwakil",
      title: "Software Engineer (Full-Stack / Backend)",
      bio: "I build full-stack systems, data pipelines, and dashboards that stay correct under load. Clean architecture, schema-first APIs, and reliable releases are my defaults.",
      email: "zmuwwakil@gmail.com",
      linkedinUrl: "https://www.linkedin.com/in/zubairmuwwakil/",
      githubUrl: "https://github.com/ZthEchelon",
      resumeUrl: "https://drive.google.com/file/d/1Z87uMI6RrrPa9KeIhZChkpzl-YYZYgTr/view?usp=sharing",
    });
  }

  const educationCount = (await storage.getEducation()).length;
  if (educationCount === 0) {
    await storage.createEducation({
      school: "University of Toronto",
      degree: "Bachelor of Computer Science",
      field: "Computer Science",
      startDate: "2019",
      endDate: "2023",
    });
  }

  const experiencesCount = (await storage.getExperiences()).length;
  if (experiencesCount === 0) {
    await storage.createExperience({
      company: "SAP Fioneer",
      role: "Software Engineer",
      startDate: "Jan 2022",
      endDate: "Aug 2022",
      description: [
        "Built and hardened Spring Boot services for banking workflows, pairing REST APIs with integration tests and strict validation to keep releases stable.",
        "Added SQL audit logging and data-quality checks so reconciliation events and ledger updates stayed consistent through migrations.",
        "Containerized services with Docker and tightened observability (structured logs + metrics) to speed up debugging and on-call response.",
      ].join("\n"),
    });

    await storage.createExperience({
      company: "WeMeta",
      role: "Software Engineer",
      startDate: "Jul 2021",
      endDate: "Feb 2023",
      description: [
        "Delivered full-stack features for marketplace dashboards (React + TypeScript frontend, Node/SQL services) that served thousands of listings daily.",
        "Designed typed REST endpoints and caching around high-traffic search/analytics paths to keep p95 response times predictable.",
        "Shipped background jobs to ingest and normalize external data feeds, improving freshness and reducing manual data cleanup.",
      ].join("\n"),
    });

    await storage.createExperience({
      company: "Web Dev / Full Stack (Whitby)",
      role: "Software Engineer",
      startDate: "Dec 2019",
      endDate: "Mar 2023",
      description: [
        "Built and deployed client portals and marketing sites with React/Node/Postgres, moving scheduling and intake off spreadsheets.",
        "Implemented forms, email notifications, and light analytics so teams could track leads and follow-ups without extra tooling.",
        "Set up CI/CD pipelines and Dockerized services to cut release friction and keep environments reproducible.",
      ].join("\n"),
    });
  }

  const projectsCount = (await storage.getProjects()).length;
  if (projectsCount === 0) {
    await storage.createProject({
      title: "Pickleball Session Manager",
      description: "Full-stack app for managing sessions, balanced groups, matches, and transparent rating changes.",
      link: "https://pickleball.zubairmuwwakil.com",
      githubLink: "https://github.com/ZthEchelon",
      tags: ["React", "Prisma", "Balance Algorithm", "Clean Architecture"],
    });

    await storage.createProject({
      title: "Market Data Pipeline",
      description: "Spring Boot market data pipeline with cached analytics endpoints and a dashboard.",
      link: "https://www.zubairmuwwakil.com/github-projects-certifications#h.7fnkak3j8h5",
      githubLink: "https://github.com/ZthEchelon",
      tags: ["Java", "Spring Boot", "Data Pipeline", "REST API"],
    });

    await storage.createProject({
      title: "Mind Map Website",
      description: "Interactive mind map tool for plotting ideas, project steps, and timelines.",
      link: "https://mindsky.zubairmuwwakil.com",
      githubLink: "https://github.com/ZthEchelon",
      tags: ["JavaScript", "Interactive", "Mind Mapping"],
    });

    await storage.createProject({
      title: "HomeServer Setup",
      description: "Created a custom homeserver infrastructure to function similarly to Google Drive for personal data management.",
      link: "https://www.zubairmuwwakil.com/homeserver-setup-guide",
      githubLink: "https://github.com/ZthEchelon",
      tags: ["Infrastructure", "Server Setup", "Data Management"],
    });
  }

  const skillsCount = (await storage.getSkills()).length;
  if (skillsCount === 0) {
    // Core
    await storage.createSkill({ name: "Java (Spring Boot)", category: "core", proficiency: 95 });
    await storage.createSkill({ name: "TypeScript / JavaScript", category: "core", proficiency: 90 });
    await storage.createSkill({ name: "React", category: "core", proficiency: 90 });
    await storage.createSkill({ name: "SQL", category: "core", proficiency: 90 });

    // Also
    await storage.createSkill({ name: "Node.js", category: "also", proficiency: 85 });
    await storage.createSkill({ name: "Python", category: "also", proficiency: 80 });
    await storage.createSkill({ name: "Docker", category: "also", proficiency: 80 });
    await storage.createSkill({ name: "Postgres", category: "also", proficiency: 85 });
    await storage.createSkill({ name: "Prisma", category: "also", proficiency: 80 });
    await storage.createSkill({ name: "REST APIs", category: "also", proficiency: 88 });
    await storage.createSkill({ name: "Testing (JUnit/Jest)", category: "also", proficiency: 82 });
    await storage.createSkill({ name: "CI/CD", category: "also", proficiency: 80 });

    // Practices
    await storage.createSkill({ name: "Clean architecture", category: "practices", proficiency: 90 });
    await storage.createSkill({ name: "API design", category: "practices", proficiency: 88 });
    await storage.createSkill({ name: "Schema migrations", category: "practices", proficiency: 85 });
    await storage.createSkill({ name: "Observability basics", category: "practices", proficiency: 75 });
  }

  return httpServer;
}
