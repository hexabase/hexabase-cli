import { flags } from '@oclif/command';
import BaseWithContext from '../../../base-with-context';
export default class ActionsScriptDownload extends BaseWithContext {
    private questions;
    static description: string;
    static aliases: string[];
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        type: flags.IOptionFlag<string>;
        output: flags.IOptionFlag<string | undefined>;
        context: flags.IOptionFlag<string | undefined>;
    };
    static args: {
        name: string;
        description: string;
        required: boolean;
    }[];
    run(): Promise<void>;
}
