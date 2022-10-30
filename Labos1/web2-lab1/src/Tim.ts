export class Tim{
   ime:any
   bodovi:any
   razlika:any
   //konstruktor korisnika
   constructor(ime:any, bodovi:any, razlika:any) {
       this.ime=ime
       this.bodovi=bodovi
       this.razlika=razlika
   }
   
   compare(o:Tim){
    var v1 = this.bodovi.valueOf();
    var v2 = o.bodovi.valueOf();
    if(v1!=v2)
        return v1-v2;
    else 
        return this.razlika.valueOf() - o.razlika.valueOf();
   }

}