const { z } = require("zod")

const resumeProjectSchema = z.object({
    title: z.string().describe("Project title extracted from resume or self description. Leave empty string if unknown."),
    description: z.string().describe("Brief project description using only facts from the source material. Leave empty string if unknown."),
    technologies: z.array(z.string()).describe("Technologies mentioned for this project. Empty array if none found.")
})

const resumeEducationSchema = z.object({
    institution: z.string().describe("School or university name. Leave empty string if not found in source material."),
    degree: z.string().describe("Degree or qualification. Leave empty string if not found."),
    duration: z.string().describe("Duration or graduation year. Leave empty string if not found.")
})

const resumeExperienceSchema = z.object({
    company: z.string().describe("Employer name. Leave empty string if not found in source material."),
    role: z.string().describe("Job title or role. Leave empty string if not found."),
    duration: z.string().describe("Employment duration. Leave empty string if not found."),
    achievements: z.array(z.string()).describe("Bullet points describing achievements. Only include facts from source material. Empty array if none.")
})

const resumeSchema = z.object({
    name: z.string().describe("Candidate full name if explicitly present in resume or self description. Otherwise empty string."),
    email: z.string().describe("Email address if explicitly present. Otherwise empty string."),
    phone: z.string().describe("Phone number if explicitly present. Otherwise empty string."),
    location: z.string().describe("City, state, or location if explicitly present. Otherwise empty string."),
    summary: z.string().describe("Professional summary rewritten from resume and self description only. Empty string if insufficient information."),
    skills: z.array(z.string()).describe("Skills explicitly mentioned in resume or self description. Empty array if none."),
    projects: z.array(resumeProjectSchema).describe("Projects explicitly mentioned in resume or self description. Empty array if none."),
    education: z.array(resumeEducationSchema).describe("Education entries explicitly mentioned in resume or self description. Empty array if none."),
    experience: z.array(resumeExperienceSchema).describe("Work experience explicitly mentioned in resume or self description. Empty array if none.")
})

module.exports = {
    resumeSchema,
    resumeProjectSchema,
    resumeEducationSchema,
    resumeExperienceSchema
}
