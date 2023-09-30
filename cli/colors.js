export default class color{
    black(text){
        return `\x1b[30m${text}\x1b[0m`;
    }
    red(text){
        return `\x1b[31m${text}\x1b[0m`;
    }
    green(text){
        return `\x1b[32m${text}\x1b[0m`;
    }
    yellow(text){
        return `\x1b[33m${text}\x1b[0m`;
    }
    blue(text){
        return `\x1b[34m${text}\x1b[0m`;
    }
    magenta(text){
        return `\x1b[35m${text}\x1b[0m`;
    }
    cyan(text){
        return `\x1b[36m${text}\x1b[0m`;
    }
    white(text){
        return `\x1b[37m${text}\x1b[0m`;
    }
    clearLine(num=1){
        for(let i = 0; i < num; i++){
            process.stdout.write("\x1b[1A\x1b[2K")
        }
    }
}