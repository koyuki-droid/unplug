# Troubleshooting Git Push 403 Error

## Issue
Getting `Permission denied` even with token.

## Possible Causes & Solutions

### 1. Token Doesn't Have `repo` Scope
The token needs `repo` scope to push. 

**Fix**: 
- Go back to https://github.com/settings/tokens
- Edit or recreate token
- Make sure **`repo`** checkbox is checked (this gives full repository access)

### 2. Token Created for Wrong Account
Make sure you created the token while logged in as `koyuki-droid`.

**Fix**: 
- Logout and login as `koyuki-droid`
- Create token from that account

### 3. Cached Credentials Interfering
Your system might be using cached credentials.

**Fix**: Clear credential cache
```bash
git credential-osxkeychain erase <<EOF
host=github.com
protocol=https
EOF
```

### 4. Try Using x-access-token Instead
Sometimes GitHub requires `x-access-token` as username:

```bash
git remote set-url origin https://x-access-token:YOUR_TOKEN@github.com/koyuki-droid/unplug.git
git push -u origin main
```

### 5. Check Token Expiration
Make sure token hasn't expired or been revoked.

## Alternative: Upload Files Directly

If push still doesn't work, you can:
1. Go to https://github.com/koyuki-droid/unplug
2. Click "uploading an existing file"
3. Drag and drop your project files (not node_modules, .next, etc.)

## Security Notice

⚠️ **Your token was visible in terminal history!**
- Go to https://github.com/settings/tokens
- Find the token (`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`)
- Click **Revoke**
- Create a new token

