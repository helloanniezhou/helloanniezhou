# Portfolio Design System

This document defines the visual and content rules for the portfolio so new pages stay consistent.

## Brand Direction

- Tone: editorial, calm, strategic, human
- Visual style: clean and minimal with strong typography
- Personality: thoughtful product/design leadership, outcomes focused

## Theme Tokens

Use semantic tokens from `:root` in `src/App.css`. Avoid one-off color values.

- `--surface`: app/page background
- `--surface-card`: primary card background
- `--surface-soft`: muted section background
- `--text-main`: primary text color
- `--text-muted`: secondary text color
- `--line`: borders/dividers
- `--accent`: links/highlights/important keywords
- `--accent-soft`: subtle active/hover backgrounds

Legacy aliases retained for compatibility:

- `--light-grey`, `--text-color`, `--purple`

## Spacing Scale

Use spacing tokens for layout rhythm:

- `--space-1` = 8px
- `--space-2` = 16px
- `--space-3` = 24px
- `--space-4` = 32px
- `--space-5` = 48px
- `--space-6` = 64px

Guidelines:

- Major sections: `--space-4` to `--space-6`
- Internal card spacing: `--space-2` to `--space-3`
- Keep a consistent vertical rhythm between sections

## Radius Scale

- `--radius-sm` = 12px
- `--radius-md` = 20px
- `--radius-lg` = 28px
- `--radius-pill` = 999px

## Typography

- Body/UI default: `Inter`
- Display/editorial headings: `Instrument Sans`

Type tokens:

- `--text-xs` = 12px
- `--text-sm` = 14px
- `--text-md` = 18px
- `--text-lg` = 22px
- `--text-xl` = 30px

Guidelines:

- Keep hierarchy with size + weight first
- Use accent color selectively, not as a primary body color
- Keep body copy readable and concise

## Component Patterns

- Navigation: pill tabs with subtle active state
- Project card: image, title, concise description
- Meta card: role/team/impact summary block
- Section block: heading + narrative body
- Impact panel: metric cards with short labels + evidence

All new case-study pages should be composed from reusable blocks in:

- `src/components/project/`

## Motion

- Route transition: subtle fade/slide only
- Hover effects: minimal lift for interactive cards
- No decorative animation without UX purpose

## Content Rules

Case-study structure:

1. Hero (title, year)
2. Overview
3. Challenge/Opportunity
4. Strategy + decisions
5. Execution visuals
6. Impact and outcomes

Writing style:

- Lead with outcomes
- Keep claims specific
- Include metrics when available

## Implementation Guardrails

- No inline styles
- Prefer tokens over raw values
- Do not use hex color literals
- Reuse existing components before adding new ones
