export class Quote{
    author: string;
    text: string;
    quoteId: string;

    constructor()
    {
        this.author = '';
        this.text = '';
        this.quoteId = '';
    }
    public setAttributes(t: string, a: string, qid: string){
        this.author = a;
        this.text=t;
        this.quoteId=qid;
    }
}