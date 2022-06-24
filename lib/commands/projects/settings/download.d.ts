import { flags } from "@oclif/command";
import BaseWithContext from "../../../base-with-context";
import { ProjectInfo } from '../../../api/models/projects';
export default class DownloadSettings extends BaseWithContext {
    private questions;
    static description: string;
    static aliases: string[];
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        output: flags.IOptionFlag<string | undefined>;
        type: flags.IOptionFlag<string>;
        context: flags.IOptionFlag<string | undefined>;
    };
    static args: {
        name: string;
        description: string;
    }[];
    saveFile(path: string, nameFile: string, data: any): Promise<void>;
    getName(nameFile: string): Promise<{
        name: string;
    }>;
    saveSetting(path: string, nameFile: string, dataSave: any): Promise<void>;
    getAppByDatastoreId(datastoreId: string): Promise<{
        displayApp: string;
        projects: ProjectInfo;
    }>;
    getAppAndDatastore(datastoreId: string): Promise<{
        displayApp: string;
        displayDatastore: string | true;
    }>;
    run(): Promise<void>;
}
