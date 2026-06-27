\# ARCHITECTURE.md



\# Lyriscope - Architecture Document



\*\*Version:\*\* 0.1.0



\---



\# Architecture Goals



The architecture must prioritize:



\* Modularity

\* Maintainability

\* Clear separation of responsibilities

\* Future extensibility

\* Offline-first functionality



The MVP should remain simple, while allowing future AI features without major rewrites.



\---



\# Technology Stack



\## Frontend



```text

React

TypeScript

Vite

HTML5 Canvas

Web Audio API

Tailwind CSS (optional)

```



Responsibilities:



\* Rendering

\* User interaction

\* Animations

\* Visualizers

\* Theme application

\* Playback controls

\* Lyrics presentation



\---



\## Desktop Layer



```text

Tauri

```



Responsibilities:



\* Native application shell

\* IPC between frontend and backend

\* Filesystem permissions

\* Packaging and distribution



\---



\## Backend



```text

Rust

```



Responsibilities:



\* Metadata extraction

\* File scanning

\* Lyrics providers

\* Caching

\* Settings persistence

\* Future AI integrations



\---



\# High-Level Architecture



```text

┌───────────────────────────────────┐

│            Frontend               │

│                                   │

│ React + TypeScript                │

│                                   │

│ ├── Player UI                     │

│ ├── Lyrics UI                     │

│ ├── Visualizers                   │

│ ├── Themes                        │

│ └── Library                       │

└──────────────┬────────────────────┘

&#x20;              │

&#x20;              │ Tauri Commands

&#x20;              │

┌──────────────▼────────────────────┐

│            Backend                │

│                                   │

│ Rust                              │

│                                   │

│ ├── Metadata Engine               │

│ ├── Lyrics Engine                 │

│ ├── Cache Manager                 │

│ ├── Settings Manager              │

│ └── Library Scanner               │

└───────────────────────────────────┘

```



\---



\# Project Structure



```text

lyriscope/



├── src/

│

│   ├── app/

│   │   ├── App.tsx

│   │   └── routes.ts

│

│   ├── components/

│   │   ├── player/

│   │   ├── lyrics/

│   │   ├── visualizer/

│   │   ├── sidebar/

│   │   └── common/

│

│   ├── pages/

│   │   ├── HomePage.tsx

│   │   ├── LibraryPage.tsx

│   │   └── SettingsPage.tsx

│

│   ├── hooks/

│   │   ├── usePlayer.ts

│   │   ├── useLyrics.ts

│   │   └── useTheme.ts

│

│   ├── services/

│   │   ├── audio.ts

│   │   ├── lyrics.ts

│   │   ├── metadata.ts

│   │   └── cache.ts

│

│   ├── state/

│   │   ├── playerStore.ts

│   │   ├── settingsStore.ts

│   │   └── libraryStore.ts

│

│   └── types/

│

└── src-tauri/

&#x20;   └── src/



&#x20;       ├── main.rs

&#x20;       ├── commands.rs



&#x20;       ├── metadata/

&#x20;       ├── lyrics/

&#x20;       ├── cache/

&#x20;       ├── settings/

&#x20;       └── library/

```



\---



\# Domain Models



\---



\## Song



```typescript

type Song = {

&#x20;   id: string;



&#x20;   title: string;

&#x20;   artist: string;



&#x20;   album?: string;

&#x20;   genre?: string;



&#x20;   duration: number;



&#x20;   filePath: string;



&#x20;   coverPath?: string;



&#x20;   addedAt: string;

};

```



\---



\## Lyrics



```typescript

type LyricLine = {

&#x20;   time: number;

&#x20;   text: string;

};



type Lyrics = {

&#x20;   synced: boolean;



&#x20;   source:

&#x20;       | "local"

&#x20;       | "lrclib"

&#x20;       | "manual";



&#x20;   lines: LyricLine\[];



&#x20;   offsetMs: number;

};

```



\---



\## Theme



```typescript

type Theme = {

&#x20;   id: string;



&#x20;   name: string;



&#x20;   accentColor: string;



&#x20;   background: {

&#x20;       type:

&#x20;           | "solid"

&#x20;           | "gradient"

&#x20;           | "album\_blur";



&#x20;       value: string;

&#x20;   };



&#x20;   visualizer: {

&#x20;       preset:

&#x20;           | "bars"

&#x20;           | "waveform"

&#x20;           | "aura";

&#x20;   };



&#x20;   lyrics: {

&#x20;       fontFamily: string;

&#x20;       fontSize: number;



&#x20;       glow: boolean;

&#x20;   };

};

```



