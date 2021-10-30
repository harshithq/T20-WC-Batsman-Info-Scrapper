const request= require("request");
const cheerio=require("cheerio");
const scorecardObj=require("./scorecard");

function getAllMatchesLink(url)
{
    request(url,function(err,response,html){
     if(err)
     console.log(err);
     else{
      extractAllLinks(html);
     }
    });
}

function extractAllLinks(html)
{
    let $=cheerio.load(html);
    let anchorEle=$("a[data-hover='Scorecard']");
   for(let i=0;i<anchorEle.length;i++)
   {
       let link=$(anchorEle[i]).attr("href");
       let flink="https://www.espncricinfo.com"+link;
       scorecardObj.ps(flink);
   }

}

module.exports = {
    getAllMatches:getAllMatchesLink
}