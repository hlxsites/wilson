import { fetchIndex } from '../../scripts/scripts.js';

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
    // const { category } = indexContent.data[0];
    const { pathname } = new URL(image, window.location.href);

    const blogGrid = document.createRange().createContextualFragment('<div class="blog-feature-container"></div>');
    const card = document.createRange().createContextualFragment(`
           <div class="blog-img"> 
            <img SRC="${pathname}?format=png&optimize=medium" loading="lazy">
           </div>
           <div class="blog-text">
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
  }
}
