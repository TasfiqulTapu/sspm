import fetch from 'node-fetch';

export default async function suspicious(packages) {
    let suspiciousPackages = {}
    let final = {}
    packages.forEach(async pData => {
        let x = ""
        if(veryRecentProject(pData)) x += "R"
        if(unmaintainedProject(pData)) x += "A"
        if(notManyVersions(pData)) x += "V"
        if(missingHomepage(pData)) x += "h"
        if(missingRepository(pData)) x += "r"
        if(missingDescription(pData)) x += "d"
        if(x != "") suspiciousPackages[pData.name] = x;
    });
    try{
    let pnames = []
    for(let p of packages){
        pnames.push(p.name)
    }
    let dcounts = await Promise.allSettled(pnames.map(p => downloadCounts(p)));
    dcounts.forEach((dcount, i) => {
        if(dcount.value.downloads < 2500)suspiciousPackages[`${dcount.value.package}`] += "L";
        if(dcount.value.downloads > 1_000_000 && suspiciousPackages[`${dcount.value.package}`] != undefined){ 
           suspiciousPackages[`${dcount.value.package}`] = suspiciousPackages[`${dcount.value.package}`].replace(/[a-z]/g, "");
        }  
        if(suspiciousPackages[`${dcount.value.package}`] != undefined){
        final[`${dcount.value.package}(${dcount.value.downloads})`] = suspiciousPackages[`${dcount.value.package}`];
        }
    });
    }catch(err){
        final = suspiciousPackages;
    }
    return final;
}

export const suspicions = {
    "R":  "Very recent project",
    "A":  "Hasn't been updated in a while",
    "V":  "Low number of updates",
    "L":  "Low number of monthly downloads",
    "h":  "Missing homepage",
    "r":  "Missing repository",
    "d":  "Missing description",
    "N": "Not found on npm",
}

function downloadCounts(packageName){
    return new Promise((resolve, reject) =>{
        fetch(`https://api.npmjs.org/downloads/point/last-month/${packageName}`)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
}


function veryRecentProject(pData) {
    if(new Date(pData.time.created) > Date.now() - 1000 * 60 * 60 * 24 * 14) {
        return true;
    }
    return false;
}

function unmaintainedProject(pData){
    if(new Date(pData.time.modified) < Date.now() - 1000 * 60 * 60 * 24 * 365 * 0.5) {
        return true;
    }
    return false;
}

function notManyVersions(pData){
    if(pData.versions.length < 4) return true;
    return false;
}

function missingHomepage(pData){
    if(!pData.homepage || pData.homepage=="") return true;
    return false;
}

function missingRepository(pData){
    if(!pData.repository || pData.repository=="") return true;
    return false;
}

function missingDescription(pData){
    if(!pData.description || pData.description=="") return true;
    return false;
}