import * as fs from "fs-extra"
import * as path from "path"
import * as hjson from "hjson"
import { model } from './model'

export function data(copy_root: string, paste_root: string) {
    const namespaces: Array<string> = fs.readdirSync(path.join(copy_root, 'data'), "utf8");
    for (let namespace of namespaces) {
        if (namespace != "minecraft") {
            fs.copySync(path.join(copy_root, 'data', namespace), path.join(paste_root, 'data', namespace), {
                filter: (src: string) => {
                    let dirname = path.dirname(src)
                    let parent_folders: Array<string> = dirname.split(path.sep)
                    return (path.extname(src) != '.mcfunction'
                        && !parent_folders.includes('loot_table')
                        && !parent_folders.includes('advancements')
                    );
                }
            });
        } else {
            try {
                fs.copySync(path.join(copy_root, 'data', 'minecraft', 'tags'), path.join(paste_root, 'data', 'minecraft', 'tags'));
            } catch (err) {
                console.log('No tags in minecraft namespace');
                console.error(err);
            }
        }
    }

}

export function assets(copy_root: string, compile_root: string) {
    const paste_root = path.join(compile_root, 'resources')
    const namespaces: Array<string> = fs.readdirSync(path.join(copy_root, 'data'), "utf8");
    for (let namespace of namespaces) { // \/
        if (namespace != 'minecraft') { // wow that line up tho, by chance beautiful
            fs.copySync(path.join(copy_root, 'assets', namespace), path.join(paste_root, 'assets', namespace));
        } else {
            fs.copySync(path.join(copy_root, 'assets', 'minecraft'), path.join(paste_root, 'assets', 'minecraft'), {
                filter: (src: string) => {
                    let cmd_override: boolean;
                    if (path.extname(src) == '.json' || '.jsonc' || 'hjson') {
                        const file: model = hjson.parse(fs.readFileSync(path.join(src), 'utf8'));
                        if (file.hasOwnProperty('overrides')) {
                            for (let override of file.overrides) {
                                if (override.predicate.hasOwnProperty('custommodeldata')) {
                                    cmd_override = true;
                                    //override = file.overrides.length() // trying to get the for loop to stop for optimization purposes
                                }
                            }
                        }
                    }
                    return (!cmd_override);
                }
            });
        }
    }
}