import { Command } from '@oclif/command';
import Conf from 'conf';
export default class ContextsDelete extends Command {
    private questions;
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static args: {
        name: string;
        description: string;
    }[];
    hexaConfig: Conf<Record<string, unknown>>;
    run(): Promise<void>;
}
