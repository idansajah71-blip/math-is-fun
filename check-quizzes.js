const fs = require('fs');
const c = fs.readFileSync('src/lib/quizzes.ts', 'utf8');
const diff = { easy: 0, medium: 0, hard: 0 };
const matches = c.match(/difficulty:\s*"(\w+)"/g) || [];
matches.forEach(m => {
  const d = m.match(/"(\w+)"/)[1];
  diff[d] = (diff[d] || 0) + 1;
});
console.log('By difficulty:', JSON.stringify(diff));
console.log('Total:', diff.easy + diff.medium + diff.hard);

// Check topic coverage for SMP
const slugRegex = /topicSlug:\s*"([^"]+)"/g;
const slugs = new Set();
let match;
while ((match = slugRegex.exec(c)) !== null) slugs.add(match[1]);
const topics = JSON.parse(fs.readFileSync('src/lib/topics.json', 'utf8'));
const smp = topics.filter(t => t.level === 'smp');
const missing = smp.filter(t => !slugs.has(t.slug));
console.log('\nSMP topic coverage:', smp.length - missing.length, '/', smp.length, 'topics have quizzes');
if (missing.length > 0) {
  console.log('Missing:', missing.map(t => t.slug).join(', '));
}
