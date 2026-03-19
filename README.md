# Farhan Alam Portfolio

A modern, minimal, and fully responsive personal portfolio website built with plain HTML, CSS, and JavaScript for easy GitHub Pages deployment.

## Folder Structure

```text
E:\Project_portfolio11
|-- assets
|   |-- favicon.svg
|   `-- farhan-cv-resume.pdf
|-- chatbot-data.js
|-- index.html
|-- Portfolio-Projects
|   `-- README.md
|-- Prompt to Codex.txt
|-- styles.css
|-- script.js
`-- README.md
```

## Features

- Responsive single-page layout
- Modern teal/cyan data-dashboard inspired design
- Sticky navigation with active section tracking
- Typing animation in the hero section
- Scroll reveal animations
- Animated skill bars
- Dark/light mode toggle with saved preference
- Interactive Leaflet map with Dhaka and DIU Ashulia markers
- In-site chatbot with a curated portfolio question bank
- Direct resume, Facebook, and WhatsApp contact buttons
- Frontend-only contact form

## Run Locally

1. Open the project folder.
2. Double-click `index.html` or serve the folder with a simple local server.
3. Make sure you have an internet connection so the Google Fonts and Leaflet CDN assets can load.

If you want to run it with a local server using Python:

```bash
python -m http.server 5500
```

Then visit `http://localhost:5500`.

## Deploy To GitHub Pages

1. Create a new GitHub repository.
2. Upload the files from this project folder.
3. Commit and push to the repository's default branch.
4. In GitHub, open `Settings` > `Pages`.
5. Under `Build and deployment`, choose `Deploy from a branch`.
6. Select your default branch and the `/ (root)` folder.
7. Save the settings and wait for GitHub Pages to publish the site.

## Customize Before Publishing

- Replace the placeholder GitHub link in `index.html`.
- Replace the placeholder LinkedIn link in `index.html`.
- Update any wording, skill percentages, or project details as needed.
- If you want different map markers, edit the coordinates in `script.js`.
- To expand the chatbot's answers, add or edit entries in `chatbot-data.js`.
- The real learning workspace now lives under `Portfolio-Projects/`; add files there as you build out each track.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Leaflet.js

## Chatbot Notes

- The chatbot is fully client-side and does not use a backend or external AI API.
- It works by preprocessing the seeded question bank in `chatbot-data.js` and matching visitor questions to the closest portfolio topic.
- It is fast and private, but limited to the information currently included in the site data.
