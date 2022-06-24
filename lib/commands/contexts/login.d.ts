import { flags } from '@oclif/command';
import BaseWithContext from '../../base-with-context';
export default class ContextsLogin extends BaseWithContext {
    private questions;
    static description: string;
    static aliases: string[];
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        email: flags.IOptionFlag<string | undefined>;
        password: flags.IOptionFlag<string | undefined>;
        context: flags.IOptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
