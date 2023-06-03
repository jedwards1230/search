import { CallbackManagerForToolRun } from 'langchain/callbacks';
import { WebBrowser, WebBrowserArgs } from 'langchain/tools/webbrowser';

export class CustomWebBrowser extends WebBrowser {
    constructor(args: WebBrowserArgs) {
        super(args);
    }

    async _call(
        inputs: string,
        runManager?: CallbackManagerForToolRun
    ): Promise<string> {
        return await super._call(inputs, runManager);
    }
}
