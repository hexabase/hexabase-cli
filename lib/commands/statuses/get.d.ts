import { flags } from '@oclif/command';
import BaseWithContext from '../../base-with-context';
export default class StatusesGet extends BaseWithContext {
    private questions;
    static description: string;
    static aliases: string[];
    static flags: {
        columns: flags.IOptionFlag<string | undefined>;
        sort: flags.IOptionFlag<string | undefined>;
        filter: flags.IOptionFlag<string | undefined>;
        csv: flags.IFlag<boolean>;
        output: flags.IOptionFlag<string | undefined>;
        extended: flags.IFlag<boolean>;
        'no-truncate': flags.IFlag<boolean>;
        'no-header': flags.IFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        context: flags.IOptionFlag<string | undefined>;
    };
    static args: {
        name: string;
        description: string;
        required: boolean;
    }[];
    run(): Promise<void>;
}
