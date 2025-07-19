#!/bin/bash
# Frontend Branch Cleanup Script

echo "🧹 Cleaning up for frontend-only deployment..."

# Remove backend directory completely
rm -rf backend/

# Remove root-level files that aren't needed for frontend
rm -f test-deployment.js
rm -f deployment-setup.md
rm -f cleanup-frontend.sh
rm -f cleanup-backend.sh

# Keep these important files:
# - frontend/ (entire directory)
# - .gitignore
# - README.md (if exists)

echo "✅ Frontend cleanup complete!"
echo "📁 Remaining structure:"
echo "   ├── frontend/"
echo "   ├── .gitignore"
echo "   └── README.md"
echo ""
echo "🚀 Ready to commit frontend-only branch!"