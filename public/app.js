const container = document.querySelector('#stages');
try {
  const response = await fetch('/api/project');
  if (!response.ok) throw new Error('Configuration unavailable');
  const project = await response.json();
  container.replaceChildren(...project.stages.map((stage, index) => {
    const article = document.createElement('article');
    article.className = 'stage';
    for (const [tag, value, className] of [
      ['span', String(index + 1).padStart(2, '0'), 'number'],
      ['h3', stage.name, ''], ['p', stage.tool, 'tool'],
      ['p', stage.scope, 'scope'], ['span', stage.policy, 'policy']
    ]) {
      const element = document.createElement(tag);
      element.textContent = value;
      element.className = className;
      article.append(element);
    }
    return article;
  }));
} catch {
  container.textContent = 'Pipeline configuration could not be loaded. Refresh to try again.';
}
