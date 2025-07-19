# Deployment Branch Strategy

## Option A: Optimized Package Files (Try This First)
1. Use the `package.deploy.json` files created
2. Deploy configurations updated to use production-only dependencies
3. Should reduce memory usage by 60-70%

## Option B: Separate Deployment Branches (If Option A Fails)

### Create Frontend Branch
```bash
# Create and switch to frontend branch
git checkout -b frontend

# Remove backend folder and files
rm -rf backend/
rm -rf *.md (keep only frontend relevant files)

# Update package.json to remove backend dependencies
# Commit only frontend code
git add .
git commit -m "Frontend-only deployment branch"
git push origin frontend
```

### Create Backend Branch  
```bash
# Create and switch to backend branch
git checkout -b backend

# Remove frontend folder and files
rm -rf frontend/
rm -rf *.md (keep only backend relevant files)

# Update package.json to remove frontend dependencies
# Commit only backend code
git add .
git commit -m "Backend-only deployment branch"
git push origin backend
```

### Deployment Configuration
- **Render**: Connect to `backend` branch
- **Netlify**: Connect to `frontend` branch
- **Main**: Keep for development with both frontend and backend

### Branch Maintenance
```bash
# When updating code:
# 1. Work on main branch
git checkout main
# Make your changes...

# 2. Merge to frontend branch
git checkout frontend
git merge main
# Remove backend files if they got added
rm -rf backend/
git add . && git commit -m "Sync frontend changes"
git push origin frontend

# 3. Merge to backend branch  
git checkout backend
git merge main
# Remove frontend files if they got added
rm -rf frontend/
git add . && git commit -m "Sync backend changes"
git push origin backend
```

## Option C: Separate Repositories (Most Robust)
1. Create new repos: `interlink-frontend` and `interlink-backend`
2. Move code to respective repos
3. Connect each repo to respective deployment platform
4. Use git submodules if you want to keep them linked