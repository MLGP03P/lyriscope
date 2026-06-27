\# DESIGN.md



\# Lyriscope - Design Document



\## Vision



Lyriscope is a desktop music experience focused on synchronized lyrics, audio visualization, and immersion.



The application is not intended to be a traditional music player.



The goal is to create a cinematic environment where each song becomes a visual experience.



The lyrics are the main content.



The music drives the visuals.



The player controls stay out of the way.



\---



\# Design Pillars



\## 1. Lyrics First



Lyrics are always the primary focus.



Users should be able to comfortably read lyrics from across the room.



The currently active lyric line must be immediately recognizable.



\### Active line



\* Largest text on screen

\* Full opacity

\* Optional glow effect

\* Smooth transitions



\### Inactive lines



\* Reduced opacity

\* Smaller font size

\* Slight blur or fade



\---



\## 2. Music Reactive



Nothing on screen should feel static.



Visual elements react to:



\* Volume

\* Frequency spectrum

\* Beat intensity

\* Playback progress



Reactivity should feel organic.



Avoid excessive flashing or aggressive effects.



\---



\## 3. Minimal Interface



The user should mostly see:



\* Background

\* Visualizer

\* Lyrics



UI chrome must remain subtle.



Controls should appear only when needed.



\---



\## 4. Theme Driven



Every song should be able to have its own visual identity.



Themes control:



\* Colors

\* Backgrounds

\* Fonts

\* Visualizer style

\* Animation intensity



The entire application should be customizable.



\---



\# Visual Style



\## Primary Mood



Modern



Minimal



Cinematic



Premium



Dark



Immersive



\---



\## Avoid



\* RGB gaming aesthetics

\* Heavy skeuomorphism

\* Busy interfaces

\* Sharp visual noise

\* Excessive particle effects



\---



\# Main Layout



```

+------------------------------------------------------+

|                                                      |

|                                                      |

|                                                      |

|                 VISUALIZER AREA                      |

|                                                      |

|                                                      |

|                                                      |

|                                                      |

|                                                      |

+------------------------------------------------------+

|                    PLAYER BAR                        |

+------------------------------------------------------+

```



Within the visualizer area:



```

&#x20;                Song Title



&#x20;               Artist Name





&#x20;            Previous lyric line





&#x20;        CURRENT LYRIC LINE





&#x20;             Next lyric line

```



\---



\# Background System



\## Album Blur



Default mode.



Workflow:



Album Cover

→ Scale to fullscreen

→ Apply blur

→ Darken

→ Add gradient overlay



Result:



Readable lyrics with strong visual identity.



\---



\## Dynamic Gradient



Generated from dominant album colors.



Example:



Purple

Blue

Pink



Animated slowly.



No sudden color shifts.



\---



\## Ambient Particles



Optional.



Small floating particles that react to music energy.



Particles should support:



\* Density control

\* Opacity control

\* Color control



\---



\# Lyrics Presentation



\## Alignment



Default:



Centered horizontally



Centered vertically



\---



\## Font Size



Active line:



48px - 72px



Inactive line:



28px - 40px



\---



\## Line Transition



When changing lyrics:



Current line:



\* Moves upward

\* Fades slightly



New line:



\* Slides into position

\* Fades in



Target animation duration:



200ms - 400ms



\---



\# Visualizer Modes



\## Bars



Modern frequency bars.



Rounded corners.



Soft glow.



\---



\## Waveform



Continuous waveform.



Smooth movement.



Minimal appearance.



\---



\## Aura



Recommended default mode.



A glowing aura behind lyrics.



Aura intensity reacts to:



\* Bass

\* Kick

\* Overall energy



\---



\# Sidebar



Collapsed by default.



Expanded on hover or shortcut.



Contains:



\* Library

\* Themes

\* Visualizers

\* Lyrics

\* Settings



The sidebar should never dominate the screen.



\---



\# Theme System



Theme object:



```json

{

&#x20; "name": "Night Drive",

&#x20; "accentColor": "#7B2CFF",

&#x20; "background": "album\_blur",

&#x20; "visualizer": "aura",

&#x20; "glow": true,

&#x20; "particleDensity": 0.3

}

```



\---



\# Fullscreen Experience



Fullscreen mode is considered a first-class feature.



Goals:



\* Read lyrics from distance

\* Use on secondary monitor

\* Use during listening sessions

\* Use as ambient display



Controls should automatically fade away after inactivity.



\---



\# Accessibility



Users must be able to:



\* Increase font size

\* Disable animations

\* Disable particles

\* Increase contrast

\* Change lyric position



The application should remain usable on low-end hardware.



\---



\# Future Design Goals



\## AI Theme Generation



Generate themes based on:



\* Album artwork

\* Genre

\* BPM

\* Mood

\* Lyrics sentiment



\---



\## Smart Visual Presets



Automatically switch visualizers depending on:



\* Energy level

\* Song section

\* User preferences



\---



\## DJ Mode



Special visual mode for continuous playback.



Features:



\* Queue visualization

\* Upcoming tracks

\* Smooth visual transitions



\---



\# Final Principle



Every song should feel like it has its own stage.



The user is not watching a music player.



The user is watching the song itself.



