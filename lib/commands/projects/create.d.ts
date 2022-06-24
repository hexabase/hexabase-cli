import { flags } from '@oclif/command';
import BaseWithContext from '../../base-with-context';
export default class ProjectsCreate extends BaseWithContext {
    private questions;
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        context: flags.IOptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
