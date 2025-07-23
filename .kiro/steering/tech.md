# Technology Stack

## Current Setup
- **Version Control**: Git
- **AI Assistant**: Kiro IDE integration
- **Line Endings**: Auto-normalized (LF) via .gitattributes

## Build System
*To be determined based on chosen technology stack*

## Dependencies
*No dependencies currently defined*

## Common Commands
Since the tech stack is not yet established, common commands will be added once the project technology is chosen.

### Future Considerations
- Choose primary programming language/framework
- Set up build system (npm, Maven, Cargo, etc.)
- Configure testing framework
- Establish linting and formatting tools
- Set up CI/CD pipeline

## Development Environment
- Ensure Git is configured properly
- Use Kiro for AI-assisted development
- Follow consistent line ending conventions (LF)

## Frontend Rules
- Use Next.js with App Router
- Use Tailwind v4 for all styling
- Avoid using custom CSS unless explicitly stated

## Backend Rules
- Use Prisma as ORM
- Database = PostgreSQL on Render
- API should follow RESTful conventions unless declared otherwise

## Auth Rules
- Use NextAuth with Google + GitHub + Credentials
- Auth token should be persisted via Prisma adapter

## Dev Workflow
- Format with Prettier on save
- Lint with ESLint on commit
- CI/CD with GitHub Actions or Vercel Deployment Preview
