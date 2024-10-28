export class Tab1{
    author: string;
    text: string;

    constructor()
    {
        this.author = '';
        this.text = '';
    }
    public setAttributes(t: string, a: string){
        this.author = a;
        this.text=t;
    }
}