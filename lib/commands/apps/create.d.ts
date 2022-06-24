import { Command, flags } from '@oclif/command';
export default class AppsCreate extends Command {
    private questions;
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        name: flags.IOptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
