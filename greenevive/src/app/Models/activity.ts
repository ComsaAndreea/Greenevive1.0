import { Timestamp } from "@angular/fire/firestore";

export class Activity{
    type: string;
    details: string;
    distance: string;
    pollution: number;
    date: Timestamp;
    userId: string;

    constructor()
    {
        this.type = '';
        this.details = '';
        this.distance = '0';
        this.pollution = 0;
        this.date = new Timestamp(0,0);
        this.userId = '';
    }
}