\---



\# Frontend Modules



\---



\## Audio Player



Responsibilities:



\* Play/Pause

\* Seeking

\* Volume

\* Current time

\* Playback state



Uses:



```text

HTMLAudioElement

Web Audio API

```



The frontend owns audio playback.



The backend should never directly control rendering or playback state.



\---



\## Lyrics Module



Responsibilities:



\* Parse `.lrc`

\* Display synchronized lyrics

\* Highlight active lines

\* Apply offsets

\* Support future lyric editing



\---



\## Visualizer Module



Responsibilities:



\* Waveform rendering

\* Spectrum rendering

\* Aura rendering



Uses:



```text

Canvas 2D

Web Audio API

```



Future:



```text

WebGL

Shader-based effects

```



\---



\## Theme Module



Responsibilities:



\* Apply themes

\* Live previews

\* Import/export themes

\* Persist user preferences



\---



\# Backend Modules



\---



\## Metadata Engine



Responsibilities:



```text

Read:



MP3

FLAC

WAV

M4A

```



Extract:



```text

Title

Artist

Album

Duration

Album Art

Genre

```



Future:



```text

BPM

Energy

Mood

```



\---



\## Lyrics Engine



Responsibilities:



```text

Local LRC parsing

Online retrieval

Caching

Offset persistence

```



Future:



```text

AI alignment

Automatic synchronization

```



\---



\## Cache Manager



Responsibilities:



```text

Lyrics cache

Theme cache

Metadata cache

Recent songs

```



Storage format:



Version 1:



```text

JSON

```



Version 2:



```text

SQLite

```



\---



\## Library Scanner



Responsibilities:



```text

Directory scanning

Supported file detection

Metadata indexing

Duplicate detection

```



Supported extensions:



```text

mp3

flac

wav

m4a

ogg

```



\---



\# Communication Model



Frontend communicates with Rust exclusively through Tauri commands.



Example:



```typescript

await invoke(

&#x20;   "read\_song\_metadata",

&#x20;   {

&#x20;       path

&#x20;   }

);

```



No frontend module should directly access backend internals.



\---



\# State Management



Recommended approach:



```text

Zustand

```



Stores:



```text

PlayerStore

SettingsStore

LibraryStore

ThemeStore

```



Avoid:



```text

Redux

```



The project does not require that level of complexity.



\---



\# Persistence



\---



\## Version 1



```text

app-data/



settings.json



themes.json



recent.json



lyrics-cache/

```



Simple.



Easy to inspect.



Easy to debug.



\---



\## Version 2



Move to:



```text

SQLite

```



For:



\* Search

\* Library indexing

\* Smart recommendations

\* Future AI features



\---



\# Plugin Philosophy



The MVP does NOT support plugins.



However, future architecture should allow:



```text

lyrics providers

visualizer presets

themes

AI modules

```



through clearly defined interfaces.



\---



\# Future AI Architecture



AI systems must remain isolated.



Never mix AI code with core playback systems.



Preferred structure:



```text

src-tauri/



ai/



&#x20;   theme\_generation/



&#x20;   lyric\_alignment/



&#x20;   dj\_mode/

```



Each AI feature must be independently removable.



\---



\# Performance Principles



\---



\## Frontend



Target:



```text

60 FPS

```



Avoid:



\* Unnecessary re-renders

\* Heavy DOM trees

\* Large state updates



Prefer:



\* Canvas rendering

\* Memoization

\* Virtualization



\---



\## Backend



Target:



```text

Instant metadata loading

Fast cache access

Responsive file scanning

```



Use async operations whenever possible.



\---



\# Architectural Rules



Rule 1:



Frontend owns presentation.



\---



Rule 2:



Rust owns filesystem access.



\---



Rule 3:



Audio playback stays in the frontend.



\---



Rule 4:



AI systems remain isolated.



\---



Rule 5:



Themes must remain data-driven.



\---



Rule 6:



Lyrics providers must implement common interfaces.



\---



Rule 7:



Prefer simplicity over premature abstraction.



\---



\# Final Principle



The architecture exists to support immersive experiences, not technical complexity.



Whenever a decision increases complexity without improving the listening experience, choose the simpler solution.



