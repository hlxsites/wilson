import { fetchIndex } from '../../scripts/scripts.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const cfg = readBlockConfig(block);

  if (cfg.type === 'sport' || cfg.type === 'category') {
    const index = `${cfg.type}-index`;
    block.textContent = '';

    // Fetch items from index
    const indexContent = await fetchIndex(index);

    const blogGrid = document.createRange().createContextualFragment('<div class="filter-links"></div>');

    indexContent.data.forEach((item) => {
      const card = document.createRange().createContextualFragment(`<div class="grid-item">      
          <a class="blog-teaser-link" href="${item.path}">${item.name} </a>     
        </div>`);
      blogGrid.firstChild.appendChild(card);
    });
    block.appendChild(blogGrid);
  }
}
