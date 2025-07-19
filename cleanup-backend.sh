#!/bin/bash
# Backend Branch Cleanup Script

echo "🧹 Cleaning up for backend-only deployment..."

# Remove frontend directory completely
rm -rf frontend/

# Remove root-level files that aren't needed for backend
rm -f test-deployment.js
rm -f deployment-setup.md
rm -f cleanup-frontend.sh
rm -f cleanup-backend.sh

# Keep these important files:
# - backend/ (entire directory)
# - .gitignore
# - README.md (if exists)

echo "✅ Backend cleanup complete!"
echo "📁 Remaining structure:"
echo "   ├── backend/"
echo "   ├── .gitignore"
echo "   └── README.md"
echo ""
echo "🚀 Ready to commit backend-only branch!"