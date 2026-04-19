import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Ce plugin permet à GitHub Actions de compiler le site même sans les images Figma
const figmaAssetPlugin = () => {
  return {
    name: 'figma-asset-mock',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        return '\0' + id;
      }
    },
    load(id: string) {
      if (id.startsWith('\0figma:asset/')) {
        // Retourne une image grise de remplacement (placeholder) pour que le site s'affiche
        return `export default "https://placehold.co/600x400/eeeeee/999999?text=Image+Figma"`;
      }
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    figmaAssetPlugin(), // On ajoute le plugin ici
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
