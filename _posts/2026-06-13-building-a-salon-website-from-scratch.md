---
layout: default
title: "From Empty Folder to Live Salon: Building Zen|Santiago"
date: 2026-06-13
category: Web
tags: [web-development, case-study, static-site, javascript, css, seo, cloudflare-pages, design, jamstack]
excerpt: My own salon, a blank folder, and a deadline. Here's the full build journey of building my beauty salon's website — the design system, the data-driven menu, the features that shipped, the ones I killed, and what I learned shipping a static site that has to convert real customers.
meta_description: "A developer and salon owner's case study of building Zen|Santiago Beauty — his own salon's website — from scratch: a vanilla static site on Cloudflare Pages with a data-driven menu, loyalty program, anniversary offers, cookie consent, and local SEO."
style: style-modern
---

<article class="blog-post style-modern">
  <div class="post-hero">
    <div class="hero-left">
      <h1 class="post-title">From Empty Folder to Live Salon: Building Zen|Santiago</h1>
      <p class="post-subtitle">A full build journey — design system, a menu that builds itself, and knowing when to cut a feature</p>

      <div class="post-meta">
        <time datetime="2026-06-13">June 13, 2026</time>
        <span class="reading-time">10 min read</span>
        <span class="difficulty">Intermediate</span>
        <div class="categories">
          <span class="category">Web</span>
          <span class="category">Design</span>
        </div>
      </div>
    </div>

    <div class="hero-right">
      <div class="table-of-contents">
        <div class="toc-header">
          <div class="toc-icon">📋</div>
          <h3>What's This About?</h3>
        </div>
        <div class="toc-items">
          <a href="#the-brief" class="toc-item">
            <div class="toc-number">01</div>
            <div class="toc-content">
              <span class="toc-title">The Brief</span>
              <span class="toc-desc">My own salon, a blank folder</span>
            </div>
          </a>
          <a href="#design-first" class="toc-item">
            <div class="toc-number">02</div>
            <div class="toc-content">
              <span class="toc-title">A Design System First</span>
              <span class="toc-desc">Six colors and a font</span>
            </div>
          </a>
          <a href="#menu-engine" class="toc-item">
            <div class="toc-number">03</div>
            <div class="toc-content">
              <span class="toc-title">The Menu That Builds Itself</span>
              <span class="toc-desc">JSON in, cards out</span>
            </div>
          </a>
          <a href="#features" class="toc-item">
            <div class="toc-number">04</div>
            <div class="toc-content">
              <span class="toc-title">Loyalty, Offers & the Link-in-Bio</span>
              <span class="toc-desc">The fun parts</span>
            </div>
          </a>
          <a href="#boring-stuff" class="toc-item">
            <div class="toc-number">05</div>
            <div class="toc-content">
              <span class="toc-title">The Boring, Critical Stuff</span>
              <span class="toc-desc">Consent, SEO, performance</span>
            </div>
          </a>
          <a href="#lessons" class="toc-item">
            <div class="toc-number">06</div>
            <div class="toc-content">
              <span class="toc-title">What I'd Tell Myself Starting Over</span>
              <span class="toc-desc">The lessons that stuck</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="post-content">
    <div class="content-intro">
      <p class="lead">Zen|Santiago Beauty is <strong>my</strong> salon in Santiago de los Caballeros, Dominican Republic. We had Instagram, a chair full of clients, and a Squarespace page we'd outgrown. What we needed was a fast, beautiful site that could actually <em>find</em> new customers and make booking effortless. So I built it myself. This is the story of taking my own business from an empty folder to a live site — what I reached for, what shipped, what I deleted, and the lessons that only show up when it's <em>your</em> business on the other end of the deploy button.</p>
    </div>

    <figure class="zen-figure">
      <img src="/images/zensantiago/home.webp" alt="Zen|Santiago Beauty homepage hero with a muted video loop and the tagline 'Donde tu belleza cobra vida'" loading="lazy">
      <figcaption>The homepage hero — a muted, looping video behind the brand promise, with a poster frame so it paints instantly.</figcaption>
    </figure>

    <section class="content-section" id="the-brief">
      <h2>The Brief</h2>
      <p>The constraints shaped everything. This is a small business in the DR: a lot of the audience is on mobile, on data, sometimes on older phones, and many of them are an older crowd that isn't going to fight with a clunky interface. The single most common question we get isn't about price — it's <em>"where are you?"</em> So the site had to be fast, obvious, and impossible to get lost in.</p>

      <p>I chose a deliberately boring stack: hand-written HTML, CSS, and vanilla JavaScript — no framework, no build step — deployed on <strong>Cloudflare Pages</strong> with clean URLs. No React, no bundler, nothing to <code>npm install</code> and nothing to go stale. For a brochure-and-booking site that needs to load in under a second on a phone in Santiago, the best framework is no framework. Every kilobyte on the page is one I put there on purpose.</p>

      <div class="callout callout-info">
        <strong>Why static?</strong> A salon site changes its menu maybe monthly and its hero video maybe never. Paying the complexity tax of a SPA to render content that's effectively frozen is a bad trade. Static files on a CDN are faster, cheaper, and far harder to break.
      </div>
    </section>

    <section class="content-section" id="design-first">
      <h2>A Design System First</h2>
      <p>Before a single section got built, I locked a palette and a typeface into CSS custom properties. Everything downstream — buttons, cards, accents, the whole vibe — references these and nothing else:</p>

      <ul>
        <li><strong>Bosque</strong> (a deep forest green) for trust and grounding</li>
        <li><strong>Oro</strong> (gold) for the calls-to-action and accents</li>
        <li><strong>Pergamino</strong> (warm cream) as the canvas</li>
        <li><strong>Rosa</strong> (soft pink) and a muted <strong>salvia</strong> green for warmth</li>
      </ul>

      <p>Pair that with Poppins, a centered-logo navbar that splits the menu three items left and three right, and you have a system. The payoff of doing this first is that every later decision becomes a lookup instead of a debate. When I decided weeks later that it needed to feel warmer, I wasn't picking new colors — I was nudging opacity on tokens that already existed.</p>

      <figure class="zen-figure">
        <img src="/images/zensantiago/nosotros.webp" alt="The 'Nuestro Espacio' photo gallery on the About page showing salon interior shots" loading="lazy">
        <figcaption>The "About" page leans on real photography — a clickable gallery of the actual space, which does more for trust than any stock image could.</figcaption>
      </figure>

      <p>The brand mark itself is built around a hibiscus and a palm frond, so that botanical, tropical-spa motif quietly threads through the whole site without ever shouting.</p>
    </section>

    <section class="content-section" id="menu-engine">
      <h2>The Menu That Builds Itself</h2>
      <p>This is the piece I'm proudest of. A salon menu is deceptively hard: dozens of services, prices that change by hair length, grouped by category, and the owner needs to update it without touching code. So I didn't hard-code a menu — I built a tiny rendering engine.</p>

      <p>All the services live in a single <code>services.json</code> file. Each item carries its name, description, duration, and either a flat price or a set of length tiers (corto, medio, largo, extra). A ~24&nbsp;KB vanilla-JS engine fetches that JSON and builds the entire page: category sections, cards, a live search box, a "filter by hair length" control that re-prices everything on the fly, and a contextual detail library that explains each treatment.</p>

      <figure class="zen-figure">
        <img src="/images/zensantiago/menu.webp" alt="The interactive services menu with category pills, a length filter, search, and price-by-length cards" loading="lazy">
        <figcaption>The menu renders entirely from JSON: searchable, filterable by category and hair length, with prices that update live.</figcaption>
      </figure>

      <div class="callout callout-info">
        <strong>The real win:</strong> updating a price or adding a service is a one-line edit to a single JSON file — something anyone at the salon can do, no deploy gymnastics, no risk of breaking layout, no developer in the loop for routine changes. The data and the presentation are cleanly separated — the same principle behind every CMS, just sized appropriately for a salon.
      </div>

      <p>That same data file later became the backbone for an "Ofertas" category, so the anniversary promotions could surface inside the menu <em>and</em> on their own page without duplicating a single price.</p>
    </section>

    <section class="content-section" id="features">
      <h2>Loyalty, Offers & the Link-in-Bio</h2>
      <p>With the foundation solid, the site grew three features that each solve a specific business problem.</p>

      <h3>Royalty — a loyalty program page</h3>
      <p>The salon runs a points-and-tiers loyalty program, so it needed a page that made the gemstone tiers — Jade, Larimar, Amatista, Ónix, Diamante — feel aspirational. This one took the most iterations. I first built a flashy, full-screen "scrollytelling" deck. Wearing my owner hat, I didn't love it. I tried a calm, Japanese-zen aesthetic. Closer, but not it. I landed on a version that simply matches the rest of the site, with a tidy interactive tier selector and custom gemstone emblems.</p>

      <figure class="zen-figure">
        <img src="/images/zensantiago/royalty.webp" alt="The Royalty loyalty page with gemstone tier pills and an emblem for the Jade tier" loading="lazy">
        <figcaption>Royalty, after several rewrites: on-brand, with a clickable gemstone tier selector and hand-cut emblems.</figcaption>
      </figure>

      <h3>Anniversary offers</h3>
      <p>For the salon's first anniversary, I built an offers page from a printed flyer: a grid of promo cards with the real product photography, clickable cards that open a detail modal, and a celebratory photo behind it all. There's also an entry popup announcing the promo — with a date check baked in so it <em>stops showing itself automatically</em> after the promotion ends. No one wants to advertise an expired sale in July.</p>

      <figure class="zen-figure">
        <img src="/images/zensantiago/ofertas.webp" alt="The anniversary offers grid with six promo cards, product cutouts, and prices" loading="lazy">
        <figcaption>The anniversary offers: six combos with cut-out product shots, clickable for full details, over a celebration backdrop.</figcaption>
      </figure>

      <figure class="zen-figure">
        <img src="/images/zensantiago/popup.webp" alt="An entry popup announcing the first-anniversary promotions" loading="lazy">
        <figcaption>The entry popup that greets visitors with the promo — and quietly retires itself once the dates pass.</figcaption>
      </figure>

      <h3>The link-in-bio hub</h3>
      <p>Most of this salon's traffic comes from an Instagram bio link. A normal homepage is the wrong landing page for that — those visitors have one of three intents: <em>where are you, let me book, show me more.</em> So I built a dedicated, mobile-first <code>/reservar</code> hub that works like a guided three-step flow: <strong>how to get here</strong> (the #1 question, so it's step one) with a photo strip of the space, <strong>book</strong> via Fresha or a WhatsApp form, and <strong>explore</strong> the rest.</p>

      <figure class="zen-figure zen-figure--phone">
        <img src="/images/zensantiago/hub.webp" alt="The mobile link-in-bio hub at /reservar with a three-step flow and salon photos" loading="lazy">
        <figcaption>The Instagram link-in-bio hub: a focused, mobile-first flow that answers "where are you?" first.</figcaption>
      </figure>
    </section>

    <section class="content-section" id="boring-stuff">
      <h2>The Boring, Critical Stuff</h2>
      <p>The features get the screenshots, but the unglamorous work is what makes a site real.</p>

      <p><strong>Cookie consent done right.</strong> The site uses Google Analytics, which means cookies, which means consent. Rather than a fake "we use cookies" bar, I wired up <strong>Google Consent Mode v2</strong>: analytics is blocked by default and only activates after the visitor accepts. The choice is remembered, and the privacy policy was rewritten to actually describe what's collected. Doing this honestly is both the right call and increasingly a legal one.</p>

      <p><strong>Local SEO.</strong> For a local business, ranking is mostly about Google Business Profile and reviews — but the on-page work still matters: unique titles and descriptions per page, one keyword-bearing H1 each, <code>HairSalon</code> structured data with the legal name and tax ID, an <code>OfferCatalog</code> schema for the promotions (with real prices and expiry dates), geo meta tags, a sitemap with <code>lastmod</code>, and clean canonical URLs.</p>

      <p><strong>Performance.</strong> Every image is WebP. The hero videos got a poster frame so the page paints before the video loads, and the section video was re-encoded from 3.9&nbsp;MB down to 2.6. Cache headers tell returning visitors not to re-download anything. The Instagram feed pulls from a cookieless provider so it doesn't even touch the consent flow.</p>

      <div class="callout callout-info">
        <strong>A small bug that taught a big lesson:</strong> the stylesheet was cached for a week but its cache-busting version string hadn't changed in dozens of edits — so returning visitors were being served week-old CSS. Aggressive caching is only your friend if you remember to bust it. Now the version bumps whenever the styles change.
      </div>
    </section>

    <section class="content-section" id="lessons">
      <h2>What I'd Tell Myself Starting Over</h2>
      <p>A few things only became obvious in the building.</p>

      <p><strong>Separate data from presentation early, even when it feels like overkill.</strong> The <code>services.json</code> approach felt like a lot of ceremony for a salon menu. It paid for itself ten times over — every price change, every new offer, every reuse of that data somewhere else was a one-line edit instead of a layout surgery.</p>

      <p><strong>Know when to kill a feature.</strong> I built decorative floral frames, layered hibiscus watermarks, a full-screen scrolly Royalty deck, an immersive zen redesign — and deleted most of them. Some of my favorite work didn't survive contact with what the business actually needed — and being both the builder and the owner, I got to be brutal about cutting it. The site is better for what's <em>not</em> in it. Restraint is a feature.</p>

      <p><strong>Auto-cutouts have limits.</strong> A surprising amount of time went into removing backgrounds from product photos. A red shampoo bottle on white cuts cleanly; a <em>white</em> bottle on white is basically impossible to automate well. Knowing where the easy path ends — and asking for a proper transparent PNG instead of fighting it — saves hours.</p>

      <p><strong>The boring stuff is the product.</strong> Consent, caching, schema, alt text, a poster frame on a video — none of it screenshots well, but it's the difference between a pretty page and a site a real business can run on.</p>

      <div class="callout callout-info">
        <strong>The takeaway:</strong> a static site, built deliberately, with the data separated from the design and the boring fundamentals taken seriously, will outperform a heavier build for a business like this — and stay maintainable long after launch. Sometimes the most modern choice is the simplest one.
      </div>

      <p>Zen|Santiago is live at <a href="https://zensantiago.com" target="_blank" rel="noopener noreferrer">zensantiago.com</a>. The hardest part was never the code — it was the hundred small judgment calls about what belonged and what didn't.</p>
    </section>
  </div>
</article>

<style>
  .zen-figure {
    margin: 2.5rem 0;
    text-align: center;
  }
  .zen-figure img {
    width: 100%;
    height: auto;
    border-radius: 14px;
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.18);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }
  .zen-figure figcaption {
    margin-top: 0.8rem;
    font-size: 0.85rem;
    opacity: 0.7;
    font-style: italic;
  }
  .zen-figure--phone img {
    max-width: 300px;
  }
</style>
