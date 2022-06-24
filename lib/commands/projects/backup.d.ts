import { flags } from '@oclif/command';
import BaseWithContext from '../../base-with-context';
export default class ProjectsBackup extends BaseWithContext {
    private questions;
    static description: string;
    static aliases: string[];
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        output: flags.IOptionFlag<string | undefined>;
        context: flags.IOptionFlag<string | undefined>;
    };
    static args: {
        name: string;
        description: string;
    }[];
    run(): Promise<void>;
}
