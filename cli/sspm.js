#!/usr/bin/env node

import runSspm from "./main.js"
import color from "./colors.js";
import { runNpm , runTool } from "./runcli.js";

let c = new color();
let args = process.argv.slice(2);
let config = {
    version: "1.2.2",
    pm: null,
    baseURL: "https://registry.npmjs.org"
};
if(args.includes("-npm")) config.pm = "npm";
if(args.includes("-pnpm")) config.pm = "pnpm";
if(args.includes("-skip-install") || args.includes("--skip")) config.skipInstall = true;
args = args.filter((arg)=>!arg.startsWith("-npm") && !arg.startsWith("-pnpm") && !arg.startsWith("-skip-install") && !arg.startsWith("--skip"));
config.arguments = args;

// Some parts of this file were "inspired" by pnpm. https://github.com/pnpm/pnpm/blob/main/pnpm/src/pnpm.ts
(async ()=>{
    if(args.length === 0){
        config.skipInstall = true;
        await runSspm(args, config);
        process.exit(1);
    }
    switch(args[0]){
        case "-v":
        case "--version":
            console.log(config.version);
            break;

        case "install":
        case "i":
        case "add":
            await runSspm(args.slice(1), config);
            break;
        
        case 'access':
        case 'adduser':
        case 'bugs':
        case 'deprecate':
        case 'dist-tag':
        case 'docs':
        case 'edit':
        case 'info':
        case 'login':
        case 'logout':
        case 'owner':
        case 'ping':
        case 'prefix':
        case 'profile':
        case 'pkg':
        case 'repo':
        case 's':
        case 'se':
        case 'search':
        case 'set-script':
        case 'show':
        case 'star':
        case 'stars':
        case 'team':
        case 'token':
        case 'unpublish':
        case 'unstar':
        case 'v':
        case 'version':
        case 'view':
        case 'whoami':
        case 'xmas':
            runNpm(args);
            break;
        default:
            console.log(`${c.cyan("sspm:")} No install command found.`)
            runTool(config);
            break;

    }

})()

