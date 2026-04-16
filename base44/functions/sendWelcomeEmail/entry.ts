import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { member_email, member_name } = body;

    if (!member_email) {
      return Response.json({ error: 'Missing member_email' }, { status: 400 });
    }

    // Send welcome email
    const response = await base44.integrations.Core.SendEmail({
      to: member_email,
      subject: '🎉 Welcome to Zenith Apex — Your Research Platform Access is Ready',
      body: `Hi ${member_name || 'Member'},

Welcome to the Zenith Apex Advanced Research Platform (ZARP)! 🚀

You now have full access to:
✓ Concept Research Database — 1000+ interconnected research nodes
✓ Course Library — Anenergy, Patent Drafting, Build Plans
✓ IP Generation Tools — Patent claims, FTO analysis, investor packages
✓ Build Supplies Shop — Components for hands-on experimentation
✓ Investor CRM & Outreach Workflow

**GET STARTED IN 5 MINUTES:**
1. Log in at https://zarp.ai
2. Complete your profile (Settings → Account)
3. Start with "Concept Graph" to explore the research network
4. Pick a course or build plan from "Course Catalog"

**QUICK LINKS:**
- 📚 Courses: /courses
- 🔬 Research: /my-research
- 🛠️ Build Supplies: /build-supplies-shop
- 💼 Investor Tools: /investor-crm
- ❓ Help & Glossary: /glossary

Questions? Reply to this email or check /troubleshooting.

Welcome aboard!
— Zenith Apex Team`
    });

    return Response.json({ 
      success: true, 
      message: `Welcome email sent to ${member_email}` 
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});