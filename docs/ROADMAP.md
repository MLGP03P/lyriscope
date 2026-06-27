\# ROADMAP.md



\# Lyriscope Development Roadmap



\*\*Current Version:\*\* 0.1.0

\*\*Status:\*\* Pre-development



\---



\# Development Philosophy



The roadmap prioritizes:



\* Small, complete milestones.

\* Working software over experimental features.

\* Maintainable architecture.

\* Offline-first functionality.

\* Incremental complexity.



Every milestone must produce a usable application state.



No future feature should block current progress.



\---



\# Phase 0 - Foundation



\*\*Goal: Establish the technical base.\*\*



\---



\## Tasks



\### Repository Setup



\* Initialize Git repository.

\* Create `/docs` directory.

\* Add:



```text id="sj01go"

PROJECT\_BRIEF.md

DESIGN.md

ARCHITECTURE.md

ROADMAP.md

AI\_AGENT.md

```



\---



\### Development Environment



Set up:



```text id="ynzfdw"

Tauri

React

TypeScript

Vite

Rust

```



\---



\### Project Structure



Create:



```text id="zzjlwm"

src/

src-tauri/

docs/

assets/

```



\---



\### Tooling



Configure:



```text id="x7z8de"

ESLint

Prettier

TypeScript strict mode

Rustfmt

Clippy

```



\---



\## Exit Criteria



The application launches successfully on desktop.



No features required.



\---



\# Phase 1 - Audio Player MVP



\*\*Goal: Local audio playback.\*\*



\---



\## Features



\### Supported Formats



```text id="ogkhvf"

mp3

flac

wav

m4a

ogg

```



\---



\### Controls



Implement:



```text id="fd8n7u"

Play

Pause

Seek

Volume

Current Time

Duration

```



\---



\### Drag \& Drop



Users can:



\* Drag files into the application.

\* Automatically start playback.



\---



\### Recent Files



Store:



```text id="ey49w5"

Last opened songs

```



\---



\## Exit Criteria



Users can comfortably play local music.



No lyrics required yet.



\---



\# Phase 2 - Synced Lyrics



\*\*Goal: First complete experience.\*\*



\---



\## Local LRC Support



Implement:



```text id="l7ec2o"

LRC parser

Timestamp handling

Line highlighting

Offset support

```



\---



\## Lyrics Display



Features:



```text id="zz2f0g"

Current line emphasis

Previous lines

Upcoming lines

Smooth transitions

```



\---



\## Offset Editor



Allow:



```text id="ny3g08"

+100ms

\-100ms

+500ms

\-500ms

Reset

```



\---



\## Persistence



Save:



```text id="v0snp1"

Song ID

Offset value

```



\---



\## Exit Criteria



Users can load songs and enjoy synchronized lyrics.



This is the first major milestone.



\---



\# Phase 3 - Metadata \& Library



\*\*Goal: Understand music files.\*\*



\---



\## Metadata Extraction



Read:



```text id="pv1n3v"

Title

Artist

Album

Genre

Duration

Album Art

```



\---



\## Folder Scanning



Users can:



\* Add folders.

\* Scan recursively.

\* Build local libraries.



\---



\## Search



Implement:



```text id="92hks5"

Search by title

Search by artist

Search by album

```



\---



\## Sorting



Support:



```text id="jknxkt"

Recently played

Alphabetical

Artist

Duration

```



\---



\## Exit Criteria



The application behaves like a proper local music library.



\---



\# Phase 4 - Online Lyrics



\*\*Goal: Automatic retrieval.\*\*



\---



\## Provider Integration



Version 1:



```text id="k26nro"

LRCLIB

```



\---



\## Search Strategy



Pipeline:



```text id="yvfwn2"

Check local LRC

↓



Check cache

↓



Search online

↓



Store result

```



\---



\## Cache



Save:



```text id="s7vlnw"

Lyrics

Metadata

Provider source

```



\---



\## Failure Handling



Gracefully support:



```text id="d9p7wk"

No lyrics found

Multiple matches

Invalid timestamps

```



\---



\## Exit Criteria



