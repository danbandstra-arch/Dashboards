const fs=require('fs');
const p='C:/Users/Dan Bandstra/Downloads/SCMPERISCOPEResults417.csv';
function parseCsv(text){const rows=[];let row=[],v='',q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){v+='"';i++;}else if(c==='"'){q=!q;}else if(c===','&&!q){row.push(v);v='';}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(v);if(row.some(x=>String(x).trim()))rows.push(row);row=[];v='';}else v+=c;}row.push(v);if(row.some(x=>String(x).trim()))rows.push(row);return rows;}
const rows=parseCsv(fs.readFileSync(p,'utf8'));
const hi=rows.findIndex(r=>r.includes('Internal ID')&&r.includes('Request Type'));
if(hi<0){console.log('No standard header row found');process.exit(1);}
const headers=rows[hi];
const key=h=>String(h||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const exactSales=headers.filter(h=>['salesvertical','industrygroup','salesindustrygroup'].includes(key(h)));
const requestIdx=headers.indexOf('Request Type');
const counts=new Map();
for(const r of rows.slice(hi+1)){const rt=(r[requestIdx]||'(blank)').trim()||'(blank)';counts.set(rt,(counts.get(rt)||0)+1);}
console.log('Header row:',hi+1);
console.log('Data rows:',rows.length-hi-1);
console.log('Columns:',headers.length);
console.log('Exact Sales Vertical headers:',exactSales.join('|')||'NONE');
console.log('Headers:'); headers.forEach((h,i)=>console.log(`${i+1}: ${h}`));
console.log('Request Types:'); [...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).forEach(([k,v])=>console.log(`${v}\t${k}`));
