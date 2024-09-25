const fs = require('fs').promises;
const path = require('path');

const requireJS = async (directory, options = {}) => {
 const { recursive = false, fileFilter = file => path.extname(file).toLowerCase() === '.js' } = options;

 const readDirRecursive = async dir => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
   entries.map(async entry => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() && recursive ? readDirRecursive(res) : res;
   })
  );
  return files.flat();
 };

 const loadModule = async filePath => {
  try {
   return require(filePath);
  } catch (error) {
   console.error(`Error in file ${filePath}:`, error);
   return null;
  }
 };

 const files = recursive ? await readDirRecursive(directory) : await fs.readdir(directory);
 const filteredFiles = files.filter(fileFilter);

 const modules = await Promise.all(
  filteredFiles.map(async file => {
   const filePath = path.isAbsolute(file) ? file : path.join(directory, file);
   return await loadModule(filePath);
  })
 );

 return modules.filter(module => module !== null);
};

module.exports = { requireJS };
