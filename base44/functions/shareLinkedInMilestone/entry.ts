import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { milestoneName, milestoneSummary, inventionName } = await req.json();

    if (!milestoneName || !milestoneSummary) {
      return Response.json({ error: 'Missing required fields: milestoneName, milestoneSummary' }, { status: 400 });
    }

    // Get LinkedIn connection — using the registered connector
    const connectorId = '69f0d7c6c3ed41dd461c8dee'; // LinkedIn Professional Sharing
    const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(connectorId);

    // Compose LinkedIn post
    const postText = `🔬 New Research Milestone: ${milestoneName}

${milestoneSummary}

${inventionName ? `Device: ${inventionName}` : ''}

Advancing electromagnetic research at Aethon Apex IP.

#ElectromagneticResearch #ScalarEM #Innovation`;

    // Post to LinkedIn (using official LinkedIn Posts API)
    const linkedinResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: 'urn:li:person:YOUR_LINKEDIN_ID', // Backend should resolve this from user profile
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: postText },
            shareMediaCategory: 'ARTICLE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      }),
    });

    if (!linkedinResponse.ok) {
      const error = await linkedinResponse.text();
      console.error('LinkedIn API error:', error);
      return Response.json({ error: 'Failed to post to LinkedIn', details: error }, { status: 500 });
    }

    const result = await linkedinResponse.json();
    console.log('LinkedIn post created:', result);
    return Response.json({ success: true, postId: result.id });
  } catch (error) {
    console.error('Error sharing milestone:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});