# Hydraulic Balance Viewer

A Vue.js application for viewing and managing hydraulic balancing data for residential heating systems.

## Features

- 📊 **Table View**: Quick overview of all rooms with key heating parameters
- 🔍 **Detailed Modal**: Click any room to view comprehensive heating details
- 📁 **JSON Import/Export**: Load and save hydraulic balancing data
- 🎯 **Single File Output**: Works directly from file:// protocol (no server needed)
- 🏠 **Multi-Floor Support**: Organized by KG, EG, OG, DG (German floor designations)

## Technology Stack

- **Vue.js 3** (CDN) - Reactive UI framework
- **Vite** - Build tool for bundling into single HTML
- **Bootstrap 5** - UI components and styling
- **vite-plugin-singlefile** - Bundles everything inline

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (creates dist/index.html)
npm run build
```

## Usage

### Development
1. Run `npm run dev` to start the Vite dev server
2. Open http://localhost:5173 in your browser

### Production
1. Run `npm run build` to create the bundled version
2. Open `dist/index.html` directly in your browser (no server needed!)

### Loading Data
- Click "JSON hochladen" or drag & drop a JSON file
- Sample data available in `sample-data.json`

## Project Structure

```
├── src/
│   ├── main.js        # Vue application logic
│   └── style.css      # Application styles
├── dist/
│   └── index.html     # Bundled single-file output (after build)
├── index.html         # Development HTML template
├── vite.config.js     # Vite configuration
├── sample-data.json   # Example hydraulic balancing data
└── package.json       # Dependencies and scripts
```

## Data Format

The application expects JSON data with the following structure:

```json
{
  "raeume": [
    {
      "stockwerk": "Erdgeschoss",
      "raumbezeichnung": "Wohnzimmer",
      "raumnutzung": "Wohnraum",
      "norm_innentemperatur_c": 20,
      "raumgroesse_m2": 25.5,
      "raumhoehe_m": 2.5,
      "raumvolumen_m3": 63.75,
      "heizkoerper": [...],
      "fenster": [...],
      "tueren": [...]
    }
  ]
}
```

## Future Enhancements

- [ ] Full editing capabilities in detail view
- [ ] PDF export for documentation
- [ ] Heat loss calculations
- [ ] Migration to Nuxt.js for multi-user support
- [ ] Database integration for data persistence

## License

Private project for residential heating system documentation.

## Author

Created for managing hydraulic balancing data for residential properties.