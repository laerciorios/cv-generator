import { z } from "zod";
import { CV_SCHEMA_VERSION, type CVDocument } from "@/types/cv.types";

const urlPattern = /^https?:\/\/[^\s]+$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function textField(maxLength: number) {
  return z.string().trim().max(maxLength);
}

function optionalUrl(maxLength: number) {
  return textField(maxLength).refine(
    (value) => value.length === 0 || urlPattern.test(value),
    "Invalid URL",
  );
}

function optionalEmail(maxLength: number) {
  return textField(maxLength).refine(
    (value) => value.length === 0 || emailPattern.test(value),
    "Invalid email",
  );
}

const baseSectionItemSchema = z.object({
  id: z.uuid(),
  visible: z.boolean(),
});

const personalInfoSchema = z.object({
  fullName: textField(120),
  email: optionalEmail(320),
  phone: textField(40),
  location: textField(120),
  summary: textField(1200),
  website: optionalUrl(300),
  linkedIn: optionalUrl(300),
  github: optionalUrl(300),
  photo: optionalUrl(300),
});

const experienceItemSchema = baseSectionItemSchema.extend({
  role: textField(120),
  company: textField(120),
  location: textField(120),
  startDate: textField(20),
  endDate: textField(20),
  current: z.boolean(),
  summary: textField(1200),
  highlights: z.array(textField(240)).max(12),
});

const educationItemSchema = baseSectionItemSchema.extend({
  institution: textField(160),
  degree: textField(120),
  fieldOfStudy: textField(120),
  location: textField(120),
  startDate: textField(20),
  endDate: textField(20),
  current: z.boolean(),
  summary: textField(1200),
});

const languageItemSchema = baseSectionItemSchema.extend({
  name: textField(80),
  proficiency: textField(80),
  details: textField(240),
});

const skillItemSchema = baseSectionItemSchema.extend({
  name: textField(80),
  category: textField(80),
  level: textField(80),
});

const volunteerItemSchema = baseSectionItemSchema.extend({
  role: textField(120),
  organization: textField(160),
  location: textField(120),
  startDate: textField(20),
  endDate: textField(20),
  current: z.boolean(),
  summary: textField(1200),
});

const projectItemSchema = baseSectionItemSchema.extend({
  name: textField(120),
  role: textField(120),
  website: optionalUrl(300),
  github: optionalUrl(300),
  startDate: textField(20),
  endDate: textField(20),
  current: z.boolean(),
  summary: textField(1200),
  technologies: z.array(textField(80)).max(20),
});

const extraItemSchema = baseSectionItemSchema.extend({
  title: textField(120),
  value: textField(160),
  details: textField(600),
});

function sectionStateSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    visible: z.boolean(),
    items: z.array(itemSchema),
  });
}

export const cvDocumentSchema: z.ZodType<CVDocument> = z.object({
  id: z.uuid(),
  personalInfo: personalInfoSchema,
  sections: z.object({
    experience: sectionStateSchema(experienceItemSchema),
    education: sectionStateSchema(educationItemSchema),
    languages: sectionStateSchema(languageItemSchema),
    skills: sectionStateSchema(skillItemSchema),
    volunteer: sectionStateSchema(volunteerItemSchema),
    projects: sectionStateSchema(projectItemSchema),
    extras: sectionStateSchema(extraItemSchema),
  }),
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    schemaVersion: z.literal(CV_SCHEMA_VERSION),
  }),
});

export function formatZodIssues(error: z.ZodError) {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "document";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}
