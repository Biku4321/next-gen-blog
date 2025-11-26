// server/src/services/newsletterService.js - Complete Newsletter Integration
import nodemailer from "nodemailer";
import axios from "axios";
import logger from "../utils/logger.js";
import { getRedisClient } from "../config/redis.js";

class NewsletterService {
  constructor() {
    this.providers = {
      mailchimp: this.setupMailchimp(),
      convertkit: this.setupConvertKit(),
      sendgrid: this.setupSendGrid(),
      custom: this.setupCustomSMTP(),
    };
  }

  setupMailchimp() {
    return {
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER,
      listId: process.env.MAILCHIMP_LIST_ID,

      async addSubscriber(email, firstName, lastName, tags = []) {
        try {
          const url = `https://${this.server}.api.mailchimp.com/3.0/lists/${this.listId}/members`;
          const data = {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName || "",
              LNAME: lastName || "",
            },
            tags: tags,
          };

          const response = await axios.post(url, data, {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              "Content-Type": "application/json",
            },
          });

          return { success: true, data: response.data };
        } catch (error) {
          logger.error("Mailchimp subscription error:", error);
          return { success: false, error: error.message };
        }
      },

      async sendCampaign(subject, content, templateId, segmentId) {
        try {
          // Create campaign
          const campaignData = {
            type: "regular",
            recipients: {
              list_id: this.listId,
              segment_opts: segmentId
                ? { saved_segment_id: segmentId }
                : undefined,
            },
            settings: {
              subject_line: subject,
              from_name: process.env.FROM_NAME || "BlogPro",
              reply_to: process.env.FROM_EMAIL || "noreply@blogpro.com",
              template_id: templateId,
            },
          };

          const campaignResponse = await axios.post(
            `https://${this.server}.api.mailchimp.com/3.0/campaigns`,
            campaignData,
            {
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
              },
            }
          );

          const campaignId = campaignResponse.data.id;

          // Set campaign content
          await axios.put(
            `https://${this.server}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
            { html: content },
            {
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
              },
            }
          );

          // Send campaign
          await axios.post(
            `https://${this.server}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/send`,
            {},
            {
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
              },
            }
          );

