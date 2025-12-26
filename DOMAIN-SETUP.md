# Domain Setup Guide for amindiagnostic.net

This guide provides step-by-step instructions for configuring the domain `demo.amindiagnostic.net` with your Vercel deployment.

## Prerequisites

- Ownership of the domain `demo.amindiagnostic.net`
- Access to your domain registrar's DNS settings
- A deployed project on Vercel

## Steps to Configure Domain

### 1. DNS Configuration at Your Domain Registrar

#### Option A: Using A Records

Add the following A records in your domain registrar's DNS settings:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 3600 |

#### Option B: Using CNAME Records

Alternatively, you can use a CNAME record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | your-project.vercel.app | 3600 |

### 2. Vercel Configuration

1. Log in to your Vercel account
2. Select your project
3. Go to **Settings** > **Domains**
4. Add your domain: `demo.amindiagnostic.net`
5. Vercel will verify your DNS configuration
6. If you added a CNAME for `www`, you may want to add a redirect from the root domain to www

### 3. SSL/TLS Certificate

Vercel automatically provisions SSL certificates for your domains. Once your DNS changes propagate, Vercel will issue a certificate for your domain.

### 4. Verification

After DNS propagation (which can take up to 48 hours, but often completes within a few hours):

1. Visit `https://demo.amindiagnostic.net` in your browser
2. Verify that your site loads correctly
3. Check that the SSL certificate is valid (look for the lock icon in your browser)

### Troubleshooting

If your domain doesn't connect properly:

1. Verify DNS settings at your registrar
2. Check Vercel's domain settings for any errors
3. Use a DNS propagation checker tool to verify your DNS changes are visible
4. Contact your domain registrar or Vercel support if issues persist

## Additional Configuration

### Email for Your Domain

If you want to set up email for your domain (e.g., `info@demo.amindiagnostic.net`), you'll need to:

1. Sign up for an email service provider (e.g., Google Workspace, Microsoft 365)
2. Follow their instructions to add MX records to your domain's DNS settings

### Subdomain Configuration

If you want to create subdomains (e.g., `api.demo.amindiagnostic.net`), you can add additional CNAME records pointing to your Vercel deployment or to different services as needed.
