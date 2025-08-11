# Project Structure

## Current Organization

```
.
├── .git/                 # Git version control
├── .gitattributes       # Git configuration for line endings
└── .kiro/               # Kiro AI assistant configuration
    └── steering/        # AI guidance documents
        ├── product.md   # Product overview and goals
        ├── tech.md      # Technology stack and tools
        └── structure.md # Project organization (this file)
```

## Conventions

- Use consistent naming conventions (to be established with tech stack)
- Maintain clear separation between source code, tests, and configuration
- Keep documentation at appropriate levels (project root, module level)
- Use descriptive folder and file names

## Future Structure Guidelines

Once the project technology is chosen, consider these organizational patterns:

### For Web Projects

- `src/` - Source code
- `tests/` or `__tests__/` - Test files
- `docs/` - Documentation
- `public/` or `static/` - Static assets

### For Backend Projects

- `src/` or `lib/` - Source code
- `tests/` - Test files
- `config/` - Configuration files
- `scripts/` - Build and utility scripts

### General Guidelines

- Keep the root directory clean
- Group related functionality together
- Use consistent file naming patterns
- Separate concerns clearly (business logic, configuration, tests)
- Document any non-standard organizational choices

## Component Structure Rules

- All components go in /src/components
- Separate UI from Logic → create hooks inside /src/hooks
- Pages under /src/pages should only handle layout and import logic from other files

## Routing Rules

- Use file-based routing from Next.js
- Dynamic routes should go in [brackets] as per Next.js conventions
