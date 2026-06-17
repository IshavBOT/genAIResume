function escapeHtml(value) {
    if (value === null || value === undefined) {
        return ""
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

function hasText(value) {
    return typeof value === "string" && value.trim().length > 0
}

function hasItems(array) {
    return Array.isArray(array) && array.length > 0
}

function filterExperience(experience) {
    if (!hasItems(experience)) {
        return []
    }

    return experience.filter((entry) =>
        hasText(entry.company) ||
        hasText(entry.role) ||
        hasText(entry.duration) ||
        hasItems(entry.achievements?.filter(hasText))
    )
}

function filterEducation(education) {
    if (!hasItems(education)) {
        return []
    }

    return education.filter((entry) =>
        hasText(entry.institution) ||
        hasText(entry.degree) ||
        hasText(entry.duration)
    )
}

function filterProjects(projects) {
    if (!hasItems(projects)) {
        return []
    }

    return projects.filter((entry) =>
        hasText(entry.title) ||
        hasText(entry.description) ||
        hasItems(entry.technologies?.filter(hasText))
    )
}

function filterSkills(skills) {
    if (!hasItems(skills)) {
        return []
    }

    return skills.filter(hasText)
}

function buildContactLine(data) {
    const parts = [ data.email, data.phone, data.location ].filter(hasText)
    return parts.map(escapeHtml).join(" | ")
}

function renderSkills(skills) {
    const items = filterSkills(skills)

    if (!items.length) {
        return ""
    }

    return `
        <section class="section">
            <h2 class="section-title">Skills</h2>
            <p class="skills-list">${items.map((skill) => escapeHtml(skill)).join(" • ")}</p>
        </section>
    `
}

function renderProjects(projects) {
    const items = filterProjects(projects)

    if (!items.length) {
        return ""
    }

    const projectBlocks = items.map((project) => {
        const technologies = filterSkills(project.technologies)
        const techLine = technologies.length
            ? `<p class="meta"><strong>Technologies:</strong> ${technologies.map(escapeHtml).join(", ")}</p>`
            : ""

        return `
            <div class="entry">
                ${hasText(project.title) ? `<h3 class="entry-title">${escapeHtml(project.title)}</h3>` : ""}
                ${hasText(project.description) ? `<p class="entry-text">${escapeHtml(project.description)}</p>` : ""}
                ${techLine}
            </div>
        `
    }).join("")

    return `
        <section class="section">
            <h2 class="section-title">Projects</h2>
            ${projectBlocks}
        </section>
    `
}

function renderExperience(experience) {
    const items = filterExperience(experience)

    if (!items.length) {
        return ""
    }

    const experienceBlocks = items.map((entry) => {
        const headerParts = []

        if (hasText(entry.role)) {
            headerParts.push(`<span class="entry-role">${escapeHtml(entry.role)}</span>`)
        }

        if (hasText(entry.company)) {
            headerParts.push(`<span class="entry-company">${escapeHtml(entry.company)}</span>`)
        }

        const header = headerParts.length
            ? `<div class="entry-header">${headerParts.join('<span class="separator"> | </span>')}</div>`
            : ""

        const duration = hasText(entry.duration)
            ? `<p class="meta">${escapeHtml(entry.duration)}</p>`
            : ""

        const achievements = hasItems(entry.achievements)
            ? `<ul class="bullet-list">${entry.achievements.filter(hasText).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
            : ""

        return `
            <div class="entry">
                ${header}
                ${duration}
                ${achievements}
            </div>
        `
    }).join("")

    return `
        <section class="section">
            <h2 class="section-title">Experience</h2>
            ${experienceBlocks}
        </section>
    `
}

function renderEducation(education) {
    const items = filterEducation(education)

    if (!items.length) {
        return ""
    }

    const educationBlocks = items.map((entry) => {
        const titleParts = []

        if (hasText(entry.degree)) {
            titleParts.push(escapeHtml(entry.degree))
        }

        if (hasText(entry.institution)) {
            titleParts.push(escapeHtml(entry.institution))
        }

        return `
            <div class="entry">
                ${titleParts.length ? `<h3 class="entry-title">${titleParts.join(" — ")}</h3>` : ""}
                ${hasText(entry.duration) ? `<p class="meta">${escapeHtml(entry.duration)}</p>` : ""}
            </div>
        `
    }).join("")

    return `
        <section class="section">
            <h2 class="section-title">Education</h2>
            ${educationBlocks}
        </section>
    `
}

function generateResumeHTML(data) {
    const safeData = data || {}
    const contactLine = buildContactLine(safeData)

    const header = `
        <header class="header">
            ${hasText(safeData.name) ? `<h1 class="name">${escapeHtml(safeData.name)}</h1>` : ""}
            ${contactLine ? `<p class="contact">${contactLine}</p>` : ""}
        </header>
    `

    const summary = hasText(safeData.summary)
        ? `
            <section class="section">
                <h2 class="section-title">Summary</h2>
                <p class="summary-text">${escapeHtml(safeData.summary)}</p>
            </section>
        `
        : ""

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A4;
            margin: 18mm 16mm;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11pt;
            line-height: 1.45;
            color: #111111;
            background: #ffffff;
        }

        .resume {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
        }

        .header {
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 1px solid #d1d5db;
        }

        .name {
            font-size: 24pt;
            font-weight: 700;
            color: #111111;
            margin-bottom: 6px;
        }

        .contact {
            font-size: 10pt;
            color: #374151;
        }

        .section {
            margin-bottom: 16px;
        }

        .section-title {
            font-size: 12pt;
            font-weight: 700;
            color: #1d4ed8;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #e5e7eb;
        }

        .summary-text,
        .entry-text,
        .skills-list,
        .meta {
            color: #111111;
        }

        .entry {
            margin-bottom: 12px;
        }

        .entry:last-child {
            margin-bottom: 0;
        }

        .entry-header {
            margin-bottom: 2px;
        }

        .entry-role,
        .entry-company,
        .entry-title {
            font-size: 11pt;
            font-weight: 700;
            color: #111111;
        }

        .separator {
            color: #6b7280;
            font-weight: 400;
        }

        .meta {
            font-size: 10pt;
            color: #4b5563;
            margin-bottom: 4px;
        }

        .bullet-list {
            margin-top: 4px;
            padding-left: 18px;
        }

        .bullet-list li {
            margin-bottom: 3px;
        }
    </style>
</head>
<body>
    <main class="resume">
        ${header}
        ${summary}
        ${renderSkills(safeData.skills)}
        ${renderProjects(safeData.projects)}
        ${renderExperience(safeData.experience)}
        ${renderEducation(safeData.education)}
    </main>
</body>
</html>`
}

module.exports = {
    generateResumeHTML,
    escapeHtml,
    hasText,
    hasItems,
    filterExperience,
    filterEducation,
    filterProjects,
    filterSkills
}