Most popular songs work without manual imports.



\---



\# Phase 5 - Visualizers



\*\*Goal: Build immersion.\*\*



\---



\## Preset 1: Waveform



Features:



```text id="v0w3ya"

Smooth motion

Minimal appearance

Low CPU usage

```



\---



\## Preset 2: Spectrum



Features:



```text id="rjlwm6"

Frequency bars

Rounded corners

Glow effects

```



\---



\## Preset 3: Aura



Features:



```text id="dnhq0i"

Bass-reactive glow

Centered around lyrics

Soft movement

```



\---



\## Performance Targets



Maintain:



```text id="e3wx0f"

60 FPS

```



\---



\## Exit Criteria



Users can select visual styles.



\---



\# Phase 6 - Theme System



\*\*Goal: Personalization.\*\*



\---



\## Theme Engine



Themes define:



```text id="5r9cnv"

Colors

Fonts

Backgrounds

Visualizers

Animations

```



\---



\## Built-in Themes



Version 1:



```text id="0n76h6"

Default Dark

Night Drive

Neon Purple

Album Blur

Minimal White

```



\---



\## Theme Persistence



Store:



```text id="ghm79g"

Active theme

Custom themes

Theme preferences

```



\---



\## Import / Export



Support:



```text id="jlwm0w"

JSON themes

```



\---



\## Exit Criteria



Users can personalize their experience.



\---



\# Phase 7 - Lyrics Editor



\*\*Goal: Manual synchronization tools.\*\*



\---



\## Plain Text Import



Users provide:



```text id="98l4wr"

Song

Lyrics text

```



\---



\## Tap Synchronization



Controls:



```text id="kr9vba"

Space = current timestamp

Backspace = previous line

Arrow keys = adjustments

```



\---



\## Export



Generate:



```text id="xl3zy3"

.lrc files

```



\---



\## Exit Criteria



Users can create their own synced lyrics.



\---



\# Phase 8 - Polish \& Release



\*\*Goal: Public quality.\*\*



\---



\## Performance



Targets:



```text id="42zw5i"

Instant startup

Smooth animations

Low memory usage

```



\---



\## UX Improvements



Implement:



```text id="g90t6x"

Keyboard shortcuts

Fullscreen mode

Mini-player mode

Smooth transitions

```



\---



\## Packaging



Create:



```text id="9p0i6r"

Windows installer

Linux packages

```



\---



\## Documentation



Finalize:



```text id="u7vlk5"

README

Screenshots

Demo videos

Contribution guide

```



\---



\## Exit Criteria



Version 1.0 release candidate.



\---



\# Post-MVP Roadmap



\---



\# Version 2.0 - Intelligent Themes



Goals:



```text id="s02ztf"

Automatic color extraction

Mood detection

Album-driven themes

AI-generated presets

```



\---



\# Version 3.0 - AI Lyrics



Goals:



```text id="h2ttse"

Plain text alignment

Automatic timestamps

Local processing

Manual corrections

```



\---



\# Version 4.0 - Smart DJ



Goals:



```text id="3m4dhk"

Energy matching

Smart queues

Crossfades

Listening modes

```



Examples:



```text id="v7b5xv"

Chill

Study

Night Drive

Workout

```



\---



\# Version 5.0 - Voice DJ



Possible features:



```text id="obg53r"

AI commentary

Text-to-speech

Song introductions

Personalized sessions

```



This phase is entirely optional.



\---



\# Rules For Future Development



\---



\## Rule 1



Never begin a new phase before completing the current one.



\---



\## Rule 2



A working feature is more valuable than three experimental ones.



\---



\## Rule 3



Do not implement AI features before the core experience feels polished.



\---



\## Rule 4



Maintain offline functionality whenever possible.



\---



\## Rule 5



Preserve simplicity.



Future ambitions must not damage the quality of the MVP.



\---



\# Definition of Success



The project succeeds when a user can:



\* Open a song.

\* See synchronized lyrics.

\* Enter fullscreen mode.

\* Enjoy reactive visuals.

\* Feel that the song has its own atmosphere.



Everything beyond that is a bonus.



