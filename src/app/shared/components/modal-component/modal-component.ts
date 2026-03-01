import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-component',
  imports: [CommonModule],
  templateUrl: './modal-component.html',
  styleUrl: './modal-component.css',
})
export class ModalComponent {
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;
  @Output() confirm = new EventEmitter<any>();

  constructor(private modalService: NgbModal) { }

  item: any;

  onOpen(item?: any) {
    this.item = item;
    this.modalService.open(this.modalTemplate, { centered: true });
  }

  onConfirm() {
    this.confirm.emit(this.item);
  }

  onClose() {
    this.modalService.dismissAll();
  }
}
