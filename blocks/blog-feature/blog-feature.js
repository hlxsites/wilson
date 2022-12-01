import { fetchIndex } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const index = 'blogpost-index';
  block.textContent = '';
  // Fetch items from index
  const indexContent = await fetchIndex(index);
  if (indexContent.data.length > 0) {
    const { image } = indexContent.data[0];
    const { path } = indexContent.data[0];
    const { title } = indexContent.data[0];
    const { description } = indexContent.data[0];
    const sport = indexContent.data[0].sport.replace(/\[|\]/g, '').replace(/"/g, '');
    const category = indexContent.data[0].category.replace(/\[|\]/g, '').replace(/"/g, '');
    // const { category } = indexContent.data[0];
    const { pathname } = new URL(image, window.location.href);

    const blogGrid = document.createRange().createContextualFragment('<div class="blog-feature-container"></div>');
    const card = document.createRange().createContextualFragment(`
           <div class="blog-img">
           <picture>
           <source type="image/webp" srcset="${pathname}?&format=webply&optimize=medium">
            <img SRC="${pathname}?format=png&optimize=medium" loading="lazy">
            </picture>
           </div>
           <div class="blog-text">
                 <div class="blog-tag">
                    <div class="blog-sport">${sport} </div>
                    <span class="divider">/</span>
                    <div class="blog-category">${category} </div>
                 </div>
                 <div class="blog-title">
                 ${title}
                 </div>
                 <div class="blog-desc">
                 ${description}
                 </div>
                 <a class="blog-link" href="${path}"> READ ARTICLE </a>   
            </div>
         `);

    blogGrid.firstChild.appendChild(card);
    block.appendChild(blogGrid);
    block.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, true, [{ width: '1050' }])));
  }
}