          return { success: true, campaignId };
        } catch (error) {
          logger.error("Mailchimp campaign error:", error);
          return { success: false, error: error.message };
        }
      },
    };
  }

  setupConvertKit() {
    return {
      apiSecret: process.env.CONVERTKIT_API_SECRET,
      formId: process.env.CONVERTKIT_FORM_ID,

      async addSubscriber(email, firstName, lastName, tags = []) {
        try {
          const url = `https://api.convertkit.com/v3/forms/${this.formId}/subscribe`;
          const data = {
            api_secret: this.apiSecret,
            email,
            first_name: firstName,
            tags: tags.join(","),
          };

          const response = await axios.post(url, data);
          return { success: true, data: response.data };
        } catch (error) {
          logger.error("ConvertKit subscription error:", error);
          return { success: false, error: error.message };
        }
      },

      async sendBroadcast(subject, content, tags = []) {
        try {
          const url = `https://api.convertkit.com/v3/broadcasts`;
          const data = {
            api_secret: this.apiSecret,
            subject,
            content,
            description: `Newsletter: ${subject}`,
            public: false,
            published_at: new Date().toISOString(),
          };

          if (tags.length > 0) {
            data.tag_ids = tags;
          }

          const response = await axios.post(url, data);
          return { success: true, data: response.data };
        } catch (error) {
          logger.error("ConvertKit broadcast error:", error);
          return { success: false, error: error.message };
        }
      },
    };
  }

  setupSendGrid() {
    return {
      apiKey: process.env.SENDGRID_API_KEY,

      async addSubscriber(email, firstName, lastName, listId) {
        try {
          const url = "https://api.sendgrid.com/v3/marketing/contacts";
          const data = {
            list_ids: [listId || process.env.SENDGRID_LIST_ID],
            contacts: [
              {
                email,
                first_name: firstName,
                last_name: lastName,
              },
            ],
          };

          const response = await axios.put(url, data, {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              "Content-Type": "application/json",
            },
          });

          return { success: true, data: response.data };
        } catch (error) {
          logger.error("SendGrid subscription error:", error);
          return { success: false, error: error.message };
        }
      },
    };
  }

  setupCustomSMTP() {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async subscribe(
    email,
    firstName,
    lastName,
    provider = "mailchimp",
    tags = []
  ) {
    try {
      const service = this.providers[provider];
      if (!service) {
        throw new Error(`Newsletter provider ${provider} not configured`);
      }

      const result = await service.addSubscriber(
        email,
        firstName,
        lastName,
        tags
      );

      if (result.success) {
        // Log subscription for analytics
        await this.logSubscription(email, provider, "subscribed");

        // Send welcome email
        await this.sendWelcomeEmail(email, firstName);
      }

      return result;
    } catch (error) {
      logger.error("Newsletter subscription error:", error);
      throw error;
    }
  }

  async sendNewsletter(posts, provider = "mailchimp") {
    try {
      const template = await this.generateNewsletterTemplate(posts);
      const subject = `Weekly Digest - ${new Date().toLocaleDateString()}`;

      const service = this.providers[provider];
      return await service.sendCampaign(
        subject,
        template.html,
        template.templateId
      );
    } catch (error) {
      logger.error("Newsletter send error:", error);
      throw error;
    }
  }

  async generateNewsletterTemplate(posts) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>BlogPro Weekly Digest</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #007cba; padding-bottom: 20px; margin-bottom: 30px; }
            .post { margin-bottom: 30px; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
            .post-title { color: #007cba; text-decoration: none; font-size: 18px; font-weight: bold; }
            .post-excerpt { color: #666; margin: 10px 0; }
            .post-meta { font-size: 12px; color: #999; }
            .cta-button { display: inline-block; background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div className="container">
            <div className="header">
              <h1 style="color: #007cba; margin: 0;">BlogPro Weekly Digest</h1>
              <p>The best articles from this week</p>
            </div>
            
            ${posts
              .map(
                (post) => `
              <div className="post">
                <h2><a href="${process.env.FRONTEND_URL}/posts/${
                  post.slug
                }" className="post-title">${post.title}</a></h2>
                <p className="post-excerpt">${post.excerpt}</p>
                <div className="post-meta">
                  By ${post.author.username} • ${new Date(
                  post.publishedAt
                ).toLocaleDateString()} • ${post.readingTime} min read
                </div>
                <a href="${process.env.FRONTEND_URL}/posts/${
                  post.slug
                }" className="cta-button">Read More</a>
              </div>
            `
              )
              .join("")}
            
            <div className="footer">
              <p>You're receiving this because you subscribed to BlogPro newsletter.</p>
              <p><a href="{{unsubscribe_url}}">Unsubscribe</a> | <a href="${
                process.env.FRONTEND_URL
              }">Visit BlogPro</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    return { html, templateId: null };
  }

  async sendWelcomeEmail(email, firstName) {
    try {
      const transporter = this.providers.custom;

      const mailOptions = {
        from: `"BlogPro" <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: "Welcome to BlogPro Newsletter! 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #007cba;">Welcome to BlogPro, ${firstName}! 🎉</h1>
            <p>Thank you for subscribing to our newsletter. You'll now receive:</p>
            <ul>
              <li>Weekly digest of our best articles</li>
              <li>Exclusive writing tips and tutorials</li>
              <li>Early access to new features</li>
              <li>Community highlights and author spotlights</li>
            </ul>
            <p>Get started by exploring our latest articles:</p>
            <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0;">
              Explore BlogPro
            </a>
            <p>Happy reading!<br>The BlogPro Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      logger.info(`Welcome email sent to ${email}`);
    } catch (error) {
      logger.error("Welcome email error:", error);
    }
  }

  async logSubscription(email, provider, action) {
    const redis = getRedisClient();
    const logData = {
      email,
      provider,
      action,
      timestamp: new Date(),
      ip: "unknown", // Would be passed from request
    };

    await redis.lpush("newsletter_logs", JSON.stringify(logData));
    await redis.ltrim("newsletter_logs", 0, 9999); // Keep last 10k logs
  }

  async getSubscriptionStats() {
    const redis = getRedisClient();
    const logs = await redis.lrange("newsletter_logs", 0, -1);

    const stats = {
      total: 0,
      thisWeek: 0,
      thisMonth: 0,
      byProvider: {},
      growthRate: 0,
    };

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    logs.forEach((logStr) => {
      try {
        const log = JSON.parse(logStr);
        if (log.action === "subscribed") {
          stats.total++;

          const logDate = new Date(log.timestamp);
          if (logDate >= weekAgo) stats.thisWeek++;
          if (logDate >= monthAgo) stats.thisMonth++;

          stats.byProvider[log.provider] =
            (stats.byProvider[log.provider] || 0) + 1;
        }
      } catch (e) {
        // Skip invalid logs
      }
    });

    return stats;
  }
}

export default new NewsletterService();
