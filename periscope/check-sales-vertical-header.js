const fs=require('fs'); const p='C:/Users/Dan Bandstra/Downloads/SCMPERISCOPEResults48.csv';
const line=fs.readFileSync(p,'utf8').split(/\r?\n/).find(l=>l.includes('Internal ID')&&l.includes('Request Type'));
const headers=[]; let v='',q=false; for(let i=0;i<line.length;i++){const c=line[i],n=line[i+1]; if(c==='"'&&q&&n==='"'){v+='"';i++;} else if(c==='"'){q=!q;} else if(c===','&&!q){headers.push(v);v='';} else v+=c;} headers.push(v);
const keys=headers.map(h=>String(h).toLowerCase().replace(/[^a-z0-9]/g,''));
console.log(headers.filter((h,i)=>['salesvertical','industrygroup','salesindustrygroup'].includes(keys[i])).join('|') || 'NO EXACT SALES VERTICAL HEADER');
