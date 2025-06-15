hexo.extend.generator.register('search', function(locals) {
  const searchData = locals.posts.map(function(post) {
    return {
      title: post.title,
      content: post.content ? post.content.substring(0, 500).replace(/\n/g, ' ') : '',
      url: post.path,
      date: post.date.format('YYYY-MM-DD'),
      categories: post.categories.map(cat => cat.name),
      tags: post.tags.map(tag => tag.name)
    };
  });

  return {
    path: 'search-data.js',
    data: `window.searchData = ${JSON.stringify(searchData)};`
  };
});