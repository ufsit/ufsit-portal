import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-ctf-board',
    templateUrl: './ctf-board.component.html',
    styleUrls: ['./ctf-board.component.css']
})

export class CTFBoardComponent implements OnInit {

    private ctfCards;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private restService: RestService
    ) { }

    ngOnInit() {

        // get ctf cards from backend
        this.restService.getAllWriteups().subscribe(
            success => { this.ctfCards = success; },
            failure => { console.log(failure); }
        );

    }

    public routeTo(id: string) {
        this.router.navigate(['/writeups/' + id]);
    }

    public getCTFCards() {
        if (!this.ctfCards) { return null; }
        return this.ctfCards.filter((x) => {
            return (x.hidden === 0);
        });
    }

    public cardClick(ctf) {
        this.restService.customCTFClick(ctf.id);
        this.routeTo(ctf.id);
    }

}
