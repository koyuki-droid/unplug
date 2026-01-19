# Push to GitHub - Authentication Fix

The code is already committed but needs to be pushed. You need to authenticate as `koyuki-droid`.

## Option 1: Use SSH (Recommended)

### Step 1: Check if SSH key exists
```bash
ls -la ~/.ssh/id_rsa.pub
```

If it exists, copy it:
```bash
cat ~/.ssh/id_rsa.pub
```

### Step 2: Add SSH key to GitHub
1. Go to https://github.com/settings/keys
2. Click "New SSH key"
3. Paste your public key
4. Save

### Step 3: Change remote to SSH
```bash
git remote set-url origin git@github.com:koyuki-droid/unplug.git
git push -u origin main
```

---

## Option 2: Use Personal Access Token

### Step 1: Create Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "unplug-deployment"
4. Select scopes: `repo` (full control)
5. Generate and **copy the token** (you won't see it again!)

### Step 2: Push with token
```bash
git push https://koyuki-droid:YOUR_TOKEN@github.com/koyuki-droid/unplug.git main
```

Or update remote:
```bash
git remote set-url origin https://koyuki-droid:YOUR_TOKEN@github.com/koyuki-droid/unplug.git
git push -u origin main
```

---

## Option 3: GitHub CLI Login

```bash
gh auth login
# Select: GitHub.com → HTTPS → Authenticate in browser
# Then:
git push -u origin main
```

---

## Option 4: Manual Upload (Quick)

If all else fails, you can:
1. Go to https://github.com/koyuki-droid/unplug
2. Click "uploading an existing file"
3. Drag and drop your project files (except node_modules, .next, etc.)

---

## Quick Test

After fixing authentication, verify:
```bash
git remote -v
git push -u origin main
```

Once pushed, you can deploy to Vercel from the GitHub repo!

