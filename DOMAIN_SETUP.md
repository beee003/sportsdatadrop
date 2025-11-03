# 🌐 Custom Domain Setup Guide

## Adding a Custom Domain to Your Vercel Deployment

### Step 1: Get Your Domain Ready

1. Purchase a domain from a registrar (Namecheap, Google Domains, GoDaddy, etc.)
2. Have access to your domain's DNS settings

### Step 2: Add Domain in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **sportsdatadrop** project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter your domain name (e.g., `athera.ai` or `www.athera.ai`)
6. Click **Add**

### Step 3: Configure DNS Records

Vercel will show you the DNS records you need to add. There are two options:

#### Option A: Using Vercel Nameservers (Recommended - Easiest)

1. Copy the nameservers Vercel provides (e.g., `ns1.vercel-dns.com`)
2. Go to your domain registrar
3. Find **Nameservers** or **DNS** settings
4. Replace your current nameservers with Vercel's nameservers
5. Save and wait 24-48 hours for propagation

#### Option B: Using DNS Records (More Control)

Add these records in your domain's DNS settings:

**For Root Domain (e.g., `athera.ai`):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel's IP)

**For WWW Subdomain (e.g., `www.athera.ai`):**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

**Or use Vercel's recommended values** (shown in the Vercel dashboard)

### Step 4: Wait for DNS Propagation

- DNS changes can take 24-48 hours to propagate globally
- Vercel will show a status indicator (usually resolves within minutes to hours)

### Step 5: SSL Certificate (Automatic)

- Vercel automatically provisions SSL certificates via Let's Encrypt
- HTTPS will be enabled automatically once DNS propagates
- No additional configuration needed!

### Step 6: Verify Domain

Once DNS has propagated:
- Vercel will show a green checkmark ✅
- Your domain will be live and accessible
- SSL certificate will be active

---

## Multiple Domains

You can add multiple domains:
- `athera.ai`
- `www.athera.ai`
- `app.athera.ai` (subdomain)

Vercel will automatically redirect and handle all of them.

---

## Redirects Configuration (Optional)

If you want to redirect `www` to root or vice versa, add to `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "www.athera.ai"
        }
      ],
      "destination": "https://athera.ai/:path*",
      "permanent": true
    }
  ]
}
```

---

## Troubleshooting

### Domain not resolving?
1. Check DNS records are correct
2. Wait longer (up to 48 hours)
3. Use [DNS Checker](https://dnschecker.org) to verify propagation globally

### SSL certificate not issued?
- Usually happens automatically within minutes
- Check Vercel dashboard → Domains → SSL status
- Contact Vercel support if stuck

### Want to remove a domain?
1. Go to Settings → Domains
2. Click the domain
3. Click **Remove**

---

## Quick Reference

- **Vercel Dashboard**: https://vercel.com/dashboard
- **DNS Settings**: Usually in your domain registrar's control panel
- **Vercel Docs**: https://vercel.com/docs/concepts/projects/domains

---

## Example: Setting up `athera.ai`

1. ✅ Add `athera.ai` in Vercel → Settings → Domains
2. ✅ Add DNS records at your registrar:
   - A record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`
3. ✅ Wait for DNS propagation
4. ✅ SSL auto-provisions
5. ✅ Live at `https://athera.ai` 🎉

