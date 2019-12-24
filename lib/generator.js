'use strict';

const pagination = require('hexo-pagination');

module.exports = function(locals) {
  const config = this.config;
  const orderBy = config.category_generator.order_by || '-date';

  return locals.categories.reduce((result, category) => {
    if (!category.length) return result;

    const posts = category.posts.sort(orderBy);

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
      concatResult = concatResult.concat(getPagination(`${lang}/${category.path}`, translatedPosts, category, config));
      if (lang === defaultLanguage)
        concatResult = concatResult.concat(getPagination(category.path, translatedPosts, category, config));

    });

    function getPagination(path, posts, category, config) {
      const perPage = config.category_generator.per_page;
      const paginationDir = config.pagination_dir || 'page';
      return pagination(path, posts, {
        perPage,
        layout: ['category', 'archive', 'index'],
        format: paginationDir + '/%d/',
        data: {
          category:category.name
        }
      });
    }

    return result.concat(concatResult);
  }, []);
};


