import { flags } from '@oclif/command';
import BaseWithContext from '../../base-with-context';
export default class ProjectsSave extends BaseWithContext {
    private questions;
    static description: string;
    static aliases: string[];
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        download: flags.IOptionFlag<string | undefined>;
        context: flags.IOptionFlag<string | undefined>;
    };
    static args: {
        name: string;
        description: string;
    }[];
    run(): Promise<void>;
}
