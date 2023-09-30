import {spawn} from "child_process";
import inquirer from "inquirer";
import color from "./colors.js";

let c = new color();
export async function runTool(config){
    if(!config.pm){
        inquirer.prompt([{
            type: "list",
            name: "runwith",
            message: "Which package manager would you like to use?",
            choices: ["npm", "pnpm"],
            default: "npm"
        }]).then((answers)=>{
            switch(answers.runwith){
                case "npm":
                    runNpm(config.arguments);
                    break;
                case "pnpm":
                    runPnpm(config.arguments);
                    break;
            }
        })
    }else{
        if(config.pm === "npm") runNpm(config.arguments);
        if(config.pm === "pnpm") runPnpm(config.arguments);
    }
}

export async function askConfirmation(config){
    inquirer.prompt([{
        type: "confirm",
        name: "confirm",
        message: "Are you sure you want to continue?",
        default: false
    }]).then((answers)=>{
        if(answers.confirm){
            runTool(config);
        }else{
            console.log(c.red("Aborted!"));
        }
    })
}

export async function runPnpm(args){
    // run the commanad through pnpm
    const pnpm = spawn("pnpm", args, {stdio: "inherit"});
    pnpm.on("close", (code)=>{
        process.exit(code);
    })
}
export async function runNpm(args){
    // run the commanad through npm
    const npm = spawn("npm", args, {stdio: "inherit"});
    npm.on("close", (code)=>{
        process.exit(code);
    })
}