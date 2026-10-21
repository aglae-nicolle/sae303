// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

<<<<<<< HEAD
=======
import netlify from '@astrojs/netlify';

>>>>>>> 2af884976ad39019fa90c947da3766e45853ae4f
// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
<<<<<<< HEAD
  }
=======
  },

  //adapter: netlify()
>>>>>>> 2af884976ad39019fa90c947da3766e45853ae4f
});