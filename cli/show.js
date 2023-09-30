import { suspicions } from "./verify.js";
import color from "./colors.js";
let c = new color();
export function show(packages){
    const maxWidth = Math.min(
        Object.keys(packages).reduce((max, packageName) => Math.max(max, packageName.length), 0),
        20);
    for(let packageName in packages){
        
        if(packages[packageName] == "") continue;

        let severe = false;
        if(packages[packageName].match(/[A-Z]/)) severe = true;
        let name = severe?c.red(packageName):c.yellow(packageName);
        name += " ".repeat(maxWidth - packageName.length);
        console.log(`${name}: ${packages[packageName].split("").map(suspicion => suspicions[suspicion]).join(",\n" + " ".repeat(maxWidth + 2))}`);
    }
}

function createBot(eyes,mouth){
    return `    ╭—————————╮
    │         │
    │  ${c.blue(eyes)}   ${c.blue(eyes)}  │
    │    ${c.blue(mouth)}    │
    ╰—————————╯`
}

export function stageZero(){
    console.log(createBot("●", " "))
    console.log(`${c.cyan("sspm:")}Quarying package registry...`)
}

export function stageOne(){
    c.clearLine(6)
    console.log(createBot("^", " "))
    console.log(`${c.cyan("sspm:")}Analyzing packages...`)
}

export function stageTwo(total, success, failed){
    c.clearLine(6)
    console.log(createBot("◠", " "))
    console.log(`${c.cyan("sspm:")}Done!`)
    console.log(`${c.cyan("sspm:")}${c.green(`${success}/${total}`)} Analyzed, ${c.red(`${failed}`)} Failed`)
}