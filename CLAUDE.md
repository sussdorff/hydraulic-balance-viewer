# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue.js application for viewing and managing hydraulic balancing data for residential heating systems. The app displays heating room data in both table and detail views, allows JSON import/export, and works as a single standalone HTML file after building.

## Documentation

For detailed information, refer to the documentation in the `ai_docs/` directory:

- **PROJECT_OVERVIEW.md** - High-level project description and purpose
- **QUICK_START.md** - Get up and running in 5 minutes with setup instructions
- **ARCHITECTURE.md** - Directory structure, tech stack, and design patterns
- **DATA_MODEL.md** - Complete JSON schema and data structure documentation
- **COMPONENT_REFERENCE.md** - Detailed component API and usage guide
- **CODE_PATTERNS.md** - Coding conventions and patterns used in the project
- **FEATURES_AND_WORKFLOWS.md** - User features and typical workflows
- **COMMON_TASKS.md** - How to implement common development tasks
- **GERMAN_TERMINOLOGY.md** - German heating system terminology reference
- **TESTING_GUIDE.md** - Testing setup, strategies, and examples
- **CURRENT_STATE.md** - Current implementation status and known issues

## Commands

### Development
```zsh
npm run dev        # Start Vite dev server at http://localhost:5173
npm run build      # Build single HTML file to dist/index.html
npm run preview    # Preview production build
npm run serve      # Python HTTP server for dist (port 8080)
```