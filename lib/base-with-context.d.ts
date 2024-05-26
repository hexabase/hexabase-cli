import { Command, flags } from '@oclif/command';
import Conf from 'conf';
import { APIClient } from './api/api-client';
import { SSEClient } from './api/sse-client';
import { ModelerClient } from './api/modeler-client';
declare type Context = {
    server: string;
    sse: string;
    modeler: string;
};
export default abstract class BaseWithContext extends Command {
    static flags: {
        context: flags.IOptionFlag<string | undefined>;
    };
    private _hexaAPI;
    private _hexaSSE;
    private _hexaModeler;
    hexaConfig: Conf<Record<string, unknown>>;
    context: Context;
    currentContext: string | flags.IOptionFlag<string | undefined>;
    get hexaAPI(): APIClient;
    get hexaSSE(): SSEClient;
    get hexaModeler(): ModelerClient;
    configureHexaAPI(): void;
    configureHexaSSE(): void;
    configureHexaModeler(): void;
    init(): Promise<void>;
}
export {};
