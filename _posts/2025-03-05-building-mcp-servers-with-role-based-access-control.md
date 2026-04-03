---
layout: default
title: "Building MCP Servers with Role-Based Access Control"
date: 2025-03-05
category: AI
tags: [mcp, model-context-protocol, rbac, ai, claude, automation, servicenow, security, api]
excerpt: MCP servers let AI assistants like Claude talk to your internal tools — but without access control, that's a security conversation you don't want to have. Here's how to build MCP servers with RBAC baked in from the start.
meta_description: "Learn how to build Model Context Protocol (MCP) servers with role-based access control so AI assistants can safely interact with your enterprise tools and data."
style: style-modern
---

<article class="blog-post style-modern">
  <div class="post-hero">
    <div class="hero-left">
      <h1 class="post-title">Building MCP Servers with Role-Based Access Control</h1>
      <p class="post-subtitle">Giving AI assistants access to your tools without giving them access to everything</p>

      <div class="post-meta">
        <time datetime="2025-03-05">March 5, 2025</time>
        <span class="reading-time">8 min read</span>
        <span class="difficulty">Advanced</span>
        <div class="categories">
          <span class="category">AI</span>
          <span class="category">Security</span>
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
          <a href="#what-is-mcp" class="toc-item">
            <div class="toc-number">01</div>
            <div class="toc-content">
              <span class="toc-title">What Is MCP?</span>
              <span class="toc-desc">The protocol connecting AI to your tools</span>
            </div>
          </a>
          <a href="#why-rbac" class="toc-item">
            <div class="toc-number">02</div>
            <div class="toc-content">
              <span class="toc-title">Why RBAC Matters Here</span>
              <span class="toc-desc">The access control problem nobody talks about</span>
            </div>
          </a>
          <a href="#anatomy" class="toc-item">
            <div class="toc-number">03</div>
            <div class="toc-content">
              <span class="toc-title">Anatomy of an MCP Server</span>
              <span class="toc-desc">Tools, resources, and prompts</span>
            </div>
          </a>
          <a href="#building-rbac" class="toc-item">
            <div class="toc-number">04</div>
            <div class="toc-content">
              <span class="toc-title">Building in Access Control</span>
              <span class="toc-desc">Patterns that actually work</span>
            </div>
          </a>
          <a href="#servicenow-example" class="toc-item">
            <div class="toc-number">05</div>
            <div class="toc-content">
              <span class="toc-title">A ServiceNow Example</span>
              <span class="toc-desc">Putting it together in practice</span>
            </div>
          </a>
          <a href="#takeaway" class="toc-item">
            <div class="toc-number">06</div>
            <div class="toc-content">
              <span class="toc-title">My Takeaway</span>
              <span class="toc-desc">Where this is all going</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="post-content">
    <div class="content-intro">
      <p class="lead">I've been spending a lot of late nights thinking about how AI assistants fit into enterprise tooling — specifically how to let them actually do useful things without handing them the keys to the kingdom. MCP (Model Context Protocol) is the protocol that makes this possible, and it's genuinely exciting. But every conversation I see about building MCP servers glosses over the part that matters most in a production environment: who is allowed to do what, and how do you enforce that when the requester is an AI?</p>
    </div>

    <section class="content-section" id="what-is-mcp">
      <h2>What Is MCP?</h2>
      <p>Model Context Protocol is an open standard created by Anthropic that defines how AI models communicate with external tools and data sources. Think of it as a common language that lets an AI assistant — Claude, for example — call functions in your systems, read from your databases, trigger workflows, or query APIs in a structured, auditable way.</p>

      <p>Without MCP, every AI integration is a one-off: custom code, custom auth, custom error handling, no standard way for the AI to know what capabilities are available. With MCP, you build a server that exposes your tools in a standard way, and any MCP-compatible AI client can discover and use them.</p>

      <p>An MCP server exposes three types of things:</p>

      <ul>
        <li><strong>Tools</strong> — callable functions the AI can invoke (create a ticket, query a database, send a notification)</li>
        <li><strong>Resources</strong> — data the AI can read (a document, a record, a configuration file)</li>
        <li><strong>Prompts</strong> — pre-built prompt templates the AI can use for specific tasks</li>
      </ul>

      <p>The AI client connects to your MCP server, discovers what's available, and then calls things as the user asks for them. That's the basic idea. Now here's where it gets interesting — and where most tutorials stop before the important part.</p>
    </section>

    <section class="content-section" id="why-rbac">
      <h2>Why RBAC Matters Here</h2>
      <p>When you build an MCP server that connects to, say, ServiceNow, and you hand it a service account with admin rights so it can "do everything" — you've just given every person who uses that AI assistant admin-level access to ServiceNow, regardless of what their actual role is. That's a problem.</p>

      <p>The AI doesn't have its own intentions. It acts on behalf of the user who's prompting it. So if a user without Change Manager permissions asks the AI to "approve this change request," and your MCP server has admin rights, the AI will happily do it. The user never had that permission in the underlying system — they got it by going through the AI.</p>

      <p>This is the access control problem that doesn't get talked about enough in MCP conversations. The protocol itself is neutral — it doesn't tell you how to handle authorization. That's up to you. Role-Based Data Access Control (RBAC) in your MCP server is how you make sure the AI can only do what the human behind the prompt is actually allowed to do.</p>

      <div class="callout callout-info">
        <strong>The key principle:</strong> The AI assistant should never be able to perform an action on behalf of a user that the user couldn't perform themselves in the underlying system. Your MCP server enforces this.
      </div>
    </section>

    <section class="content-section" id="anatomy">
      <h2>Anatomy of an MCP Server</h2>
      <p>Before getting into the access control patterns, it helps to understand what an MCP server actually looks like. They're typically written in Python or TypeScript using the official MCP SDK. A minimal server looks something like this conceptually:</p>

      <ul>
        <li>You define your tools with names, descriptions, and input schemas</li>
        <li>Each tool has a handler function that gets called when the AI invokes it</li>
        <li>The server handles the MCP transport (stdio or HTTP/SSE) and routes calls to the right handlers</li>
        <li>The AI client connects, lists available tools, and calls them as needed</li>
      </ul>

      <p>The input schema is important — it's how the AI knows what parameters a tool expects. A well-defined schema means the AI can construct valid calls without guessing. A vague schema means the AI guesses, and guessing leads to errors.</p>

      <p>The handler function is where your business logic lives. This is also where your access control logic lives. The handler receives the request, knows who's calling (if you've wired up identity), and decides whether to execute or reject it.</p>
    </section>

    <section class="content-section" id="building-rbac">
      <h2>Building in Access Control</h2>
      <p>There are a few patterns that work well for RBAC in MCP servers, depending on how your environment is set up.</p>

      <h3>Pattern 1: Pass-Through Authentication</h3>
      <p>The cleanest approach. Instead of using a service account, your MCP server accepts a user token (OAuth, API key, session token) from the client and passes it through to the underlying system. The underlying system — ServiceNow, your database, your API — enforces its own permissions on that token.</p>

      <p>This means the AI's access is exactly the same as the user's access. If the user can't approve changes in ServiceNow, the API call will fail when the AI tries it on their behalf. No extra access control layer needed on the MCP side because you're delegating to the system of record.</p>

      <p>The challenge: your AI client needs to securely forward user credentials to the MCP server, which requires some thought about the auth flow and token storage.</p>

      <h3>Pattern 2: Role-Scoped Tool Visibility</h3>
      <p>Instead of exposing all tools to all users and relying on downstream enforcement, your MCP server only surfaces the tools that the authenticated user is allowed to use. A help desk agent connecting to your ServiceNow MCP server sees tools like <code>create_incident</code> and <code>update_incident</code>. A Change Manager sees those plus <code>approve_change</code> and <code>close_change</code>. An admin sees everything.</p>

      <p>This is implemented in the tool listing response — the MCP server dynamically builds the list of available tools based on the authenticated identity. The AI can't call what it doesn't know exists.</p>

      <p>This is a stronger model because it prevents the AI from even attempting unauthorized actions. The pass-through model fails gracefully after the fact; this model prevents the attempt entirely.</p>

      <h3>Pattern 3: Audit Everything</h3>
      <p>Regardless of which pattern you use, every tool invocation should be logged with the calling user's identity, the tool name, the parameters passed, and the result. In an enterprise context, this isn't optional — it's how you prove the AI did what it was supposed to do, and it's how you investigate when something goes wrong.</p>

      <p>The MCP server is a great place to centralize this logging because every action flows through it. Build it in from the start; retrofitting audit logging is always messier than doing it upfront.</p>
    </section>

    <section class="content-section" id="servicenow-example">
      <h2>A ServiceNow Example</h2>
      <p>Here's how I think about this for a ServiceNow MCP server. ServiceNow already has a mature role-based access system — every API call is scoped to the user whose credentials are used. That makes it a natural fit for the pass-through authentication pattern.</p>

      <p>The MCP server would expose tools like:</p>

      <ul>
        <li><code>get_incident</code> — fetch an incident by number or sys_id</li>
        <li><code>create_incident</code> — open a new incident with provided details</li>
        <li><code>update_incident</code> — update fields on an existing incident</li>
        <li><code>get_catalog_items</code> — list available service catalog items</li>
        <li><code>submit_catalog_request</code> — submit a catalog request on behalf of the user</li>
        <li><code>get_change_requests</code> — query change requests with filters</li>
        <li><code>approve_change</code> — approve a change request (Change Manager only)</li>
      </ul>

      <p>Each tool handler calls the ServiceNow REST API using the user's OAuth token. ServiceNow enforces its own ACLs on those calls — if the user doesn't have the itil role, <code>create_incident</code> will fail at the ServiceNow layer. If they don't have the change_manager role, <code>approve_change</code> will fail.</p>

      <p>On top of that, I'd layer role-scoped tool visibility — no point showing <code>approve_change</code> to someone who can't call it. And every call gets logged to a dedicated audit table with the user, tool, parameters, timestamp, and response status.</p>

      <p>The result: an AI assistant that can genuinely help with ServiceNow tasks — pulling up incidents, submitting requests, checking change status — without bypassing a single permission that ServiceNow enforces for human users.</p>
    </section>

    <section class="content-section" id="takeaway">
      <h2>My Takeaway</h2>
      <p>MCP is one of those things that feels like it's going to matter a lot in how enterprise IT operates over the next few years. The ability to give an AI assistant structured, auditable access to your internal tools — without building a custom integration for every single one — is genuinely powerful.</p>

      <p>But the "give it an admin service account and call it a day" approach is going to create problems. Access control in AI-powered tooling needs to be taken just as seriously as access control in any other system that touches your data. The AI acts on behalf of humans — it should be bounded by the same constraints those humans operate under.</p>

      <p>Build the RBAC in from the start. Log everything. Treat the MCP server as a security boundary, not just a translation layer. Do that, and you'll have something you can actually put in front of your organization with confidence.</p>
    </section>

    <div class="cta-section">
      <a href="/contact" class="btn btn-primary">Get in Touch</a>
    </div>

    <section class="content-section">
      <h2>Helpful Resources</h2>
      <div class="resources-grid">
        <div class="resource-card">
          <h3>MCP Official Docs</h3>
          <p>The official Model Context Protocol documentation covering the spec, SDKs, and building your first server.</p>
          <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" class="resource-link">Read the Docs →</a>
        </div>

        <div class="resource-card">
          <h3>MCP Python SDK</h3>
          <p>The official Python SDK for building MCP servers — includes quickstart examples and full API reference.</p>
          <a href="https://github.com/modelcontextprotocol/python-sdk" target="_blank" rel="noopener noreferrer" class="resource-link">View on GitHub →</a>
        </div>

        <div class="resource-card">
          <h3>ServiceNow REST API Docs</h3>
          <p>ServiceNow's REST API reference — the foundation for any ServiceNow MCP server implementation.</p>
          <a href="https://docs.servicenow.com/bundle/washingtondc-application-development/page/integrate/inbound-rest/concept/c_RESTAPI.html" target="_blank" rel="noopener noreferrer" class="resource-link">Read Docs →</a>
        </div>
      </div>
    </section>
  </div>
