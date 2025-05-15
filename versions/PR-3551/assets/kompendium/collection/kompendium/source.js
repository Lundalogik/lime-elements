import { readFile } from './filesystem';
import { extname, join } from 'path';
export async function addSources(docs) {
  var _a;
  const components = await Promise.all(((_a = docs.components) === null || _a === void 0 ? void 0 : _a.map(addComponentSources)) || []);
  return Object.assign(Object.assign({}, docs), { components: components });
}
export async function addComponentSources(component) {
  const sources = await getSources(component);
  return Object.assign(Object.assign({}, component), { sources: sources });
}
export async function getSources(component) {
  const source = await readFile(component.filePath);
  const styleNames = getStyleFiles(source);
  const styles = await Promise.all(styleNames.map(getStyle(component.dirPath)));
  const links = await getLinkedSourceFiles(component);
  return [
    {
      filename: component.fileName,
      type: 'tsx',
      source: source,
    },
    ...styles,
    ...links,
  ];
}
export function getStyleFiles(source) {
  const result = [];
  let regex = /@Component\((\{.+?\})\)/s;
  let match = regex.exec(source);
  const config = match && match[1];
  if (!config) {
    return result;
  }
  regex = /styleUrl:.+?['"](.+?)['"]/s;
  match = regex.exec(config);
  if (match && match[1]) {
    result.push(match[1]);
  }
  return result;
}
const getStyle = (path) => async (name) => {
  const source = await readFile([path, name].join('/'));
  return {
    filename: name,
    type: 'scss',
    source: source,
  };
};
async function getLinkedSourceFiles(component) {
  const deprecatedLinkTags = component.docsTags.filter((tag) => tag.name === 'link');
  if (deprecatedLinkTags.length > 0) {
    // eslint-disable-next-line no-console
    console.warn('Using the @link tag to link source files for display alongside examples is deprecated. ' +
      'Use @sourceFile instead.');
  }
  const linkTags = component.docsTags.filter((tag) => tag.name === 'sourceFile');
  const backwardsCompatibleLinkTags = [...linkTags, ...deprecatedLinkTags];
  return Promise.all(backwardsCompatibleLinkTags.map(getLink(component)));
}
const getLink = (component) => async (tag) => {
  let source;
  try {
    source = await readFile(join(component.dirPath, tag.text));
  }
  catch (_a) {
    source = `File ${tag.text} not found`;
  }
  return {
    filename: tag.text,
    type: extname(tag.text).replace('.', ''),
    source: source,
  };
};
