import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import JsBarcode from 'jsbarcode';
import { BarcodeDto, BarcodeService } from '../../services/barcode-service';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-barcode-list.component',
  templateUrl: './barcode-list.component.html',
  styleUrl: './barcode-list.component.css',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [BarcodeService]
})
export class BarcodeListComponent implements AfterViewInit {

  constructor(private service: BarcodeService, private fb: FormBuilder,) {
    this.service.getAll().subscribe(res => {
      this.items = res;
    })
  }

  items: BarcodeDto[] = [];

  @ViewChildren('barcode') barcodes!: QueryList<ElementRef>;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.generateBarcodes();

    this.barcodes.changes.subscribe(() => {
      this.generateBarcodes();
    });
  }


  onCodeInput(event: any) {
    const input = event.target;
    let value = input.value;
    value = value.toUpperCase();
    // ตำแหน่ง cursor ปัจจุบัน
    const cursorPosition = input.selectionStart;

    // ลบ dash เดิม
    value = value.replace(/-/g, '');

    // จำกัดความยาว
    value = value.substring(0, 16);

    // แบ่งทุก 4 ตัว
    const parts = value.match(/.{1,4}/g);
    const formatted = parts ? parts.join('-') : value;

    input.value = formatted;

    // คืน cursor แบบไม่กระโดด
    const newCursor = cursorPosition + (formatted.length - value.length);
    input.setSelectionRange(newCursor, newCursor);
  }

  generateBarcodes() {
    this.barcodes.forEach((barcode, index) => {
      JsBarcode(barcode.nativeElement, this.items[index].code, {
        format: 'CODE39',
        width: 2,
        height: 50,
        displayValue: false
      });
    });
  }

  addProductCode(f: NgForm) {

    this.service.create(f.value.code).subscribe(res => {

    });
  }

}
