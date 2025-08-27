---
layout: default
title: Do We Really Need REQs in ServiceNow?
date: 2024-12-19
category: ServiceNow
tags: [servicenow, req, ritm, task, best-practices, architecture, request-management, servicenow-admin]
excerpt: A deep dive into whether ServiceNow Requests (REQs) are always necessary, exploring the pros and cons of skipping them and when it might actually work.
meta_description: "Discover why ServiceNow REQs are crucial for proper request management, with real-world examples and best practices for avoiding common pitfalls."
style: style-modern
---

<article class="blog-post style-modern">
  <div class="post-hero">
    <div class="hero-left">
      <h1 class="post-title">Do We Really Need REQs in ServiceNow?</h1>
      <p class="post-subtitle">Exploring when skipping Requests might work and when it definitely doesn't</p>
      
      <div class="post-meta">
        <time datetime="2024-12-19">December 19, 2024</time>
        <span class="reading-time">10 min read</span>
        <span class="difficulty">Beginner</span>
        <div class="categories">
          <span class="category">ServiceNow</span>
          <span class="category">Best Practices</span>
        </div>
      </div>
    </div>
    
    <div class="hero-right">
      <div class="table-of-contents">
        <h3>Table of Contents</h3>
        <ul>
          <li><a href="#refresher">Quick Refresher</a></li>
          <li><a href="#client-setup">The Client Setup</a></li>
          <li><a href="#pros-cons">Pros & Cons Analysis</a></li>
          <li><a href="#edge-cases">Edge Cases & Considerations</a></li>
          <li><a href="#takeaway">My Takeaway</a></li>
        </ul>
      </div>
    </div>
  </div>

  <div class="post-content">
    <div class="content-intro">
      <p class="lead">This one's a bit of a debate, and I'm just letting the words flow. I once worked with a client who decided to skip REQs altogether. They went straight from catalog items into RITMs and Tasks, with no REQs in sight. They built their entire instance this way. At the time, I didn't fully question it, but looking back I'm still baffled. So let's play devil's advocate: is there ever a case where a REQ just isn't necessary?</p>
    </div>

    <section class="content-section" id="refresher">
      <h2>Quick Refresher: REQ vs RITM vs Task</h2>
      <p>For the newcomers:</p>
      
      <p>Let's talk about what makes up a Request in ServiceNow.</p>
      
      <div class="hierarchy-visual">
        <div class="req-card">
          <div class="card-content">
            <div class="card-title">Request (REQ)</div>
            <div class="card-number">#REQ0012345</div>
            <div class="card-desc">The best way I was taught to visualize this is to think about it as your Amazon receipt. The REQ is the order number.</div>
          </div>
        </div>

        <div class="hierarchy-arrow">↓</div>

        <div class="ritm-container">
          <div class="ritm-card">
            <div class="card-content">
              <div class="card-title">Requested Item (RITM)</div>
              <div class="card-number">#RITM0001</div>
              <div class="card-desc">Laptop, the specific item ordered</div>
            </div>
          </div>

          <div class="ritm-card">
            <div class="card-content">
              <div class="card-title">Requested Item (RITM)</div>
              <div class="card-number">#RITM0002</div>
              <div class="card-desc">Monitor, the specific item ordered</div>
            </div>
          </div>
        </div>

        <div class="hierarchy-arrow">↓</div>

        <div class="task-container">
          <div class="task-card">
            <div class="card-content">
              <div class="card-title">Task</div>
              <div class="card-number">#TASK0001</div>
              <div class="card-desc">Procurement, order the hardware</div>
            </div>
          </div>

          <div class="task-card">
            <div class="card-content">
              <div class="card-title">Task</div>
              <div class="card-number">#TASK0002</div>
              <div class="card-desc">Setup, configure the equipment</div>
            </div>
          </div>

          <div class="task-card">
            <div class="card-content">
              <div class="card-title">Task</div>
              <div class="card-number">#TASK0003</div>
              <div class="card-desc">Delivery, deliver to user</div>
            </div>
          </div>
        </div>
      </div>

      <p>Normally, it's a clean hierarchy: one REQ, multiple RITMs under it, and then Tasks under each RITM.</p>

      <style>
        .hierarchy-visual {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background: var(--bg-2);
          border-radius: 8px;
          border: 1px solid var(--primary);
        }

        .req-card {
          background: var(--bg);
          border: 2px solid var(--snow-accent);
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
          margin-bottom: 0.75rem;
        }

        .ritm-container {
          display: flex;
          gap: 0.75rem;
          margin: 0.75rem 0;
          flex-wrap: wrap;
        }

        .ritm-card {
          background: var(--bg);
          border: 2px solid var(--pink);
          border-radius: 8px;
          padding: 0.75rem;
          box-shadow: 0 2px 8px rgba(246, 168, 200, 0.1);
          flex: 1;
          min-width: 200px;
        }

        .task-container {
          display: flex;
          gap: 0.75rem;
          margin: 0.75rem 0;
          flex-wrap: wrap;
        }

        .task-card {
          background: var(--bg);
          border: 2px solid var(--mint);
          border-radius: 8px;
          padding: 0.75rem;
          box-shadow: 0 2px 8px rgba(191, 234, 216, 0.1);
          flex: 1;
          min-width: 160px;
        }

        .card-content {
          width: 100%;
        }

        .card-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0.25rem;
        }

        .card-number {
          font-size: 0.75rem;
          color: var(--muted);
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .card-desc {
          font-size: 0.8rem;
          color: var(--text);
          line-height: 1.3;
        }

        .hierarchy-arrow {
          text-align: center;
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--snow-accent);
          margin: 0.5rem 0;
        }

        @media (max-width: 768px) {
          .ritm-container, .task-container {
            flex-direction: column;
          }
          
          .ritm-card, .task-card {
            min-width: auto;
          }
        }

        .resources-grid {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .resource-card {
          background: var(--bg);
          border: 1px solid var(--primary);
          border-radius: 8px;
          padding: 1rem;
          flex: 1;
          min-width: 200px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .resource-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 115, 85, 0.15);
        }

        .resource-card h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
        }

        .resource-card p {
          margin: 0 0 0.75rem 0;
          font-size: 0.85rem;
          line-height: 1.4;
          color: var(--text);
        }

        .resource-link {
          display: inline-block;
          color: var(--snow-accent);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          transition: color 0.2s ease;
        }

        .resource-link:hover {
          color: #7a6347;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .resources-grid {
            flex-direction: column;
          }
          
          .resource-card {
            min-width: auto;
          }
        }

        .pros-cons-table {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 2rem 0;
        }

        .pros-section, .cons-section {
          background: var(--bg);
          border: 1px solid var(--primary);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .pros-section {
          border-left: 4px solid var(--mint);
        }

        .cons-section {
          border-left: 4px solid var(--pink);
        }

        .pros-section h3, .cons-section h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text);
        }

        .pros-list, .cons-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .pro-item, .con-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .pro-icon {
          color: var(--mint);
          font-weight: bold;
          font-size: 1.1rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .con-icon {
          color: var(--pink);
          font-weight: bold;
          font-size: 1.1rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .pro-content h4, .con-content h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
        }

        .pro-content p, .con-content p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text);
        }

        @media (max-width: 768px) {
          .pros-cons-table {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        .table-of-contents {
          background: var(--bg-2);
          border: 1px solid var(--primary);
          border-radius: 8px;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .table-of-contents h2 {
          margin: 0 0 1rem 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text);
        }

        .table-of-contents ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .table-of-contents li {
          margin-bottom: 0.5rem;
        }

        .table-of-contents a {
          color: var(--snow-accent);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .table-of-contents a:hover {
          color: #7a6347;
          text-decoration: underline;
        }

        .post-hero {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
          align-items: start;
        }

        .hero-left {
          text-align: left;
        }

        .hero-right {
          position: sticky;
          top: 2rem;
        }

        .post-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 1rem 0;
          line-height: 1.2;
        }

        .post-subtitle {
          font-size: 1.2rem;
          color: var(--muted);
          margin: 0 0 2rem 0;
          line-height: 1.5;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          font-size: 0.9rem;
          color: var(--muted);
        }

        .post-meta time {
          font-weight: 500;
        }

        .reading-time, .difficulty {
          background: var(--primary);
          color: var(--primary-ink);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .categories {
          display: flex;
          gap: 0.5rem;
        }

        .category {
          background: var(--pink);
          color: var(--primary-ink);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
        }

        .table-of-contents {
          background: var(--bg-2);
          border: 1px solid var(--primary);
          border-radius: 8px;
          padding: 1.5rem;
          position: sticky;
          top: 2rem;
        }

        .table-of-contents h3 {
          margin: 0 0 1rem 0;
          color: var(--text);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .table-of-contents ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .table-of-contents li {
          margin-bottom: 0.75rem;
        }

        .table-of-contents a {
          color: var(--text);
          text-decoration: none;
          font-size: 0.9rem;
          line-height: 1.4;
          transition: color 0.2s ease;
        }

        .table-of-contents a:hover {
          color: var(--primary);
          text-decoration: underline;
        }

        .cta-section {
          text-align: center;
          margin: 2rem 0;
        }

        .cta-section h3 {
          margin: 0 0 1rem 0;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text);
        }

        .cta-section p {
          margin: 0 0 1.5rem 0;
          font-size: 1rem;
          color: var(--text);
        }

        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: var(--snow-accent);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }

        .btn:hover {
          background: #7a6347;
        }

        .related-posts {
          margin-top: 1rem;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .related-post {
          background: var(--bg);
          border: 1px solid var(--primary);
          border-radius: 8px;
          padding: 1.25rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .related-post:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 115, 85, 0.15);
        }

        .related-post h3 {
          margin: 0 0 0.75rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .related-post h3 a {
          color: var(--text);
          text-decoration: none;
        }

        .related-post h3 a:hover {
          color: var(--snow-accent);
        }

        .related-post p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.4;
        }



        @media (max-width: 768px) {
          .related-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .cta-section {
            padding: 1.5rem;
          }

          .post-hero {
            grid-template-columns: 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
          }

          .hero-right {
            position: static;
            order: -1;
          }

          .post-title {
            font-size: 2rem;
            margin: 0 0 0.75rem 0;
          }

          .post-subtitle {
            font-size: 1.1rem;
            margin: 0 0 1.5rem 0;
          }

          .post-meta {
            gap: 1rem;
          }

          .categories {
            gap: 0.4rem;
          }

          .category {
            font-size: 0.75rem;
            padding: 0.2rem 0.6rem;
          }

          .table-of-contents {
            position: static;
            padding: 1rem;
          }


        }
      </style>
    </section>

    <section class="content-section" id="client-setup">
      <h2>The Client's Setup</h2>
      <p>Here's what my client did: instead of having separate catalog items for different office equipment, they created one giant "office equipment" catalog item. Need a monitor? Check the box. Need a chair? Check the box. Need a docking station? Same form.</p>

      <p>When submitted, instead of spinning up a REQ that contained those RITMs, they went directly into RITMs with all the selections stored as variables. Essentially, they built an order guide without actually using the order guide functionality that ServiceNow gives you.</p>

      <p>On the surface, this worked. Orders flowed, tasks were created, and fulfillment teams still got the work. So what's the harm, right?</p>
    </section>

    <section class="content-section" id="pros-cons">
      <h2>Pros and Cons: Skipping REQs in ServiceNow</h2>
      
      <div class="pros-cons-table">
        <div class="pros-section">
          <h3>Pros of Skipping REQs</h3>
          <div class="pros-list">
            <div class="pro-item">
              <div class="pro-icon">✓</div>
              <div class="pro-content">
                <h4>Simplicity for End Users</h4>
                <p>End users don't care about record hierarchy. They just want their request completed. Cutting REQs out of the equation might look like it's simplifying things.</p>
              </div>
            </div>
            
            <div class="pro-item">
              <div class="pro-icon">✓</div>
              <div class="pro-content">
                <h4>Less "Clicking Around"</h4>
                <p>With fewer records in play, some admins think it'll be easier to manage or faster to submit. One record instead of three? Sounds efficient.</p>
              </div>
            </div>
            
            <div class="pro-item">
              <div class="pro-icon">✓</div>
              <div class="pro-content">
                <h4>Custom Catalog Design</h4>
                <p>If a client already has a "do-it-all" catalog item, putting everything into variables seems like a shortcut to avoid managing dozens of smaller items or maintaining order guides.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="cons-section">
          <h3>Cons of Skipping REQs</h3>
          <div class="cons-list">
            <div class="con-item">
              <div class="con-icon">✗</div>
              <div class="con-content">
                <h4>Loss of Hierarchy & Traceability</h4>
                <p>REQs are the umbrella. Without them, you lose the ability to group multiple RITMs under one logical "order." Imagine someone ordering a laptop, monitor, and phone. There's no single "parent" record to tie those items together.</p>
              </div>
            </div>
            
            <div class="con-item">
              <div class="con-icon">✗</div>
              <div class="con-content">
                <h4>Reporting Becomes Painful</h4>
                <p>Without REQs, reporting has to be done at the variable level. That's not intuitive, and it requires advanced reporting skills. Want to know how many office chairs were ordered last quarter? Good luck, it's buried in variables instead of clear RITMs under a REQ.</p>
              </div>
            </div>
            
            <div class="con-item">
              <div class="con-icon">✗</div>
              <div class="con-content">
                <h4>Approvals Get Messy</h4>
                <p>REQs provide a clean approval structure. Without them, you're forcing approvals to happen at the RITM level or building custom logic. Approving a "bundle" of items becomes awkward when there's no parent record.</p>
              </div>
            </div>
            
            <div class="con-item">
              <div class="con-icon">✗</div>
              <div class="con-content">
                <h4>Auditing and Compliance</h4>
                <p>Many organizations need a clear audit trail. The REQ record shows who requested what, when, and how it was fulfilled. Without that, you risk compliance gaps.</p>
              </div>
            </div>
            
            <div class="con-item">
              <div class="con-icon">✗</div>
              <div class="con-content">
                <h4>Scalability Issues</h4>
                <p>What works for a small catalog breaks at scale. As the number of requests grows, managing fulfillment, SLAs, and reporting all without REQs becomes unmanageable.</p>
              </div>
            </div>
            
            <div class="con-item">
              <div class="con-icon">✗</div>
              <div class="con-content">
                <h4>Integration Challenges</h4>
                <p>If you ever integrate ServiceNow with procurement systems, ERP, or asset management, those systems expect a clear request structure. Skipping REQs makes integration way harder.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content-section" id="edge-cases">
      <h2>Devil's Advocate: Could Skipping REQs Ever Work?</h2>
      <p>Okay, let's be fair here. While I've been pretty harsh on skipping REQs, there might be some edge cases where it's not completely insane. Let me walk through the scenarios where someone might actually consider it:</p>

      <h3>Niche Use Cases</h3>
      <p>If your catalog item is hyper-specific, always produces exactly one RITM, and doesn't need grouping or approvals, then skipping REQs might not be catastrophic.</p>
      <p><strong>Example:</strong> A simple password reset request that goes straight to the help desk.</p>

      <h3>Proof of Concept / Early Stage</h3>
      <p>A small organization testing ServiceNow for the first time might hack around REQs just to get things moving quickly.</p>
      <p><strong>Example:</strong> A 50-person company with 3 catalog items, no complex workflows.</p>

      <h3>Custom Apps Outside ITSM</h3>
      <p>If you're using ServiceNow for something unconventional (say, a lightweight intake form), you could argue that REQs add unnecessary overhead.</p>
      <p><strong>Example:</strong> A feedback form that creates records but doesn't need the full request lifecycle.</p>

      <h3>But Here's the Reality Check</h3>
      <p>Even in these "edge cases," you're usually better off keeping REQs. Here's why:</p>
      <ul>
        <li><strong>Future-proofing:</strong> The moment you need real reporting, scaling, or compliance, you'll regret skipping them</li>
        <li><strong>Platform consistency:</strong> ServiceNow is designed around this hierarchy - fighting it just creates technical debt</li>
        <li><strong>Maintenance overhead:</strong> Custom workarounds require ongoing maintenance and documentation</li>
        <li><strong>Team knowledge:</strong> New team members expect standard ServiceNow patterns</li>
      </ul>
      <p><strong>Bottom line:</strong> While these scenarios might seem like exceptions, they're really just different flavors of technical debt waiting to happen.</p>
    </section>

    <section class="content-section" id="takeaway">
      <h2>My Takeaway</h2>
      <p>At the time I worked with that client, I didn't think their setup was all that bad. It worked, requests got fulfilled, and the system didn't break.</p>

      <p>But now, with more experience, I see how much harder they made things for themselves: reporting was clunky, approvals were inconsistent, and scaling the catalog meant bending ServiceNow in unnatural ways. Looking back, I'm still baffled that their implementation partners didn't fight harder to stop them from going down this route.</p>

      <p>Here's the thing about ServiceNow: its beauty lies in its incredible flexibility. You can do almost anything in so many different ways. The platform is so customizable that you can bend it to fit almost any workflow or process you can imagine. But that's also its biggest challenge.</p>

      <p>The hardest part isn't making ServiceNow do what you want - it's choosing a path that works for you today but won't cause you headaches in the future. Every customization, every workaround, every "creative solution" comes with a cost. Sometimes that cost is immediate, sometimes it's hidden until you try to scale or maintain the system.</p>

      <p>So, is there ever a point where a REQ just isn't necessary? Maybe in theory. But in practice, REQs are part of the backbone of ServiceNow for a reason. They bring order, reporting clarity, and compliance in a way that skipping them just can't. The question isn't whether you can skip them - it's whether you should.</p>

      <p>What do you think? Are REQs always worth it, or have you seen a scenario where skipping them actually worked?</p>
    </section>

    <div class="cta-section">
      <a href="/contact" class="btn btn-primary">Get in Touch</a>
    </div>

    <section class="content-section">
      <h2>Helpful Resources</h2>
      <div class="resources-grid">
        <div class="resource-card">
          <h3>Order Guides</h3>
          <p>Official ServiceNow documentation on Order Guides and how they create the proper REQ/RITM structure.</p>
          <a href="https://www.servicenow.com/docs/bundle/zurich-servicenow-platform/page/product/service-catalog-management/concept/c_ServiceCatalogOrderGuides.html" target="_blank" rel="noopener noreferrer" class="resource-link">Read Documentation →</a>
        </div>
        
        <div class="resource-card">
          <h3>Catalog Builder Overview</h3>
          <p>Learn about ServiceNow's Catalog Builder and how to create effective catalog items.</p>
          <a href="https://www.servicenow.com/docs/bundle/zurich-servicenow-platform/page/product/service-catalog-management/reference/catalog-builder-overview.html" target="_blank" rel="noopener noreferrer" class="resource-link">Read Documentation →</a>
        </div>
        
        <div class="resource-card">
          <h3>Record Producer Knowledge Base</h3>
          <p>Detailed information about Record Producers and extended catalog item functions in ServiceNow.</p>
          <a href="https://www.servicenow.com/docs/bundle/zurich-servicenow-platform/page/product/service-catalog-management/reference/r_ExtendedCatalogItemFunctions.html" target="_blank" rel="noopener noreferrer" class="resource-link">Read Documentation →</a>
        </div>
      </div>
    </section>


  </div>
</article>
