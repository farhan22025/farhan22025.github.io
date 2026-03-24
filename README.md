# Farhan Alam Repository

## About

This repository contains Farhan Alam's live portfolio website, supporting frontend prototypes, a small Python game project, and a structured workspace for academic and personal software engineering work.

Live portfolio:

[https://farhan22025.github.io/](https://farhan22025.github.io/)

Main contents of this repository:

- `index.html`, `styles.css`, `script.js`, and `chatbot-data.js` for the live portfolio site
- `assets/` for portfolio media and the hosted resume PDF
- `Farhans_Portfolio_PrototypeV1/` for an earlier portfolio prototype
- `Recipe_Share/` for a recipe-sharing HTML project
- `Tictaoe/` for a Python Tkinter tic-tac-toe project
- `Portfolio-Projects/` for organized academic, personal, and data engineering project documentation

## Instructions on how to run this program

To run the main portfolio website locally:

1. Open this folder on your computer.
2. Open `index.html` in a browser, or start a small local server from this directory.
3. Keep an internet connection available so external fonts and map assets can load correctly.

Example local server command:

```bash
python -m http.server 5500
```

Then visit `http://localhost:5500`.

To deploy the portfolio on GitHub Pages:

1. Push this repository to GitHub.
2. Open the repository settings.
3. Go to `Pages`.
4. Set the source to `Deploy from a branch`.
5. Select `main` and `/ (root)`.
6. Save and wait for the site to publish.

Each extra project folder in this repository includes its own `README.md` with project-specific run instructions.

To run a real browser smoke test locally:

1. Install the testing dependency:

```bash
python -m pip install -r requirements-dev.txt
```

2. Run the browser smoke test:

```bash
python tests/browser_smoke_test.py
```

This starts a temporary local server, opens the portfolio in a real browser engine, and checks the theme toggle, Hire Me button scroll, map load, and chatbot replies.

## Objective

The objective of this repository is to present Farhan Alam's professional portfolio in a clean and accessible way, while also keeping supporting projects, documentation, and learning work organized in one GitHub-ready place.
