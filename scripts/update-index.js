#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const outPath = path.resolve('public','data','applications.json');

async function main(){
  const url = process.env.DATA_SOURCE_URL;
  if(!url){
    console.log('No DATA_SOURCE_URL set — using bundled sample data.');
    if(fs.existsSync(outPath)){
      console.log(`Bundled data present at ${outPath}`);
    } else {
      console.warn(`No bundled data found at ${outPath}`);
    }
    return;
  }
  console.log(`Fetching data from ${url}`);
  const res = await fetch(url);
  if(!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const json = await res.json();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
  console.log(`Wrote ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
