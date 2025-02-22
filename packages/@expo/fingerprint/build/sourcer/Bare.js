"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRncliAutolinkingSourcesAsync = exports.getGitIgnoreSourcesAsync = exports.getPackageJsonScriptSourcesAsync = exports.getBareIosSourcesAsync = exports.getBareAndroidSourcesAsync = void 0;
const spawn_async_1 = __importDefault(require("@expo/spawn-async"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const Utils_1 = require("./Utils");
const debug = require('debug')('expo:fingerprint:sourcer:Bare');
async function getBareAndroidSourcesAsync(projectRoot, options) {
    if (options.platforms.includes('android')) {
        const result = await (0, Utils_1.getFileBasedHashSourceAsync)(projectRoot, 'android', 'bareNativeDir');
        if (result != null) {
            debug(`Adding bare native dir - ${chalk_1.default.dim('android')}`);
            return [result];
        }
    }
    return [];
}
exports.getBareAndroidSourcesAsync = getBareAndroidSourcesAsync;
async function getBareIosSourcesAsync(projectRoot, options) {
    if (options.platforms.includes('ios')) {
        const result = await (0, Utils_1.getFileBasedHashSourceAsync)(projectRoot, 'ios', 'bareNativeDir');
        if (result != null) {
            debug(`Adding bare native dir - ${chalk_1.default.dim('ios')}`);
            return [result];
        }
    }
    return [];
}
exports.getBareIosSourcesAsync = getBareIosSourcesAsync;
async function getPackageJsonScriptSourcesAsync(projectRoot, options) {
    let packageJson;
    try {
        packageJson = require(`${projectRoot}/package.json`);
    }
    catch (e) {
        debug(`Unable to read package.json from ${projectRoot}/package.json: ` + e);
        return [];
    }
    const results = [];
    if (packageJson.scripts) {
        debug(`Adding package.json contents - ${chalk_1.default.dim('scripts')}`);
        const id = 'packageJson:scripts';
        results.push({
            type: 'contents',
            id,
            contents: JSON.stringify(packageJson.scripts),
            reasons: [id],
        });
    }
    return results;
}
exports.getPackageJsonScriptSourcesAsync = getPackageJsonScriptSourcesAsync;
async function getGitIgnoreSourcesAsync(projectRoot, options) {
    const result = await (0, Utils_1.getFileBasedHashSourceAsync)(projectRoot, '.gitignore', 'bareGitIgnore');
    if (result != null) {
        debug(`Adding file - ${chalk_1.default.dim('.gitignore')}`);
        return [result];
    }
    return [];
}
exports.getGitIgnoreSourcesAsync = getGitIgnoreSourcesAsync;
async function getRncliAutolinkingSourcesAsync(projectRoot, options) {
    try {
        const results = [];
        const { stdout } = await (0, spawn_async_1.default)('npx', ['react-native', 'config'], { cwd: projectRoot });
        const config = JSON.parse(stdout);
        const { root } = config;
        const reasons = ['bareRncliAutolinking'];
        for (const depData of Object.values(config.dependencies)) {
            const filePath = path_1.default.relative(root, depData.root);
            results.push({ type: 'dir', filePath, reasons });
            debug(`Adding react-native-cli autolinking dir - ${chalk_1.default.dim(filePath)}`);
            for (const platform of options.platforms) {
                const platformData = getRncliPlatformData(depData, root, platform);
                if (platformData) {
                    results.push({
                        type: 'contents',
                        id: `rncliAutolinkingConfig:${depData.name}:${platform}`,
                        contents: platformData,
                        reasons,
                    });
                }
            }
        }
        return results;
    }
    catch {
        return [];
    }
}
exports.getRncliAutolinkingSourcesAsync = getRncliAutolinkingSourcesAsync;
function getRncliPlatformData(dependency, root, platform) {
    const platformData = dependency.platforms[platform];
    if (!platformData) {
        return '';
    }
    const json = {};
    for (const [key, value] of Object.entries(platformData)) {
        json[key] = value?.startsWith?.(root) ? path_1.default.relative(root, value) : value;
    }
    return JSON.stringify(json);
}
//# sourceMappingURL=Bare.js.map