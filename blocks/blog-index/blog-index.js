import { fetchIndex } from '../../scripts/scripts.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  const index = `${cfg.type}-index`;

  block.textContent = '';

  // Fetch items from index
  const indexContent = await fetchIndex(index);

  const blogGrid = document.createRange().createContextualFragment('<div class="blog-grid"></div>');

  indexContent.data.forEach((item) => {
    const { pathname } = new URL(item.thumbnail, window.location.href);
    const sport = item.sport.replace(/\[|\]/g, '').replace(/"/g, '');
    const desc = `${item.description.substring(0, 90)}...`;
    const card = document.createRange().createContextualFragment(`<div class="grid-item">
      <article class="blog-post">
        <a class="blog-teaser-link" href="${item.path}">
          <div class="blog-teaser-image">
            
              <img src="${pathname}?width=158&format=png&optimize=medium" alt="wilson-blog-post" loading="lazy">
            
          </div>
          <div class="blog-category">
            ${sport}
          </div>
          <div class="blog-teaser-title">
            ${item.title}
          </div>
          
        </a>
        <div class="blog-teaser-description">
            ${desc}
        </div>
        </article>
      </div>`);

    blogGrid.firstChild.appendChild(card);
  });

  block.appendChild(blogGrid);
}
