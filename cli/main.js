import fetch from "node-fetch";
import suspicious from "./verify.js";
import {readFileSync} from "fs";
import {show, stageZero, stageOne, stageTwo} from "./show.js"
import { runTool , askConfirmation} from "./runcli.js";
/**
 * 
 * @param {string[]} args
 * @param {} options
 * @returns {Promise<void>}
 * 
 */
export default async function runSspm(args, options = {}) {
    let packageNames = filterPackageNames(args);
    if(packageNames.length === 0){
        try{
        packageNames = Object.keys(JSON.parse(readFileSync("package.json")).dependencies);
        }catch(err){
            console.log("No packages specified and no package.json found");
            process.exit(1);
        }

    }

    stageZero();
    const packageData = await Promise.allSettled(packageNames.map(packageName => getPackageData(packageName, options.baseURL)))
    const fullfilledData = packageData.filter(data => data.status === "fulfilled" && data.value.error === undefined).map(data => data.value);
    const rejectedData = packageData.filter(data => data.status === "rejected").map(data => data.reason);
    
    stageOne();
    const suspiciousPackages = await suspicious(fullfilledData);
    let unknownPackages = packageNames.filter(name => !fullfilledData.map(data => data.name).includes(name));
    unknownPackages.forEach(packageName => suspiciousPackages[packageName] = "N");

    stageTwo(packageNames.length, fullfilledData.length + unknownPackages.length, Object.keys(suspiciousPackages).length);
    show(suspiciousPackages);
    if(options.skipInstall) process.exit(0);
    if(Object.keys(suspiciousPackages).length > 0 && options.pm != ""){askConfirmation(options);}
    else runTool(options);
}

function filterPackageNames(args) {
    return args.filter(arg => !arg.startsWith("-")) 
}
/**
 * Get package data from package registry
 * @param {string} packageName - The name of the package
 * @param {string} [baseURL] - The base URL of the package registry
 */
function getPackageData(packageName, baseURL) {
    return new Promise((resolve, reject) =>{
        fetch(`${baseURL}/${packageName}`)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
}