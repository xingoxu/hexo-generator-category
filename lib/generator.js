'use strict';

var pagination = require('hexo-pagination');

module.exports = function(locals) {
  var config = this.config;

  return locals.categories.reduce(function(result, category) {
    if (!category.length) return result;

    var posts = category.posts.sort('-date');

    const languages = [].concat(config.language || [])
      .filter(lang => lang !== 'default');
    const defaultLanguage = languages[0];

    let concatResult = [];

    languages.forEach(lang => {
      const translatedPosts = posts.filter(post => {
        if (!config.category_generator.single_language)
          return true;
        if (lang === defaultLanguage)
          return (post.lang === lang || post.lang === undefined);
        return post.lang === lang;
      });
      concatResult = concatResult.concat(getPagination(`${lang}/${category.path}`, translatedPosts, category.name, config));
      if (lang === defaultLanguage)
        concatResult = concatResult.concat(getPagination(category.path, translatedPosts, category.name, config));

    });

    return result.concat(concatResult);
  }, []);
};

function getPagination(path, posts, name, config) {
  var perPage = config.category_generator.per_page;
  var paginationDir = config.pagination_dir || 'page';
  return pagination(path, posts, {
    perPage,
    layout: ['category', 'archive', 'index'],
    format: paginationDir + '/%d/',
    data: {
      category: name
    }
  });
}
