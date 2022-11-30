import { Component, Input } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { IPredictionResponse } from '../model/prediction-response';

@Component({
  selector: 'app-writer',
  templateUrl: './writer.component.html',
  styleUrls: ['./writer.component.css']
})
export class WriterComponent {

  protected name: string = "";
  protected closeResult: string = "";
  protected onButtonClickSubject: Subject<string> = new Subject<string>();

  constructor(private modalService: NgbModal) {
    this.name = JSON.parse(sessionStorage.getItem('name') as string).name;
  }

  onSubmit() {
    this.onButtonClickSubject.next('submit');
  }

  onClear() {
    this.onButtonClickSubject.next('clear');
  }

  onPredict(res: IPredictionResponse) {
    const modalRef = this.modalService.open(NgbdModalContent, { centered: true });
    modalRef.componentInstance.predictionResult = res;
  }
}

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	template: `
		<div class="modal-header">
			<h4 class="modal-title">Prediction Result</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<h1>Result: {{ predictionResult.predict }}</h1>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
		</div>
	`,
})
export class NgbdModalContent {
	@Input() predictionResult: IPredictionResponse;

	constructor(public activeModal: NgbActiveModal) {}
}