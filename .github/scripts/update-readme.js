const fs = require('fs');

module.exports = async ({ github }) => {
  const { data: repos } = await github.rest.repos.listForUser({
    username: 'HPMM2',
    sort: 'updated',
    per_page: 100,
    type: 'public'
  });

  const langEmoji = {
    'Python': '🐍', 'Swift': '🍎', 'Kotlin': '📱', 'JavaScript': '🌐',
    'Java': '☕', 'C++': '⚙️', 'C': '⚙️', 'C#': '🎮', 'Dart': '🎯',
    'Ruby': '💎', 'HTML': '🌐', 'CSS': '🎨', 'PHP': '🐘'
  };

  const recent = repos
    .filter(r => r.name !== 'HPMM2')
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 4);

  const starred = repos
    .filter(r => r.name !== 'HPMM2' && r.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4);

  const formatRepo = r => {
    const emoji = langEmoji[r.language] || '📁';
    const lang = r.language ? ' · `' + r.language + '`' : '';
    const desc = r.description ? ' — ' + r.description : '';
    const stars = r.stargazers_count > 0 ? ' ⭐ ' + r.stargazers_count : '';
    return '- ' + emoji + ' [**' + r.name + '**](' + r.html_url + ')' + lang + stars + desc;
  };

  const recentList = recent.map(formatRepo).join('\n');
  const starredList = starred.length > 0
    ? '### ⭐ Most Starred\n' + starred.map(formatRepo).join('\n') + '\n\n'
    : '';

  const section = '## 🚀 Projects\n\n' + starredList + '### 🕐 Recently Updated\n' + recentList + '\n\n';

  let readme = fs.readFileSync('README.md', 'utf8');
  readme = readme.replace(/## 🚀 Projects[\s\S]*?(?=\n## |$)/, section);
  fs.writeFileSync('README.md', readme);
};
