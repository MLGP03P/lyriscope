\# AI\_AGENT.md



\# Lyriscope - AI Development Instructions



\*\*Read this file completely before making any changes to the codebase.\*\*



\---



\# Mission



Your purpose is to help build \*\*Lyriscope\*\*, a desktop application centered around synchronized lyrics, immersive visualizers, and highly customizable listening experiences.



The project values:



\* Elegance

\* Simplicity

\* Maintainability

\* Offline-first functionality

\* Strong architecture



You are not building a traditional media player.



You are building an experience.



\---



\# Required Reading Order



Before modifying any code, read:



```text

PROJECT\_BRIEF.md

DESIGN.md

ARCHITECTURE.md

ROADMAP.md

AI\_AGENT.md

```



All implementation decisions must align with these documents.



\---



\# Technology Stack



\## Frontend



```text

React

TypeScript

Vite

Canvas 2D

Web Audio API

```



\---



\## Desktop Layer



```text

Tauri

```



\---



\## Backend



```text

Rust

```



\---



\# Development Philosophy



Always prefer:



```text

Simple > Clever

Readable > Concise

Maintainable > Experimental

Finished > Ambitious

```



Do not introduce complexity without a strong justification.



\---



\# Fundamental Rules



\---



\## Rule 1



Never implement future features prematurely.



Examples:



```text

NO:



Spotify integration

Streaming services

Voice assistants

Cloud accounts

Online profiles

Social systems

```



These belong to future versions.



\---



\## Rule 2



Respect the roadmap.



Only work on the current milestone.



Do not jump ahead.



If a task belongs to a later phase, document it instead of implementing it.



\---



\## Rule 3



Keep responsibilities isolated.



Frontend responsibilities:



```text

Rendering

Animations

Visualizers

User interaction

Theme application

Playback controls

```



Rust responsibilities:



```text

Filesystem access

Metadata extraction

Lyrics providers

Caching

Persistence

```



Do not mix these concerns.



\---



\## Rule 4



Audio playback belongs to the frontend.



Use:



```text

HTMLAudioElement

Web Audio API

```



Do NOT move playback engines into Rust unless explicitly requested.



Visualizers depend heavily on frontend audio analysis.



\---



\## Rule 5



AI systems must remain isolated.



Future AI modules belong in:



```text

src-tauri/ai/

```



Examples:



```text

theme\_generation/

lyric\_alignment/

dj\_mode/

```



The core application must function perfectly without them.



\---



\# Coding Standards



\---



\# TypeScript



Requirements:



```text

strict = true

```



Avoid:



```typescript

any

```



Prefer:



```typescript

unknown

interfaces

explicit types

```



\---



Use:



```text

Functional components

Hooks

Composition

```



Avoid:



```text

Class components

Global mutable state

Deep prop chains

```



\---



\# React



Prefer:



```text

Small components

Memoization where necessary

Local state

Reusable hooks

```



Avoid:



```text

Massive components

Over-engineering

Premature abstractions

```



\---



\# Rust



Requirements:



```text

cargo fmt

cargo clippy

```



Prefer:



```text

Explicit types

Strong ownership

Clear module boundaries

```



Avoid:



```text

Unsafe code

Macros without justification

Hidden complexity

```



\---



\# State Management



Preferred solution:



```text

Zustand

```



Stores:



```text

PlayerStore

SettingsStore

ThemeStore

LibraryStore

```



Do not introduce Redux.



The project is intentionally lightweight.



\---



\# Visual Design Rules



The application should feel:



```text

Minimal

Cinematic

Elegant

Reactive

Immersive

```



Avoid:



```text

RGB gaming aesthetics

Heavy shadows

Busy interfaces

Excessive particle effects

Overloaded menus

```



\---



\# Lyrics Principles



Lyrics are the primary focus.



The current lyric line must always be:



```text

Largest

Most visible

Highest contrast

```



Everything else is secondary.



\---



\# Theme Principles



Themes must remain data-driven.



Preferred structure:



```json

{

&#x20;   "name": "Night Drive",

&#x20;   "accentColor": "#7B2CFF",

&#x20;   "background": "album\_blur",

&#x20;   "visualizer": "aura"

}

```



Do not hardcode visual behaviors.



Use configuration objects.



\---



\# Performance Targets



\---



\## Frontend



Target:



```text

60 FPS

```



Avoid:



```text

Expensive DOM trees

Frequent re-renders

Heavy animations

```



Prefer:



```text

Canvas rendering

Memoization

Efficient updates

```



\---



\## Backend



Target:



```text

Instant metadata retrieval

Fast cache access

Responsive file scanning

```



Use async operations where appropriate.



\---



\# Dependency Policy



Before adding a dependency, ask:



\---



\## Is it necessary?



Could this be implemented with existing tools?



\---



\## Is it maintained?



Avoid abandoned libraries.



\---



\## Does it increase complexity?



Prefer fewer dependencies.



\---



\# Preferred Dependencies



Frontend:



```text

React

Zustand

Tailwind (optional)

Framer Motion (optional)

```



Backend:



```text

serde

tokio

lofty

reqwest

```



\---



\# Documentation Requirements



Whenever introducing:



```text

New modules

Public APIs

Architectural changes

```



Update:



```text

ARCHITECTURE.md

ROADMAP.md

```



Documentation is part of the implementation.



\---



\# Git Philosophy



Prefer:



```text

Small commits

Single-purpose changes

Clear commit messages

```



Examples:



```text

feat: add lrc parser



fix: improve lyric synchronization



refactor: split visualizer hooks

```



Avoid giant commits.



\---



\# Future Features



The following systems belong to future versions only.



\---



\## AI Themes



```text

Version 2

```



Generate themes using:



```text

Album colors

Genre

Energy

Lyrics

Mood

```



\---



\## AI Lyric Alignment



```text

Version 3

```



Generate synchronized lyrics from plain text.



Manual correction tools remain mandatory.



\---



\## Smart DJ Mode



```text

Version 4

```



Features:



```text

Energy matching

Queue generation

Crossfades

Mood modes

```



\---



\## Voice DJ



```text

Version 5

```



Entirely optional.



Must remain independent from the core application.



\---



\# When Unsure



If multiple solutions exist:



Choose the one that is:



```text

Simpler

More maintainable

More explicit

Easier to understand

```



Never optimize prematurely.



Never implement speculative features.



Never sacrifice architecture for convenience.



\---



\# Rule Zero



The project exists to make music feel more personal and immersive.



Technical complexity is justified only when it improves that experience.



