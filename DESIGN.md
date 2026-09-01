---
name: FitTrack Energetic Student System
colors:
  surface: '#f4fbf8'
  surface-dim: '#d4dcd9'
  surface-bright: '#f4fbf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef5f2'
  surface-container: '#e8efec'
  surface-container-high: '#e2eae7'
  surface-container-highest: '#dde4e1'
  on-surface: '#161d1b'
  on-surface-variant: '#3c4a46'
  inverse-surface: '#2b3230'
  inverse-on-surface: '#ebf2ef'
  outline: '#6b7a76'
  outline-variant: '#bacac5'
  surface-tint: '#006b5f'
  primary: '#006b5f'
  on-primary: '#ffffff'
  primary-container: '#2dd4bf'
  on-primary-container: '#00574d'
  inverse-primary: '#3cddc7'
  secondary: '#a93349'
  on-secondary: '#ffffff'
  secondary-container: '#fe7488'
  on-secondary-container: '#730425'
  tertiary: '#006d36'
  on-tertiary: '#ffffff'
  tertiary-container: '#41d77a'
  on-tertiary-container: '#00592a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#62fae3'
  primary-fixed-dim: '#3cddc7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#ffdadc'
  secondary-fixed-dim: '#ffb2b9'
  on-secondary-fixed: '#400010'
  on-secondary-fixed-variant: '#891933'
  tertiary-fixed: '#6dfe9c'
  tertiary-fixed-dim: '#4de082'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005227'
  background: '#f4fbf8'
  on-background: '#161d1b'
  surface-variant: '#dde4e1'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style

The design system is built for a student-centric demographic, prioritizing an **approachable, energetic, and encouraging** atmosphere. It avoids the intimidating aesthetics of professional bodybuilding or the sterile feel of clinical health apps. 

The visual style is **Modern/Corporate with a Soft Touch**, utilizing generous white space, rounded corners, and vibrant pops of color to maintain high engagement levels. The interface should feel light and responsive, motivating users through positive reinforcement and clear, legible data visualization.

## Colors

This design system utilizes a vibrant palette designed to stimulate activity without causing eye fatigue.

*   **Primary (Fresh Teal):** Used for main actions, active states, and primary branding elements. It signifies energy and health.
*   **Accent (Coral):** Reserved for motivational highlights, streak indicators, and "celebration" UI moments to provide a warm contrast to the teal.
*   **Success (Mint Green):** Applied to completed workout states and positive progress indicators.
*   **Warning (Soft Amber):** Used for rest day reminders or missed goal notifications.
*   **Neutrals:** A cool gray scale (Slate/Gray) provides the foundation. Backgrounds should use very light tints (`#F8FAFC`) to keep the UI feeling "airy."

## Typography

The typography strategy pairs **Plus Jakarta Sans** for headlines to provide a friendly, slightly rounded, and modern personality with **Inter** for body text to ensure maximum readability during workouts.

*   **Headlines:** Use Bold or ExtraBold weights to create a strong hierarchy.
*   **Body:** Keep to Regular weight for long-form content, using SemiBold sparingly for emphasis within paragraphs.
*   **Caps:** Labels and small metadata should use uppercase with slight letter spacing to differentiate from standard body text.

## Layout & Spacing

The design system employs an **8px linear scale** (with a 4px half-step for tight components). 

*   **Grid Model:** A fluid 4-column grid for mobile and a 12-column grid for tablet/desktop. 
*   **Margins:** Mobile layouts should maintain a 20px side margin to ensure content doesn't feel cramped against the screen edge.
*   **Section Spacing:** Use 32px (xl) to separate distinct content blocks (e.g., "Daily Goals" vs. "Recent Activity").

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** and **Subtle Ambient Shadows**. 

*   **Surface Level:** The main background is the lowest tier (Cool Gray 50).
*   **Content Level:** Cards and containers sit on a pure white surface (`#FFFFFF`).
*   **Shadows:** Use a single, very soft shadow for interactive cards: `0px 4px 20px rgba(15, 23, 42, 0.05)`. This creates a sense of "lift" without looking heavy.
*   **Borders:** Use 1px solid borders in a light gray (`#E2E8F0`) for non-elevated elements like input fields and list item separators.

## Shapes

The shape language is consistently soft to maintain the "approachable" brand pillar.

*   **Cards:** Use a generous 16px radius.
*   **Buttons:** Use a 12px radius for a modern, tactile feel.
*   **Badges/Chips:** Use an 8px radius to distinguish them from primary action buttons.
*   **Progress Bars:** Always use fully rounded ends (caps) to emphasize a "flow" state rather than a rigid bar.

## Components

### Buttons
*   **Primary:** Solid Fresh Teal background with White text. Height: 48px.
*   **Secondary:** White background with Fresh Teal 1px border and Teal text.
*   **Motivational:** Solid Coral background for high-energy actions (e.g., "Start Workout").

### Input Fields
*   **Style:** 1px Slate-200 border, 12px radius. 
*   **Focus State:** 2px Fresh Teal border with a soft teal outer glow.

### Cards & List Items
*   **Dashboard Cards:** White background, 16px radius, subtle shadow.
*   **List Items:** Transparent background with a 1px bottom border for separation within a card.

### Progress Bars
*   **Track:** Light Gray-100.
*   **Indicator:** Fresh Teal or Mint Green gradient. 
*   **Shape:** Height of 8px-12px with fully rounded end-caps.

### Cached Indicator
*   **Visual:** A small, 6px solid dot in Slate-300 or a subtle "cloud-check" outline icon (12px width).
*   **Placement:** Top right corner of cards or immediately following a label/title to indicate data is available offline.

### Navigation
*   **Bottom Tab Bar:** Blur effect (Glassmorphism) with 80% opacity white background. Active icons in Fresh Teal with a 2px stroke.
*   **Top Nav:** Minimalist, centered title in Plus Jakarta Sans SemiBold.