(async () => {
  // Determine if we are on digest.html or index.html
  const isDigestPage = window.location.pathname.includes('digest.html');

  try {
    const [metaRes, dataRes] = await Promise.all([
      fetch('./data/meta.json'),
      fetch('./data/digest-latest.json')
    ]);

    if (!metaRes.ok || !dataRes.ok) throw new Error('Data files not found.');

    const meta = await metaRes.json();
    const data = await dataRes.json();

    // --- Common Logic: Populate category titles ---
    document.querySelectorAll('.section-title[data-category]').forEach(el => {
      const cat = el.dataset.category;
      const metaCat = meta.categories.find(c => c.id === cat);
      if (metaCat) el.innerText = `${metaCat.emoji} ${metaCat.title}`;
    });

    // --- Digest.html Logic ---
    if (isDigestPage) {
      document.getElementById('page-title').innerText = `Daily News Digest — ${data.date}`;
      document.getElementById('hero-title').innerText = `Daily News Digest — ${data.date}`;
      document.getElementById('hero-subtitle').innerText = `$ curated top stories from ${meta.categories.length} categories. updated daily.`;

      // Populate Hero Nav Buttons
      const heroActions = document.getElementById('hero-actions');
      meta.categories.forEach((cat, index) => {
        const btnClass = index === 0 ? 'btn btn-primary' : 'btn btn-outline';
        const anchor = document.createElement('a');
        anchor.href = `#${cat.id}`;
        anchor.className = btnClass;
        anchor.innerText = `${cat.emoji} ${cat.id}`;
        heroActions.appendChild(anchor);
      });

      // Populate Tables
      meta.categories.forEach(cat => {
        const tbody = document.getElementById(`body-${cat.id}`);
        const stories = data.data[cat.id] || [];
        
        let tableRows = '';
        stories.forEach(story => {
          tableRows += `
            <tr>
              <td class="col-num">${story.num}</td>
              <td class="col-title"><a href="${story.url}" target="_blank" rel="noopener" class="digest-link">${story.title}</a></td>
              <td class="col-summary">${story.summary}</td>
              <td class="col-source">${story.source}</td>
            </tr>`;
        });
        tbody.innerHTML = tableRows;
      });

      // Update Footer Notes
      document.getElementById('footer-sources').innerText = `$ news sources: ${data.sources.join(', ')}.`;
      document.getElementById('last-refresh').innerText = `$ last refresh: ${data.lastRefresh} | source count: ${Object.values(data.data).flat().length} articles across ${meta.categories.length} categories`;

      // Update Meta Tags dynamically for sharing
      const updateMeta = (id, val) => { const el = document.getElementById(id); if(el) el.content = val; };
      updateMeta('og-title', `Daily News Digest — ${data.date}`);
      updateMeta('og-description', `Top stories: ${meta.categories.map(c => c.title).join(', ')}.`);
      updateMeta('tw-title', `Daily News Digest — ${data.date}`);
      updateMeta('tw-description', `Top stories from France, the world, science & AI.`);
    }

    // --- index.html Logic ---
    if (!isDigestPage) {
      const newsGrid = document.querySelector('.news-grid');
      meta.categories.forEach(cat => {
        const container = document.getElementById(`preview-${cat.id}`);
        if (container && data.data[cat.id] && data.data[cat.id].length > 0) {
          const story = data.data[cat.id][0]; // Get the #1 story
          container.innerHTML = `
            <div class="news-badge">${cat.emoji} ${cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}</div>
            <a href="digest.html#${cat.id}" class="news-title">${story.title}</a>
            <p class="news-excerpt">$ ${story.summary}</p>
          `;
        }
      });
    }

  } catch (err) {
    console.error('Digest loader error:', err);
  }
})();
