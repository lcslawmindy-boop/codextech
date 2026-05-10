import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { createClient } from 'npm:@wix/sdk@1.21.6';
import { posts } from 'npm:@wix/blog@1.0.592';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('wix');

    const wixClient = createClient({
      modules: { posts },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Query up to 100 blog posts with content text
    const result = await wixClient.posts.queryPosts({
      fieldsets: ['CONTENT_TEXT', 'URL'],
      query: {
        paging: { limit: 100, offset: 0 },
        sort: [{ fieldName: 'firstPublishedDate', order: 'DESC' }],
      },
    });

    const blogPosts = result.posts || [];
    console.log(`Fetched ${blogPosts.length} Wix blog posts`);

    // Map blog posts to course module structure
    const modules = blogPosts.map(post => ({
      title: post.title || 'Untitled',
      excerpt: post.excerpt || '',
      content: post.contentText || '',
      slug: post.slug || '',
      url: post.url ? `${post.url.base}${post.url.path}` : '',
      published_date: post.firstPublishedDate || '',
      reading_time: post.minutesToRead || 0,
      featured: post.featured || false,
      hashtags: post.hashtags || [],
      wix_post_id: post.id,
      source: 'wix_blog',
    }));

    return Response.json({
      success: true,
      count: modules.length,
      modules,
    });

  } catch (error) {
    console.error('Wix import error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});