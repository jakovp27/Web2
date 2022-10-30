import { Pool } from 'pg'
import dotenv from 'dotenv'
import {Utakmica} from './Utakmica';
import {Tim} from './Tim';
dotenv.config({path: require('find-config')('.env')})
const pool = new Pool({
   connectionString: "postgres://sretnoime:I3xF431RYa7G5lO1ni6n53U6DdS4qChg@dpg-cdfeiu5a4992md4fuojg-a.frankfurt-postgres.render.com/web2_baza",
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: 'web2-baza',
   password: process.env.DB_PASSWORD,
   port: 5432,
   ssl:true
})
export async function getTeams() {
   const timovi : Tim[] = [];
   const results = await pool.query('SELECT ime,bodovi,razlika from "Timovi" ORDER BY bodovi DESC ,razlika DESC');
   results.rows.forEach(r => {
      timovi.push(new Tim(r["ime"],r["bodovi"],r["razlika"]));
   });
   return timovi;
}



export async function getGames() {
   const utakmice : Utakmica[] = [];
   const results = await pool.query('SELECT tim1_ime,tim2_ime,tim1_poeni,tim2_poeni from "Utakmice" ORDER BY id');
   results.rows.forEach(r => {
      console.log(new Utakmica(r["tim1_ime"],r["tim2_ime"],r["tim1_poeni"],r["tim2_poeni"]).tim1_ime);
      utakmice.push(new Utakmica(r["tim1_ime"],r["tim2_ime"],r["tim1_poeni"],r["tim2_poeni"]));
   });
   return utakmice;
}
export async function updateTimovi(n1: string, n2: string, rez: number,stari_rez:number) {


   if(stari_rez==0){ 
      await addNewScore(rez, n1, n2);
   }

   
   else if((stari_rez>0 && rez>0) || (stari_rez<0 && rez<0) ){ 
      const raz = rez - stari_rez    
      if (rez > 0) {
         await pool.query('UPDATE "Timovi" SET razlika=razlika+$1 WHERE ime=$2', [raz, n1]);
         await pool.query('UPDATE "Timovi" SET razlika=razlika-$1 WHERE ime=$2', [raz, n2]);
      } else {
         await pool.query('UPDATE "Timovi" SET razlika=razlika+$1 WHERE ime=$2', [raz, n1]);
         await pool.query('UPDATE "Timovi" SET razlika=razlika-$1 WHERE ime=$2', [raz, n2]);
      }
   }

   else{
      const raz = rez - stari_rez 
      if (rez > 0) {
         await pool.query('UPDATE "Timovi" SET bodovi=bodovi+$1,razlika=razlika+$2 WHERE ime=$3', [1, raz, n1]);
         await pool.query('UPDATE "Timovi" SET bodovi=bodovi-$1,razlika=razlika-$2 WHERE ime=$3', [1,raz, n2]);
      } else {
         await pool.query('UPDATE "Timovi" SET bodovi=bodovi-$1,razlika=razlika+$2 WHERE ime=$3', [1,raz, n1]);
         await pool.query('UPDATE "Timovi" SET bodovi=bodovi+$1,razlika=razlika-$2 WHERE ime=$3', [1, raz, n2]);
      }
   }

}







async function addNewScore(rez: number, n1: string, n2: string) {
   if (rez > 0) {
      await pool.query('UPDATE "Timovi" SET bodovi=bodovi+$1,razlika=razlika+$2 WHERE ime=$3', [1, rez, n1]);
      await pool.query('UPDATE "Timovi" SET razlika=razlika-$1 WHERE ime=$2', [rez, n2]);
   } else {
      await pool.query('UPDATE "Timovi" SET razlika=razlika+$1 WHERE ime=$2', [rez, n1]);
      await pool.query('UPDATE "Timovi" SET bodovi=bodovi+$1,razlika=razlika-$2 WHERE ime=$3', [1, rez, n2]);
   }
   
   


}

export async function getRez(n1: string, n2: string) {
   const r = await pool.query('SELECT tim1_poeni,tim2_poeni FROM "Utakmice" WHERE tim1_ime=$1 and tim2_ime=$2',[n1,n2])
   const rez = r.rows[0]["tim1_poeni"] - r.rows[0]["tim2_poeni"];
   return rez;
}

export async function updateUtakmica(n1: string, n2: string, v1: number, v2: number) {
  
   await pool.query('UPDATE "Utakmice" SET tim1_poeni=$1,tim2_poeni=$2 WHERE tim1_ime=$3 AND tim2_ime=$4',[v1,v2,n1,n2])

}

