import { flags } from '@oclif/command';
import BaseWithContext from '../../base-with-context';
export default class AppsInit extends BaseWithContext {
    private questions;
    static description: string;
    static aliases: string[];
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        file: flags.IOptionFlag<string>;
        context: flags.IOptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
