const url="https://www.espncricinfo.com/series/icc-men-s-t20-world-cup-2021-22-1267897";
const request= require("request");
const cheerio=require("cheerio");
const AllMatchObj=require("./allMatches");
const fs=require("fs");
const path=require("path");

request(url,cb);

const iplPath=path.join(__dirname,"t20");
dirCreater(iplPath);
function cb(err,request,html)
{
    if(err)
    console.log(err);
    else
    {
        extractLink(html);
    }
}

function extractLink(html)
{
    let $=cheerio.load(html);
    let anchorEle=$("a[data-hover='View All Results']");
    let l=anchorEle.attr("href");
    let flink="https://www.espncricinfo.com"+l;
    let t20WCLink="https://www.espncricinfo.com/series/icc-men-s-t20-world-cup-2021-22-1267897/match-results";
    AllMatchObj.getAllMatches(t20WCLink);
}

function dirCreater(filePath)
{
      if(fs.existsSync(filePath)==false)
      {
          fs.mkdirSync(filePath);
      }
}

