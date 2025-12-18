export type Tools = 'draw' | 'eraser';
export type Action = {
    type: Tools;
    data: any;
}