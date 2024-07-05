import { resolve as _resolve } from 'path';

export const entry = './index.js';
export const output = {
    path: './dist',
    filename: 'bundle.js',
};
export const resolve = {
    modules: ['./node_modules', 'node_modules']
};