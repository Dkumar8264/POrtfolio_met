# Midnight Metro Portfolio — Design System

## Intent

An immersive, dark, interactive portfolio built around a midnight metro journey. The design uses a cinematic 3D scene as the hero while keeping content, navigation, and accessibility straightforward.

## Design dials

- Variance: 7/10 — modern and intentionally asymmetric.
- Motion: 8/10 — spatial continuity and scroll choreography, never motion for its own sake.
- Density: 3/10 — spacious, presentation-led compositions.

## Tokens

| Purpose | Value |
| --- | --- |
| Background | `#0F172A` |
| Surface | `#111827` |
| Foreground | `#F8FAFC` |
| Muted text | `#CBD5E1` |
| Border | `#334155` |
| Accent | `#EA580C` |
| Heading | Archivo |
| Body | Space Grotesk |

## Interaction rules

- Use a single primary CTA per view and keep it readable at a 4.5:1 contrast ratio.
- Provide keyboard controls and a visible focus indicator for every interactive element.
- Respect `prefers-reduced-motion`: pause or simplify continuous motion and make the 3D hero static.
- Keep touch targets at least 44 by 44 pixels.
- Use animation to show hierarchy: one focal interaction at a time.

## Narrative

Arrival → Project carriages → Skills map → Personal compartment → Contact platform.
