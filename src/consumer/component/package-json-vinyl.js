// @flow
import fs from 'fs-extra';
import stringifyPackage from 'stringify-package';
import AbstractVinyl from './sources/abstract-vinyl';
import ValidationError from '../../error/validation-error';
import logger from '../../logger/logger';

/**
 * When writing the `package.json`, it uses the package `stringifyPackage` from the NPM guys, which
 * takes as arguments the indentation and the type of the newline. The logic used here to write the
 * package.json is exactly the same used by NPM. The indentation and newline are detected when the
 * file is loaded. (@see package-json-file.js)
 */
export default class PackageJsonVinyl extends AbstractVinyl {
  override: boolean = true;

  async write(): Promise<string> {
    const stat = await this._getStatIfFileExists();
    if (stat) {
      if (stat.isSymbolicLink()) {
        throw new ValidationError(`fatal: trying to write a package.json file into a symlink file at "${this.path}"`);
      }
      if (!this.override) {
        logger.debug(`package-json-vinyl.write, ignore existing file ${this.path}`);
        return this.path;
      }
    }
    logger.debug(`package-json-vinyl.write, path ${this.path}`);
    await fs.outputFile(this.path, this.contents);
    return this.path;
  }

  static load({
    base,
    path,
    content,
    indent,
    newline,
    override = true
  }: {
    base: string,
    path: string,
    content: Object,
    indent?: ?string,
    newline?: ?string,
    override?: boolean
  }): PackageJsonVinyl {
    const jsonStr = stringifyPackage(content, indent, newline);
    const jsonFile = new PackageJsonVinyl({ base, path, contents: Buffer.from(jsonStr) });
    jsonFile.override = override;
    return jsonFile;
  }
}
