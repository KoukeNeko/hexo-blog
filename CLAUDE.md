# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hexo-based personal blog and portfolio website for 陳德生 (doeshing). The site features a custom Twitter-inspired dark theme with advanced functionality including search, table of contents, reading progress, and interactive widgets.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run server

# Build for production
hexo generate
# or
npm run build

# Clean generated files
hexo clean
# or
npm run clean

# Deploy (if configured)
npm run deploy
```

## Architecture

### Core Structure
- **Hexo Static Site Generator**: Uses Hexo 7.3.0 as the main framework
- **Custom Theme**: Located in `themes/my-theme/` with Twitter-inspired dark UI
- **Content Management**: Posts in `source/_posts/`, pages in `source/`
- **Search System**: Custom search generator at `scripts/search-generator.js`

### Theme Architecture
The custom theme (`my-theme`) implements a three-column layout:
- **Left Sidebar**: Category navigation and site navigation
- **Main Content**: Article content with full Markdown support
- **Right Sidebar**: Profile widget, recent posts, tags, table of contents (on post pages)

### Key Features
- **Responsive Design**: Mobile-first with sidebar collapse
- **Search Functionality**: Client-side search with autocomplete
- **Reading Experience**: Progress bar, word count, reading time estimation
- **Interactive Elements**: Floating action buttons, smooth scrolling, cursor effects
- **Typography**: Custom font stack including Inter, Geist, VT323 for terminal aesthetics

### Configuration Files
- `_config.yml`: Main Hexo configuration (site settings, permalinks, generators)
- `themes/my-theme/_config.yml`: Theme configuration (profile, widgets, appearance, features)
- `package.json`: Dependencies and npm scripts

### Content Structure
- Posts use standard Hexo front matter with categories and tags
- Categories include "專案" (Projects) and "General"
- Supports both English and Chinese content (configured for Chinese with English fallback)
- Custom scaffolds in `scaffolds/` for consistent post formatting

### JavaScript and CSS
- Custom theme assets in `themes/my-theme/source/`
- Lucide icons for consistent iconography
- CSS uses modern features (CSS Grid, Flexbox, CSS custom properties)
- JavaScript handles search, scroll behavior, reading progress, and interactive features

## Development Notes

- The theme uses EJS templating with Hexo's built-in helpers
- Search data is generated as JSON and consumed client-side
- Color scheme is defined in theme config with CSS custom properties
- Profile and social links are configurable through theme settings
- Widget system allows enabling/disabling components per page type