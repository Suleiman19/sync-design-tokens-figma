import { EventHandler } from '@create-figma-plugin/utilities'

export type Token = {
    name: string;
    value: string;
}

export interface FetchJsonHandler extends EventHandler {
    name: 'FETCH_JSON';
    handler: (casing: string, tokenData: Object) => void;
}