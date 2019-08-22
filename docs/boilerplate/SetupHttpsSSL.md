# How to setup HTTPS SSL On Your Server With Cloudflare

Setting up a PWA requires HTTPS client and server. Using Netlify we get HTTPS out of the box on the client however setting up the server with the HTTPS SSL keys takes a little more work.

Cloudflare provides free ssl keys for you to copy to your server and these will be accessed by the express server by a docker-compose volume `/root/ssl:/ssl`.

You'll need a key and certificate file which we'll name `key.key` and `cert.pem` as the certificate is in the PEM formate by default from cloudflare.

## Table Of Contents
- [Cloud SSL Key](#cloudflare-ssl-keys)
- [Enable HTTPS Redirect](#enable-https-redirect)
- [Upload Keys To Server](#upload-keys-to-server)
- [How This Gets Used](#how-this-gets-used)
- [Encountered Bugs](#encountered-bugs)

## Cloudflare SSL Keys

To find the SSL Keys on cloudflare for your domain:
Log In Select your domain > Select Crypto > Scroll to Origin Certificates > Click Create Certificate > Click Next 

Copy the Certificate and paste it into a file on you machine named `cert.pem`.
Copy the Private key and paste it into a file on your machine named `key.key`.

## Enable HTTPS Redirect

If you haven't already this is a good time to setup automatic https redirects for your domain name in cloudflare. You can do this by selecting your domain name, going to Crypto, scroll to Always Use HTTPS and toggle it to On.

Optionally you can enable https redirects on only specific pages using cloudflare page rules:
- https://community.cloudflare.com/t/using-full-ssl-on-one-subdomain-and-flexible-on-another/15969

## Upload Keys To Server

Go to the directory where your `key.key` and `cert.pem` are and enter the following commands with the ip of your machine:

```
scp $(pwd)/key.key root@YOUR_SERVERS_IP:/root/ssl/key.key
scp $(pwd)/cert.pem root@YOUR_SERVERS_IP:/root/ssl/cert.pem
```

This will copy the fills securely over ssh to your server in the `/root/ssl/` directory.

## How This Gets Used

In the docker-compose server section that we scp over to the server containing our private information is a volume configured so the express server can see the host servers /root/ssl directory in the docker container as a /ssl directory.

The /server project in this repository in the server/src/index.ts you express server starts up and looks for these files. This is however only run when in a deployment situation if `if (process.env.NODE_ENV === "docker")`.

## Encountered Bugs

- Error: error:0906D06C:PEM routines:PEM_read_bio:no start line
    - I encountered this issue whe using the `touch` command to create the key files then `nano` to text edit them with the pasted in values. I suspect this may have been some encoding issue due to this approach and using linux. I fixed this by just creating the files on my mac development machine and using `scp` to send over the files.