</article>

<style>
  .blog-post {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
    line-height: 1.6;
  }

  .post-hero {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
    align-items: start;
  }

  .hero-left { text-align: left; }

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

  .post-meta time { font-weight: 500; }

  .reading-time, .difficulty {
    background: var(--primary);
    color: var(--primary-ink);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-weight: 600;
  }

  .categories { display: flex; gap: 0.5rem; }

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
    background: linear-gradient(135deg, var(--bg-2) 0%, var(--bg) 100%);
    border: 2px solid var(--primary);
    border-radius: 16px;
    padding: 1.5rem;
    position: sticky;
    top: 2rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }

  .toc-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--primary);
  }

  .toc-icon {
    font-size: 1.5rem;
    background: var(--primary);
    color: var(--primary-ink);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toc-header h3 {
    margin: 0;
    color: var(--text);
    font-size: 1.2rem;
    font-weight: 700;
  }

  .toc-items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .toc-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--bg);
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }

  .toc-item:hover {
    transform: translateX(4px);
    border-color: var(--primary);
    box-shadow: 0 4px 16px rgba(139,115,85,0.15);
  }

  .toc-number {
    background: var(--snow-accent);
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.8rem;
    flex-shrink: 0;
  }

  .toc-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .toc-title {
    color: var(--text);
    font-weight: 600;
    font-size: 0.95rem;
    line-height: 1.3;
  }

  .toc-desc {
    color: var(--muted);
    font-size: 0.8rem;
    line-height: 1.3;
  }

  .content-intro { margin-bottom: 3rem; }

  .lead {
    font-size: 1.2rem;
    color: var(--muted);
    line-height: 1.7;
  }

  .content-section { margin-bottom: 3rem; }

  .content-section h2 {
    color: var(--text);
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0 0 1.5rem 0;
  }

  .content-section h3 {
    color: var(--text);
    font-size: 1.3rem;
    font-weight: 600;
    margin: 2rem 0 1rem 0;
  }

  .content-section p {
    margin: 0 0 1.5rem 0;
    line-height: 1.7;
  }

  .content-section ul,
  .content-section ol {
    margin: 1.5rem 0;
    padding-left: 1.5rem;
  }

  .content-section li {
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }

  .content-section strong { color: var(--text); }

  .content-section code {
    background: var(--bg-2);
    border: 1px solid var(--primary);
    border-radius: 4px;
    padding: 0.1em 0.4em;
    font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace;
    font-size: 0.88em;
    color: var(--snow-brown);
  }

  .callout {
    border-left: 4px solid var(--snow-brown);
    background: var(--bg-2);
    border-radius: 0 8px 8px 0;
    padding: 1rem 1.25rem;
    margin: 1.5rem 0;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--muted);
  }

  .callout strong { color: var(--text); }

  .cta-section {
    text-align: center;
    margin: 2rem 0;
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

  .btn:hover { background: #7a6347; }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .resource-card {
    background: var(--bg-2);
    border: 1px solid var(--primary);
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .resource-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139,115,85,0.15);
  }

  .resource-card h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text);
  }

  .resource-card p {
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.5;
  }

  .resource-link {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .resource-link:hover { text-decoration: underline; }

  @media (max-width: 768px) {
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

    .post-meta { gap: 1rem; }
    .categories { gap: 0.4rem; }

    .category {
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
    }

    .table-of-contents {
      position: static;
      padding: 1rem;
    }

    .toc-header {
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
    }

    .toc-icon {
      width: 35px;
      height: 35px;
      font-size: 1.25rem;
    }

    .toc-header h3 { font-size: 1.1rem; }
    .toc-items { gap: 0.5rem; }

    .toc-item {
      padding: 0.6rem;
      gap: 0.6rem;
    }

    .toc-number {
      width: 24px;
      height: 24px;
      font-size: 0.75rem;
    }

    .toc-title { font-size: 0.9rem; }
    .toc-desc { font-size: 0.75rem; }
    .resources-grid { grid-template-columns: 1fr; gap: 1rem; }
  }
</style>
