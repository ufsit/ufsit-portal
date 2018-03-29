import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-ctf-board',
    templateUrl: './ctf-board.component.html',
    styleUrls: ['./ctf-board.component.css']
})

export class CTFBoardComponent implements OnInit {

    private ctfCards = [
        {'title': 'This is my Title', 'description': 'This is a description add more text add more text keyboard smash here it comes qpiufvqnpunqaiuofnfiwnqqvp3riuafnapiuuwrn1fpquanfipwncpn there it was', 'link': 'tile', 'date': '01/01/201', 'difficulty': '10'}, // tslint:disable-line:max-line-length
        {'title': 'This is my Title', 'description': 'This is a description add more text add more text keyboard smash here it comes qpiufvqnpunqaiuofnfiwnqqvp3riuafnapiuuwrn1fpquanfipwncpn there it was', 'link': 'tile', 'date': '01/01/201', 'difficulty': '10'}, // tslint:disable-line:max-line-length
        {'title': 'This is my Title', 'description': 'This is a dehere it comes qpiufvqnpunqaiuofnfiwnqqvp3riuafnapiuuwrn1fpquanfipwncpn there it was', 'link': 'tile', 'date': '01/01/201', 'difficulty': '10'}, // tslint:disable-line:max-line-length
        {'title': 'This is my Title', 'description': 'This is a description add more text add more text keyboard smash here it comes qpiufvqnpunqaiuofnfiwnqqvp3riuafnapiuuwrn1fpquanfipwncpn there it was', 'link': 'tile', 'date': '01/01/201', 'difficulty': '10'}, // tslint:disable-line:max-line-length
        {'title': 'This is my Title', 'description': 'This is a de add more text add more text keyboard smash here it comes qpiufvqnpunqaiuofnfiwnqqvp3riuafnapiuuwrn1fpquanfipwncpn there it was', 'link': 'tile', 'date': '01/01/201', 'difficulty': '10'}, // tslint:disable-line:max-line-length
        {'title': 'This is my Title', 'description': 'This is a demore text keyboard smash here it comes qpiufvqnpunqaiuofnfiwnqqvp3riuafnapiuuwrn1fpquanfipwncpn there it was', 'link': 'tile', 'date': '01/01/201', 'difficulty': '10'}, // tslint:disable-line:max-line-length
        {'title': 'This is my Title', 'description': 'This is a dencpn there it was', 'link': 'tile', 'date': '01/01/201', 'difficulty': '10'}, // tslint:disable-line:max-line-length
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private restService: RestService
    ) { }

    ngOnInit() {
        // get ctf cards from db
    }

    public redirect(path: string) { window.open(path, '_blank'); }
    public routeTo(path: string) { this.router.navigate([path]); }

    public getCTFCards() { return this.ctfCards; }

    public cardClick(ctf) { console.log(ctf); }

}
