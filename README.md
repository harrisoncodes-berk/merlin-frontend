## Merlin

Merlin is an interactive Dungeons & Dragons companion that blends an AI-driven chat experience with a structured character builder and character sheet. It helps players and DMs role‑play, explore rules, and manage characters—without breaking immersion.

### What Merlin Does
Merlin provides a conversational interface for storytelling and rules questions while offering a robust UI for creating and maintaining 5e characters. It’s designed to be fast, intuitive, and data‑driven so you can focus on the adventure.

### Core Features
- **AI Chat for Roleplay and Rules**: Ask lore or rules questions, narrate actions, or converse in‑character. Chat autoscroll and a clean transcript keep the flow seamless.
- **Guided Character Creator**: Step through race, class, background, ability scores, skills, weapons, and spells with guardrails and contextual choices.
- **Character Sheet Management**: View abilities, skills, features, spells, and inventory at a glance with structured panels optimized for play at the table.
- **Class, Race, and Background Features**: Data‑driven features surfaced contextually based on your selections.
- **Spellbook and Preparation**: Browse and manage known/prepared spells with quick access in the chat and character panels.
- **Inventory & Equipment**: Track items and weapons with clear presentation in an interactive table.
- **Multiple Characters & Quick Switch**: Swap between saved characters without losing context.
- **Secure Authentication & Session Handling**: Sign in, stay signed in, and move between pages with protected routes.
- **Responsive UI**: Built for desktop and laptop play, with sensible layouts that adapt.

### How It Works (High Level)
- **Data‑Driven Content**: Classes, races, features, and spell choices are defined via JSON, enabling predictable UI and easy expansion.
- **Typed Domain Models**: Strong TypeScript models represent characters, choices, and chat messages for safer, clearer code.
- **State & Context**: React contexts manage auth and character state across the app.
- **API Layer**: A thin client abstracts chat and character endpoints for clean components.

### Tech Highlights
- **React + TypeScript + Vite** for a fast, type‑safe frontend.
- **Supabase** client integration for authentication and session handling.

Whether you’re building a new hero or diving into a dungeon, Merlin keeps your rules, roleplay, and records in one place.