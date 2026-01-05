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
  const projectsCount = (await storage.getProjects()).length;
  if (projectsCount === 0) {
    const existingProfile = await storage.getProfile();
    if (!existingProfile) {
      await storage.createProfile({
        name: "Zubair Muwwakil",
        title: "Software Developer | Financial Data Analyst",
        bio: "I graduated from University of Toronto with a Bachelor of Computer Science. I am passionate about software development and financial analysis. I have a strong love for pickleball and have built projects around it.",
        email: "zmuwwakil@gmail.com",
        linkedinUrl: "https://www.linkedin.com/in/zubairmuwwakil/",
        githubUrl: "https://github.com/ZthEchelon",
        resumeUrl: "https://drive.google.com/file/d/1Z87uMI6RrrPa9KeIhZChkpzl-YYZYgTr/view?usp=sharing"
      });

      await storage.createEducation({
        school: "University of Toronto",
        degree: "Bachelor of Computer Science",
        field: "Computer Science",
        startDate: "2019",
        endDate: "2023"
      });
    }

    await storage.createProject({
      title: "Pickleball Session Manager",
      description: "A web application for managing pickleball sessions, players, balanced groups, matches, and rating changes. Built to model real-world recreational league workflows with a focus on correctness, data integrity, and clean architecture.",
      link: "https://www.zubairmuwwakil.com/github-projects-certifications#h.x7x3lu4gcab7",
      tags: ["React", "Web App", "Data Integrity", "Architecture"]
    });

    await storage.createProject({
      title: "Market Data Pipeline",
      description: "A Java Spring Boot market data pipeline that ingests end-of-day stock data, stores it in an in-memory time-series cache, and exposes analytics like SMA and daily high/low through REST APIs and a lightweight dashboard.",
      link: "https://www.zubairmuwwakil.com/github-projects-certifications#h.7fnkak3j8h5",
      tags: ["Java", "Spring Boot", "Data Pipeline", "REST API"]
    });

    await storage.createProject({
      title: "Mind Map Website",
      description: "A specialized tool built to track thoughts, project steps, or create timelines using interactive bubbles and grids.",
      link: "https://www.zubairmuwwakil.com/github-projects-certifications#h.eckex5m8z6u0",
      tags: ["JavaScript", "Interactive", "Mind Mapping"]
    });

    await storage.createProject({
      title: "HomeServer Setup",
      description: "Created a custom homeserver infrastructure to function similarly to Google Drive for personal data management.",
      link: "https://www.zubairmuwwakil.com/homeserver-setup-guide",
      tags: ["Infrastructure", "Server Setup", "Data Management"]
    });

    const skillsCount = (await storage.getSkills()).length;
    if (skillsCount === 0) {
      await storage.createSkill({ name: "JavaScript", category: "frontend", proficiency: 90 });
      await storage.createSkill({ name: "React", category: "frontend", proficiency: 85 });
      await storage.createSkill({ name: "Node.js", category: "backend", proficiency: 80 });
      await storage.createSkill({ name: "Python", category: "backend", proficiency: 85 });
      await storage.createSkill({ name: "SQL", category: "data", proficiency: 80 });
      await storage.createSkill({ name: "Financial Analysis", category: "data", proficiency: 75 });
    }
  }

  return httpServer;
}
