import { defineConfig } from 'astro/config'
import { remarkReadingTime } from './src/plugins/remarkReadingTime'
import { rehypeCodeBlock } from './src/plugins/rehypeCodeBlock'
import { rehypeCodeHighlight } from './src/plugins/rehypeCodeHighlight'
import { rehypeImage } from './src/plugins/rehypeImage'
import { rehypeLink } from './src/plugins/rehypeLink'
import { rehypeHeading } from './src/plugins/rehypeHeading'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import { site } from './src/config.json'

// https://astro.build/config
export default defineConfig({
  site: site.url,
  base: import.meta.env.PROD ? '/8tme-blog' : '',
  integrations: [tailwind(), react(), sitemap()],
  markdown: {
    syntaxHighlight: false,
    smartypants: false,
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      rehypeHeadingIds,
      rehypeLink,
      rehypeImage,
      rehypeHeading,
      rehypeCodeBlock,
      rehypeCodeHighlight,
    ],
    remarkRehype: { footnoteLabel: '参考', footnoteBackLabel: '返回正文' },
  },
})

