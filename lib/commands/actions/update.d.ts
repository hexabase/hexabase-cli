import { flags } from '@oclif/command';
import BaseWithContext from '../../base-with-context';
export default class ActionsUpdate extends BaseWithContext {
    private questions;
    static description: string;
    static flags: {
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
