import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, plan, firstName } = await req.json();

    if (!email || !plan) {
      return Response.json({ error: 'Missing email or plan' }, { status: 400 });
    }

    // Get course recommendations based on plan
    const courseRecommendations = {
      starter: [
        "Scalar Electromagnetics Fundamentals",
        "Prior Art Research & Analysis"
      ],
      researcher: [
        "Bearden Energy from the Vacuum Theory",
        "Building EM Device Prototypes",
        "Patent Strategy for Energy Inventors"
      ],
      pro: [
        "Patent Strategy for Energy Inventors",
        "Investor Pitch Fundamentals",
        "Quantum Field Theory Essentials"
      ]
    };

    const exclusiveOffers = {
      starter: "30% off course bundles (valid 7 days)",
      researcher: "Free first month of patent monitoring",
      pro: "VDR setup consultation ($500 value) + priority support"
    };

    const recommended = courseRecommendations[plan] || [];
    const offer = exclusiveOffers[plan] || "";

    const emailBody = `
Hi ${firstName || "Inventor"},

Welcome to ZARP! 🚀

Your ${plan === 'starter' ? 'Starter' : plan === 'researcher' ? 'Researcher' : 'Pro'} membership is now active. Here's your personalized onboarding:

**📚 RECOMMENDED FOR YOU**
${recommended.map((course, i) => `${i + 1}. ${course}`).join('\n')}

**🎁 EXCLUSIVE OFFER**
${offer}

**🚀 YOUR FIRST STEPS**
1. Enroll in your first course → /courses
2. Generate an AI invention → /inventor-forge
3. Create a build project → /my-research

**Need Help?**
- Knowledge Graph: /
- Glossary: /glossary
- AI Research Assistant: /ai-research

Happy building!

— The ZARP Team
`;

    // Send welcome email via Core integration
    const response = await base44.integrations.Core.SendEmail({
      to: email,
      subject: `Welcome to ZARP — Your ${plan.charAt(0).toUpperCase() + plan.slice(1)} Membership is Active 🎯`,
      body: emailBody,
      from_name: "ZARP Onboarding"
    });

    // Track in onboarding progress
    const existing = await base44.asServiceRole.entities.OnboardingProgress.list()
      .then(items => items.find(item => item.user_email === email))
      .catch(() => null);

    if (!existing) {
      await base44.asServiceRole.entities.OnboardingProgress.create({
        user_email: email,
        purchased_plan: plan,
        welcome_email_sent: true,
        welcome_email_sent_at: new Date().toISOString(),
        completion_percent: 0
      });
    } else {
      await base44.asServiceRole.entities.OnboardingProgress.update(existing.id, {
        welcome_email_sent: true,
        welcome_email_sent_at: new Date().toISOString()
      });
    }

    console.log(`Welcome email sent to ${email}`);
    return Response.json({ success: true, email });

  } catch (error) {
    console.error("Error sending welcome email:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});