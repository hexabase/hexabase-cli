import { Command, flags } from '@oclif/command';
import Conf from 'conf';
export default class ContextsGet extends Command {
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
    };
    hexaConfig: Conf<Record<string, unknown>>;
    run(): Promise<void>;
}
