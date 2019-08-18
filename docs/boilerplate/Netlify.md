# Netify Setup

Netilfy provides an excellent solution as a service for continuous deployment of the the static assets of our Ionic PWA.

- https://netlify.com

## Table Of Contents
- [Configure Build & Deploy](#configure-build-&-deploy)
- [Configure Custom Domain](#configure-custom-domain)

## Add a Site

## Configure Build & Deploy

Select your site, click Site settings, & click Build & deploy.

From here select Edit settings and enter in the following.
Build command: `cd ionic && npm install && npx ionic build --prod`
Publish directory: `ionic/www/`

## Configure Custom Domain

After logging into your Netilfy account open your site and click Domain Settings. Click Add custom domain and type in the domain you own such as lazz.tech or pwa.lazz.tech then click verify. Select Yes, add domain.

Then setup the DNS. Click Check DNS configuration. It will give you details about setting up a CNAME on you DNS service. In this case we're using https://cloudflare.com.

Log into your cloudflare account and select your domain. Open DNS and input for example `CNAME` `pwa` `confident-dubinsky-3e5f30.netlify.com.`