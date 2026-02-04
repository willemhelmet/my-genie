# my-genie
A new splat project.

## Deployment

To deploy to GitHub Pages:
1. Update `vite.config.ts`: Uncomment the `base` property and ensure it matches your repository name (e.g., `/my-genie/`).
2. Update `package.json`: Update the `homepage` field with your actual username (e.g., `"homepage": "https://<username>.github.io/my-genie"`).
3. Run `npm run deploy`.

### Asset Paths
If you add new assets, ensure you reference them using `import.meta.env.BASE_URL` to correct the path for GitHub Pages subdirectories.
Example: `const url = import.meta.env.BASE_URL + "my-model.glb";`
