# TODOs:
x omit writing section for now before i have anything
x update publications
x about section: better urls, contact education block?
    maybe a very brief cv: postdoc 2x, phd, msc, bsc
    skills section?
x on wide screens: all 2/3 1/3


- look into pre-commit typo check

- write research projects
- thumbnail for each paper / project
- tags for each paper (MCMCP, developmental psych etc)
- icon for website
- experiments/demo section?

https://next.layerchart.com/
accessibility: screen reader
favicon doesnt work on safari




# Academic Researcher Website

A modern, clean website for academic researchers built with SvelteKit. Features a minimalist design inspired by contemporary portfolio sites with full markdown support for projects and writing.

## Features

- **Clean, Modern Design**: Minimalist blue and white color scheme
- **Responsive Layout**: Works perfectly on all devices
- **Dual Content Management**: Support for both TypeScript data files and markdown files with YAML frontmatter
- **Image Optimization**: Built-in image optimization with multiple formats and responsive sizing
- **Multiple Sections**: Landing page, projects, publications, writing, and about pages
- **SEO Optimized**: Built with SvelteKit for optimal performance and SEO
- **TypeScript Support**: Fully typed for better development experience
- **Fast Development**: Hot module replacement and fast refresh

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the website directory:

```bash
cd website
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Content Management

The site supports two approaches to content management:

### Method 1: TypeScript Data Files (Primary)

Content is currently managed through TypeScript files for type safety and ease of editing:

- **Personal Information**: Edit `src/lib/data/personal.ts`
- **Publications**: Edit `src/lib/data/publications.ts` (or use the JSON file in `src/lib/assets/`)
- **Sample Content**: Edit `src/lib/data/sample-content.ts` for projects and writing

### Method 2: Markdown Files (Optional)

You can also create markdown files in the `src/content/` directory:

#### Adding Projects

Create markdown files in the `src/content/projects/` directory with the following frontmatter:

```yaml
---
title: "Your Project Title"
date: "2024-01-15"
description: "Brief description of your project"
status: "Active" # or "Completed", "In Progress"
tags: ["tag1", "tag2", "tag3"]
link: "https://github.com/your-project"
---

Your project content in markdown...
```

#### Adding Writing

Create markdown files in the `src/content/writing/` directory with the following frontmatter:

```yaml
---
title: "Your Article Title"
date: "2024-01-15"
excerpt: "Brief excerpt or summary"
category: "Opinion" # or "Research", "Tutorial", etc.
tags: ["tag1", "tag2"]
---

Your article content in markdown...
```

## Customization

### Personal Information

Update the configuration files:

- **Site Configuration**: `src/lib/config/site.ts`
- **Personal Data**: `src/lib/data/personal.ts`
- **Main Config Re-exports**: `src/lib/config.ts`

### Styling

The site uses Tailwind CSS v4 with a blue and white color scheme. To customize colors, update the Tailwind classes throughout the components or modify `tailwind.config.ts`.

### Content Sections

Main content sections are located in:
- `src/routes/+page.svelte` - Landing page content
- `src/routes/+layout.svelte` - Site layout and navigation
- `src/lib/components/` - Reusable components

## Deployment

This site is optimized for deployment on various platforms:

### Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Self-hosted
```bash
npm run build
npm run preview
```

## File Structure

```
├── src/
│   ├── routes/
│   │   ├── +page.svelte          # Landing page
│   │   ├── +layout.svelte        # Site layout
│   │   ├── +page.ts              # Page data loader
│   │   ├── projects/             # Projects section
│   │   │   ├── [slug]/           # Dynamic project pages
│   │   │   └── +page.svelte      # Projects listing
│   │   └── writing/              # Writing section
│   │       ├── [slug]/           # Dynamic writing pages
│   │       └── +page.svelte      # Writing listing
│   ├── content/                  # Markdown content (optional)
│   │   ├── projects/             # Project markdown files
│   │   └── writing/              # Writing markdown files
│   ├── lib/
│   │   ├── components/           # Reusable Svelte components
│   │   │   ├── Button.svelte
│   │   │   ├── Navigation.svelte
│   │   │   ├── SocialIcons.svelte
│   │   │   └── ...
│   │   ├── config/               # Configuration files
│   │   │   └── site.ts           # Site-wide settings
│   │   ├── data/                 # Data files
│   │   │   ├── personal.ts       # Personal information
│   │   │   ├── publications.ts   # Publications data
│   │   │   └── sample-content.ts # Sample projects/writing
│   │   ├── types/                # TypeScript type definitions
│   │   │   └── index.ts          # All type definitions
│   │   ├── utils/                # Utility functions
│   │   │   ├── content.ts        # Content processing utilities
│   │   │   ├── publications.ts   # Publication utilities
│   │   │   └── bibtex.ts         # BibTeX utilities
│   │   ├── assets/               # Internal assets
│   │   │   ├── myPublications.json
│   │   │   └── portrait.png
│   │   ├── config.ts             # Main config re-exports
│   │   ├── markdown.ts           # Markdown processing
│   │   └── utils.ts              # CSS utility functions
│   ├── app.html                  # HTML template
│   ├── app.css                   # Global styles
│   └── app.d.ts                  # App type definitions
├── static/
│   ├── assets/                   # Static assets
│   │   ├── documents/            # PDFs, CVs, etc.
│   │   └── images/               # Static images
│   └── favicon.png
├── package.json
├── svelte.config.js
├── tailwind.config.ts
└── vite.config.ts
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type checking
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run test:unit` - Run unit tests
- `npm run test` - Run all tests

### Adding New Features

The site is built with SvelteKit and follows modern web development practices:

- **Components**: Create reusable Svelte components in `src/lib/components/`
- **Routes**: Add new pages in `src/routes/`
- **Styles**: Use Tailwind CSS classes or add custom CSS
- **Data**: Update configuration in `src/lib/data/` or `src/lib/config/`
- **Types**: Add TypeScript types in `src/lib/types/index.ts`
- **Utilities**: Add helper functions in `src/lib/utils/`

### Content Processing

The site includes comprehensive utilities for content management:

- **Markdown Processing**: Parse frontmatter, extract headings, validate structure
- **Content Utilities**: Sort, filter, search, and get related content
- **Publication Management**: Handle BibTeX imports and formatting
- **Image Optimization**: Automatic responsive image generation with multiple formats

### Architecture

The project follows a modular architecture:

- **Type Safety**: All data structures are properly typed
- **Separation of Concerns**: Data, configuration, and utilities are organized separately
- **Content Flexibility**: Support for both TypeScript and markdown content
- **Performance**: Optimized images and static site generation

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
