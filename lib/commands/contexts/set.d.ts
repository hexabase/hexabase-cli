import { Command, flags } from '@oclif/command';
import Conf from 'conf';
export default class ContextsSet extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        server: flags.IOptionFlag<string | undefined>;
        sse: flags.IOptionFlag<string | undefined>;
    };
    static args: {
        name: string;
        description: string;
        required: boolean;
    }[];
    hexaConfig: Conf<Record<string, unknown>>;
    run(): Promise<void>;
}
