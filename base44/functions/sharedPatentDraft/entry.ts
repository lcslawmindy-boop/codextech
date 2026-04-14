import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function generateToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const body = await req.json().catch(() => ({}));
  const { action } = body;

  // ── CREATE SHARE LINK ─────────────────────────────────────────────────────
  if (action === "create") {
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { document, expiresInHours = 72, allowComments = true } = body;
    if (!document || !document.title) {
      return Response.json({ error: "Missing document or title" }, { status: 400 });
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();

    const draft = await base44.asServiceRole.entities.SharedPatentDraft.create({
      token,
      owner_email: user.email,
      title: document.title,
      document,
      expires_at: expiresAt,
      allow_comments: allowComments,
      comments: [],
      status: "active",
      view_count: 0,
    });

    return Response.json({ token, draft_id: draft.id, expires_at: expiresAt });
  }

  // ── GET DRAFT BY TOKEN (public) ───────────────────────────────────────────
  if (action === "get") {
    const { token } = body;
    if (!token) return Response.json({ error: "Missing token" }, { status: 400 });

    const results = await base44.asServiceRole.entities.SharedPatentDraft.filter({ token, status: "active" });
    if (!results.length) return Response.json({ error: "Not found or revoked" }, { status: 404 });

    const draft = results[0];
    if (new Date(draft.expires_at) < new Date()) {
      return Response.json({ error: "This link has expired" }, { status: 410 });
    }

    // Increment view count
    await base44.asServiceRole.entities.SharedPatentDraft.update(draft.id, {
      view_count: (draft.view_count || 0) + 1,
    });

    return Response.json({ draft });
  }

  // ── ADD COMMENT (public — no auth required) ───────────────────────────────
  if (action === "comment") {
    const { token, author, section, text } = body;
    if (!token || !text?.trim()) return Response.json({ error: "Missing token or text" }, { status: 400 });

    const results = await base44.asServiceRole.entities.SharedPatentDraft.filter({ token, status: "active" });
    if (!results.length) return Response.json({ error: "Not found" }, { status: 404 });

    const draft = results[0];
    if (new Date(draft.expires_at) < new Date()) {
      return Response.json({ error: "Link expired" }, { status: 410 });
    }
    if (!draft.allow_comments) {
      return Response.json({ error: "Comments disabled" }, { status: 403 });
    }

    const newComment = {
      id: Date.now().toString(),
      author: author?.trim() || "Anonymous",
      section: section || "General",
      text: text.trim(),
      created_at: new Date().toISOString(),
    };

    const updatedComments = [...(draft.comments || []), newComment];
    await base44.asServiceRole.entities.SharedPatentDraft.update(draft.id, { comments: updatedComments });

    return Response.json({ comment: newComment });
  }

  // ── REVOKE LINK ────────────────────────────────────────────────────────────
  if (action === "revoke") {
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { token } = body;
    const results = await base44.asServiceRole.entities.SharedPatentDraft.filter({ token, owner_email: user.email });
    if (!results.length) return Response.json({ error: "Not found" }, { status: 404 });

    await base44.asServiceRole.entities.SharedPatentDraft.update(results[0].id, { status: "revoked" });
    return Response.json({ success: true });
  }

  // ── LIST MY SHARES ─────────────────────────────────────────────────────────
  if (action === "list") {
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const drafts = await base44.asServiceRole.entities.SharedPatentDraft.filter({ owner_email: user.email });
    return Response.json({ drafts });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
});