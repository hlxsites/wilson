import { fetchIndex } from '../../scripts/scripts.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  const { category: categoryFilter, sport: sportFilter } = cfg;

  block.textContent = '';

  // Fetch items from index
  const indexContent = await fetchIndex('blogpost-index');
  const blogPosts = indexContent.data
    // Parse category and sport
    .map((item) => ({
      ...item,
      category: JSON.parse(item.category),
      sport: JSON.parse(item.sport),
    }))
    // Filter by category and sport
    .filter(({ sport, category }) => {
      if (categoryFilter
      && !category.some((el) => el.toLowerCase() === categoryFilter.toLowerCase())) {
        return false;
      }
      if (sportFilter
      && !sport.some((el) => el.toLowerCase() === sportFilter.toLowerCase())) {
        return false;
      }
      return true;
    });

  // Show empty message if there are no blog items
  if (blogPosts.length === 0) {
    const emptyMessage = document.createRange().createContextualFragment(`<div class="blog-grid empty">
      <div class="empty">
        <h2>DELAY OF GAME</h2>
        <p>Sorry, we don't have anything in this section yet. But check back soon – our roster of stories is growing all the time.</p>
      </div>
    </div>`);
    block.appendChild(emptyMessage);
    return;
  }

  const blogHero = document.createRange().createContextualFragment('<div class="blog-feature-container"></div>');
  const blogGrid = document.createRange().createContextualFragment('<div class="blog-grid"></div>');

  // Limit to 10 items
  blogPosts.slice(0, 10).forEach((item, key) => {
    const {
      image, path, title, description, sport, category, thumbnail,
    } = item;

    const firstSport = sport.length > 0 ? sport[0] : '';

    // Display first blog post as feature
    if (key === 0) {
      const firstCategory = category.length > 0 ? category[0] : '';
      const imageSrc = new URL(image, window.location.href).pathname;

      const card = document.createRange().createContextualFragment(`
      <div class="blog-img">
        <picture>
          <source type="image/webp" srcset="${imageSrc}?width=1050&format=webply&optimize=medium">
          <img src="${imageSrc}?width=1050&format=png&optimize=medium" width="1050" height="454">
        </picture>
      </div>
      <div class="blog-text">
        <div class="blog-tag">
          <div class="blog-sport">${firstSport} </div>
          <span class="divider">/</span>
          <div class="blog-category">${firstCategory} </div>
        </div>
        <div class="blog-title">${title}</div>
        <div class="blog-desc">${description}</div>
        <a class="blog-link" href="${path}">READ ARTICLE</a>
      </div>`);

      blogHero.firstChild.append(card);
      return;
    }

    const thumbnailSrc = new URL(thumbnail, window.location.href).pathname;

    const card = document.createRange().createContextualFragment(`<div class="grid-item">
      <article class="blog-post">
        <a class="blog-teaser-link" href="${path}">
          <div class="blog-teaser-image">
            <picture>
              <source type="image/webp" srcset="${thumbnailSrc}?width=344&format=webply&optimize=medium">
              <img src="${thumbnailSrc}?width=344&format=png&optimize=medium" alt="wilson-blog-post" loading="lazy">
            </picture>
          </div>
          <div class="blog-category">${firstSport}</div>
          <div class="blog-teaser-title">${title}</div>
        </a>
        <div class="blog-teaser-description">${description}</div>
      </article>
    </div>`);

    blogGrid.firstChild.appendChild(card);
  });

  block.appendChild(blogHero);
  block.appendChild(blogGrid);
}
