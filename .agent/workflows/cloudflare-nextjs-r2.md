---
description: How to deploy a Next.js application to Cloudflare Workers with R2 Bucket integration using OpenNext.
---

# Next.js + Cloudflare R2 Deployment Workflow

This guide provides a step-by-step process for building and deploying a Next.js application that serves 3D models (or any files) from a Cloudflare R2 bucket.

## 🛠 Technology Stack
- **Next.js 15+**: Modern React framework.
- **Cloudflare Workers**: High-performance edge computing.
- **Cloudflare R2**: S3-compatible object storage.
- **@opennextjs/cloudflare**: The adapter that makes Next.js work seamlessly on Cloudflare Workers.
- **Ubuntu/WSL**: Mandatory for building OpenNext projects on Windows.
---
## 🚀 Setup Steps
### 1. Environment Preparation (Windows Users)
OpenNext requires a Unix-like environment for bundling. If you are on Windows, you **must** use WSL (Windows Subsystem for Linux).
- Install WSL: `wsl --install`
- Open your terminal in WSL: `wsl` or `wsl -d Ubuntu`
### 2. Install Dependencies
Run these commands inside your project root (in WSL):
```bash
npm install @opennextjs/cloudflare@latest
npm install --save-dev wrangler@latest
```
### 3. Configure Cloudflare (`wrangler.toml`)
Create a `wrangler.toml` in your root directory. This binds your R2 bucket to your code.
```toml
name = "your-project-name"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

# For Workers deployment, configure the main entry point and assets
main = ".open-next/worker.js"
assets = { directory = ".open-next/assets", binding = "ASSETS" }

[[r2_buckets]]
binding = "MODELS_BUCKET" # This is the variable name in your code
bucket_name = "your-r2-bucket-name"
```
### 4. Configure Next.js (`next.config.ts`)
Enable Cloudflare integration for local development:
```typescript
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
const nextConfig = {
  /* your config */
};
export default nextConfig;
```
### 5. Create the API Route
Create `src/app/api/models/[key]/route.ts`. 

> [!IMPORTANT]
> **Do NOT** use `export const runtime = 'edge'`. OpenNext handles the runtime automatically using the Node.js compatibility layer. Using `edge` will cause 500 errors.

```typescript
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
    const { key } = await params;
    const { env } = await getCloudflareContext();

    const object = await env.MODELS_BUCKET.get(`folder-path/${key}`);

    if (!object) return new NextResponse('Not Found', { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('content-type', 'model/gltf-binary');

    return new NextResponse(object.body, { headers });
}
```

### 6. Update `package.json` Scripts
Add these specialized scripts to handle the OpenNext build process for Workers:

```json
"scripts": {
  "worker:build": "opennextjs-cloudflare build",
  "worker:deploy": "npm run worker:build && wrangler deploy",
  "worker:dev": "opennextjs-cloudflare build && opennextjs-cloudflare preview"
}
```

### 7. Build and Deploy
You have two options for deploying. Since you are on Windows, you must use WSL to ensure OpenNext builds the path references correctly.

**Option 1: Quick deployment from PowerShell/CMD**
You can execute the entire sequence through WSL without leaving PowerShell.
// turbo
```bash
wsl npm run worker:deploy
```
*(If you have multiple WSL distributions and want to be specific, use `wsl -d Ubuntu --exec npm run worker:deploy`)*

**Option 2: Enter WSL first (Recommended)**
If you are actively working on the project, enter your Linux environment first.
1. Enter WSL shell:
```bash
wsl
```
2. Once inside the Linux shell, run the deploy script:
```bash
npm run worker:deploy
```

---

## 📝 Beginner Notes & Pitfalls

### ⚠️ The "Edge" Trap
Standard Cloudflare tutorials often tell you to use `export const runtime = 'edge'`. With **OpenNext**, you should **avoid** this. OpenNext creates a more powerful environment that supports standard Node APIs.

### 🐧 Why WSL?
The build tool (`opennextjs-cloudflare`) uses specific file-system features and bundling logic that often fail on native Windows due to path differences and permission models. Always build inside WSL.

### 🔄 Local vs Remote
- Use `npm run dev` for standard React/Next.js UI work.
- Use `npm run worker:dev` if you need to test your backend or R2 integrations.

### 📂 Directory Structure
Cloudflare Workers deploys differently than Pages. OpenNext generates a `.open-next/` directory that contains a `worker.js` file (which runs your server logic) and an `assets/` folder (for static files). Our `worker:deploy` command automatically ensures `wrangler` uploads these correct outputs to Cloudflare Workers.