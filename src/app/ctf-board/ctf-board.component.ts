import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../rest.service';
import { SessionService } from '../session.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-ctf-board',
    templateUrl: './ctf-board.component.html',
    styleUrls: ['./ctf-board.component.css']
})

export class CTFBoardComponent implements OnInit {

    private ctfCards;
    private ctfIDToDelete;
    private ctfIndToDelete;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private restService: RestService,
        private sessionService: SessionService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {

        // get ctf cards from backend
        this.restService.getAllWriteups().subscribe(
            success => {
                this.ctfCards = this.sortByKey(success, 'time_updated').reverse();
            },
            failure => { console.log(failure); }
        );

    }

    private sortByKey(array, key) {
        return array.sort(function (a, b) {
            const x = a[key]; const y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    public saveStateToDelete(id, ind) {
        this.ctfIDToDelete = id;
        this.ctfIndToDelete = ind;
    }

    // Opens the popup window for the admin to use
    public open(content: any) {
        this.modalService.open(content);
    }

    public getCTFCards() {
        // [ngClass]="{'d-none': ctf.hidden && !isAdmin()}";
        if (!this.ctfCards) { return null; }
        if (this.isAdmin()) { return this.ctfCards; }
        return this.ctfCards.filter((x) => {
            return (x.hidden === 0);
        });
    }

    public cardClick(ctf) {
        this.restService.customCTFClick(ctf.id);
        this.router.navigate(['/writeups/' + ctf.id]);
    }

    public isAdmin() { return this.sessionService.getAdmin(); }

    public ctfShowHide(id, status, ind) {
        this.restService.ctfShowHide(id, status);
        this.ctfCards[ind].hidden = !status;
    }

    public ctfSetDifficulty(id, form, ind) {
        const val = form.value.difficulty;
        if (val > 100 || val < 0) { return; }
        this.ctfCards[ind].difficulty = form.value.difficulty;
        this.restService.ctfDifficulty(id, form.value.difficulty);
        form.reset();
    }

    public ctfDelete() {
        if (this.ctfIDToDelete !== undefined && this.ctfIndToDelete !== undefined) {
            // delete call to backend
            this.ctfCards.splice(this.ctfIndToDelete, 1);
        }
    }

}
