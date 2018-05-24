import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../rest.service';
import { SessionService } from '../session.service';
import { of } from 'rxjs/observable/of';

@Component({
    selector: 'app-ctf-board',
    templateUrl: './ctf-board.component.html',
    styleUrls: ['./ctf-board.component.css']
})

export class CTFBoardComponent implements OnInit {

    private ctfCards;
    private ctfIDToDelete;
    private ctfIndToDelete;
    form: FormGroup;
    innerHtml: SafeHtml;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private restService: RestService,
        private sessionService: SessionService,
        private modalService: NgbModal,
        private domSanitizer: DomSanitizer
    ) {
        const formBuilder = new FormBuilder();
        this.form = formBuilder.group({
            difficulty: ['', Validators.required, this.isValid]
        });
    }

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

    public isValid(control: FormControl): ValidationErrors {
        const val = control.value;
        if (0 <= val && val <= 100) { return of(null); }
        return of({'isInvalid': true});
      }

    public open(content: any) { this.modalService.open(content); }

    public getCTFCards() {
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

    public ctfSetDifficulty(id, ind) {
        let val = this.form.value.difficulty;
        val -= (val % 1);
        if (val < 0 || 100 < val) { return; }
        this.ctfCards[ind].difficulty = val;
        this.restService.ctfDifficulty(id, val);
        this.form.reset();
    }

    public ctfDelete() {
        if (this.ctfIDToDelete !== undefined && this.ctfIndToDelete !== undefined) {
            // delete call to backend
            this.restService.deleteWriteup(this.ctfIDToDelete).subscribe(
                res => {
                    this.ctfCards.splice(this.ctfIndToDelete, 1);
                },
                err => {}
            );
        }
    }

}
