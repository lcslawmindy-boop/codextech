import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch all course progress records
    const progressRecords = await base44.asServiceRole.entities.CourseProgress.list();
    
    // Generate summary statistics
    const summary = {
      totalRecords: progressRecords.length,
      completedCourses: progressRecords.filter(p => p.completed).length,
      inProgressCourses: progressRecords.filter(p => !p.completed).length,
      uniqueUsers: new Set(progressRecords.map(p => p.user_email)).size,
      courseBreakdown: {},
      topCourses: []
    };

    // Count by course
    progressRecords.forEach(record => {
      if (!summary.courseBreakdown[record.course_title]) {
        summary.courseBreakdown[record.course_title] = {
          total: 0,
          completed: 0,
          inProgress: 0
        };
      }
      summary.courseBreakdown[record.course_title].total++;
      if (record.completed) {
        summary.courseBreakdown[record.course_title].completed++;
      } else {
        summary.courseBreakdown[record.course_title].inProgress++;
      }
    });

    // Get top 5 courses by enrollment
    summary.topCourses = Object.entries(summary.courseBreakdown)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 5)
      .map(([title, stats]) => ({ title, ...stats }));

    // Build email content
    const emailBody = `
<h2>Weekly Course Progress Summary</h2>
<p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()}</p>

<h3>Overall Statistics</h3>
<ul>
  <li><strong>Total Progress Records:</strong> ${summary.totalRecords}</li>
  <li><strong>Unique Users:</strong> ${summary.uniqueUsers}</li>
  <li><strong>Completed Courses:</strong> ${summary.completedCourses}</li>
  <li><strong>In Progress:</strong> ${summary.inProgressCourses}</li>
  <li><strong>Completion Rate:</strong> ${summary.totalRecords > 0 ? ((summary.completedCourses / summary.totalRecords) * 100).toFixed(1) : 0}%</li>
</ul>

<h3>Top 5 Courses by Enrollment</h3>
<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
  <tr style="background-color: #f0f0f0;">
    <th>Course Title</th>
    <th>Total Enrollments</th>
    <th>Completed</th>
    <th>In Progress</th>
  </tr>
  ${summary.topCourses.map(course => `
  <tr>
    <td>${course.title}</td>
    <td>${course.total}</td>
    <td>${course.completed}</td>
    <td>${course.inProgress}</td>
  </tr>
  `).join('')}
</table>

<h3>All Courses Breakdown</h3>
<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
  <tr style="background-color: #f0f0f0;">
    <th>Course Title</th>
    <th>Total</th>
    <th>Completed</th>
    <th>In Progress</th>
  </tr>
  ${Object.entries(summary.courseBreakdown).map(([title, stats]) => `
  <tr>
    <td>${title}</td>
    <td>${stats.total}</td>
    <td>${stats.completed}</td>
    <td>${stats.inProgress}</td>
  </tr>
  `).join('')}
</table>

<p style="margin-top: 20px; font-size: 12px; color: #666;">
  This is an automated weekly summary. Data last updated: ${new Date().toLocaleString()}
</p>
    `;

    // Send email to admin
    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL not set in environment');
    }

    const emailResponse = await base44.integrations.Core.SendEmail({
      to: adminEmail,
      subject: `Weekly Course Progress Summary - ${new Date().toLocaleDateString()}`,
      body: emailBody,
      from_name: 'Course Analytics'
    });

    return Response.json({
      success: true,
      summary,
      emailSent: true,
      message: `Summary email sent to ${adminEmail}`
    });
  } catch (error) {
    console.error('Error in weeklyProgressSummary:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});