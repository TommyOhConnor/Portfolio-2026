# Motion & Interactivity Options for Portfolio Panels

## Options Ranked by Quality

### 1. Video Loop — Best Overall for UI Demos
Export MP4 (H.264/H.265) and/or WebM (VP9/AV1). Browsers handle both natively.

```html
<video autoplay loop muted playsinline>
  <source src="demo.webm" type="video/webm">
  <source src="demo.mp4" type="video/mp4">
</video>
```

**Pros**
- Crisp at any resolution
- 5–10x smaller than GIF
- True colour, alpha channel (WebM/VP9)

**Cons**
- No interactivity
- Need to handle autoplay policies

**Best for:** Screen recordings, UI demos, anything with gradients or photos

---

### 2. Rive — Best for Designed Interactions ⭐ Recommended
Already wired up in the project. Visitors can actually interact with the UI you designed.

**Interaction types possible:**
- Hover states — components that respond to mouse over
- Click/tap — buttons that animate, toggles that switch state
- Drag — sliders, knobs, scrubable elements
- Scroll-driven — animation progress tied to scroll position
- Cursor tracking — elements that follow or react to mouse position

**Pros**
- Tiny file size
- Vector-sharp at any DPI
- Full interactivity
- Infrastructure already built (local WASM, WebGL2, `dispatchPointerExit`, artboard sizing)

**Cons**
- Requires authoring in the Rive editor
- Time investment to build interactive prototypes

**Best for:** Letting visitors actually interact with the UI you designed — a strong portfolio differentiator

---

### 3. Lottie — Good for Decorative Animation
JSON-based format exported from After Effects via Bodymovin.

**Pros**
- Vector-based
- Reasonably small files
- Well-supported (`@lottiefiles/lottie-player`)

**Cons**
- No interactivity
- File sizes balloon with complex scenes
- No longer state-of-the-art

**Best for:** Looping decorative illustrations

---

### 4. CSS/JS Animation on Static Images — Subtle Motion, Zero Assets
Parallax, fade-in on scroll, image sequences driven by `IntersectionObserver`.

**Pros**
- No extra assets or runtime dependencies
- Works with existing images

**Best for:** Adding life to stills without new exports

---

### 5. Animated AVIF/WebP — Modern GIF Replacement
True colour, alpha, much smaller than GIF. Works like a regular `<img>` tag.

**Cons**
- Limited authoring tooling
- Not controllable (no pause/play)

---

## Recommendation for This Portfolio

| Goal | Best Option |
|---|---|
| Screen recordings of real UI | Video loop (MP4 + WebM) |
| Interactive component demos | Rive |
| Decorative looping illustration | Lottie or Animated AVIF |
| Subtle motion on existing stills | CSS/JS (`IntersectionObserver`) |
| Avoid at all costs | GIF |

---

## How Rive Would Work in the Codebase

Add a `rive` type to `CaseStudyGalleryItem` in `src/data/projects.ts`:

```typescript
export type CaseStudyGalleryRive = {
  src: string;           // path to the .riv file under public/assets/
  caption: string;
  stateMachines?: string;
  width?: number;
  height?: number;
};
```

Then in `src/render/detail.ts`, render a `<canvas>` for this type and reuse the existing Rive setup from `src/rive/name-reveal.ts` — local WASM, WebGL2, `dispatchPointerExit`, and artboard-proportional sizing are all already solved.

The main investment is authoring interactive prototypes of your case study UIs in the Rive editor. Very few portfolios let visitors touch the work — it's a strong differentiator.
