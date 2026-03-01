import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import JsBarcode from 'jsbarcode';
import { BarcodeDto, BarcodeService } from '../../services/barcode-service';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal-component/modal-component';

@Component({
  selector: 'app-barcode-list.component',
  templateUrl: './barcode-list.component.html',
  styleUrl: './barcode-list.component.css',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  providers: [BarcodeService]
})
export class BarcodeListComponent implements AfterViewInit {

  @ViewChild('deleteModal') deleteModal!: any;

  constructor(private service: BarcodeService, private cdr: ChangeDetectorRef,) {
  }

  items: BarcodeDto[] = [];

  @ViewChildren('barcode') barcodes!: QueryList<ElementRef>;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];
  code: string = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getAll(this.currentPage, this.pageSize).subscribe(res => {
      // console.log('page:', this.currentPage);
      // console.log('data:', res.data);
      this.items = res.data;
      this.cdr.markForCheck();
      this.totalItems = res.total;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    });
  }

  goToPage(page: number) {
    console.log('go to page:', page);
    this.currentPage = page;
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.generateBarcodes();

    this.barcodes.changes.subscribe(() => {
      this.generateBarcodes();
    });
  }

  onCodeInput(event: any) {
    const input = event.target;
    if (input.value.length > 19) return;
    let value = input.value.toUpperCase();
    value = value.toUpperCase();
    console.log('input value:', value);
    // ตำแหน่ง cursor ปัจจุบัน
    const cursorPosition = input.selectionStart;

    // เอาเฉพาะ A-Z และ 0-9
    value = value.replace(/[^A-Z0-9]/g, '');

    // ลบ dash เดิม
    value = value.replace(/-/g, '');

    // จำกัดความยาว
    value = value.substring(0, 16);

    // แบ่งทุก 4 ตัว
    const parts = value.match(/.{1,4}/g);
    const formatted = parts ? parts.join('-') : value;

    input.value = formatted;
    this.code = formatted;

    // คืน cursor แบบไม่กระโดด
    const newCursor = cursorPosition + (formatted.length - value.length);
    input.setSelectionRange(newCursor, newCursor);
  }

  generateBarcodes() {
    this.barcodes.forEach((barcode, index) => {
      JsBarcode(barcode.nativeElement, this.items[index].code, {
        format: 'CODE39',
        width: 1.2,
        height: 50,
        displayValue: false
      });
    });
  }

  addProductCode(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this.service.create(this.code).subscribe({
      next: (newItem) => {
        this.items = [...this.items, newItem];
        this.code = '';
        f.resetForm();
      }
    });
  }

  onDelete(item: BarcodeDto) {
    this.deleteModal.onOpen(item);
  }

  onConfirmDelete(item: BarcodeDto) {
    this.service.delete(item.id).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.id !== item.id);
        this.cdr.detectChanges();
        this.deleteModal.onClose();
      }
    });
  }
}
