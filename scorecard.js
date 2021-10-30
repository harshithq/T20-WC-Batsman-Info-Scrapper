
const request= require("request");
const cheerio=require("cheerio");
const path=require("path");
const fs=require("fs");
const xlsx=require("xlsx");

function processScorecard(url)
{
    request(url,cb);
}



function cb(err,request,html)
{
    if(err)
    console.log(err);
    else
    {
        extractMathInfo(html);
    }
}

function extractMathInfo(html)
{
    let $=cheerio.load(html);
    let commonInfo=$(".match-header-container .header-info .description").text();
    
    let result=$(".event .status-text ").text();
    
    let info=commonInfo.split(",");
    let venue=info[1].trim();
    let date=info[2].trim();

   
    let innings=$(".card.content-block.match-scorecard-table>.Collapsible");
    let htmlString="";

    for(let i=0;i<innings.length;i++)
    {
     let teamName=$(innings[i]).find("h5").text();
     teamName=teamName.split("INNINGS")[0].trim();
    
     let opponentIndex=i^1;
     let opponentTeamName=$(innings[opponentIndex]).find("h5").text();
     opponentTeamName=opponentTeamName.split("INNINGS")[0].trim();
     console.log(opponentTeamName);
     let cInning=$(innings[i]);
     let allRows=cInning.find(".table.batsman tbody tr");

     for(let j=0;j<allRows.length;j++)
     {
         let allCol=$(allRows[j]).find("td");
         let isWorthy=$(allCol[0]).hasClass("batsman-cell");
          
         if(isWorthy==true)
         {
           let playerName=$(allCol[0]).text();
           let runs=$(allCol[2]).text();
           let balls=$(allCol[3]).text();
           let fours=$(allCol[5]).text();
           let sixes=$(allCol[6]).text();
           let sr=$(allCol[7]).text();
          console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
         processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentTeamName,venue,date,result);
        }
         
     }
    }


   


}

function processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentTeamName,venue,date,result)
{
    let teamPath=path.join(__dirname,"t20",teamName);
    dirCreater(teamPath);
    let filePath=path.join(teamPath,playerName+".xlsx");
    let content = excelReader(filePath,playerName);
    let playerObj={
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentTeamName,
        venue,
        date,
        result
    }
    content.push(playerObj);
    excelWriter(filePath,content,playerName);
}

function dirCreater(filePath)
{
    console.log("----------");
    console.log(filePath);
      if(fs.existsSync(filePath)==false)
      {
          fs.mkdirSync(filePath);
      }
}

function excelWriter(filePath,data,sheetName){
    let newWB=xlsx.utils.book_new();
    let newWS=xlsx.utils.json_to_sheet(data);
    
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    
    xlsx.writeFile(newWB,filePath);
}

function excelReader(filePath,sheetName){
    if(fs.existsSync(filePath)==false)
    {
    return [];
    }
    let wb=xlsx.readFile(filePath);
    let excelData=wb.Sheets[sheetName];
    let ans=xlsx.utils.sheet_to_json(excelData);
    return ans;
}


module.exports={
    ps: processScorecard
}