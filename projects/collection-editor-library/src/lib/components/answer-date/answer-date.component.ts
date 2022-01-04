import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-answer-date',
  templateUrl: './answer-date.component.html',
  styleUrls: ['./answer-date.component.css'],
})
export class AnswerDateComponent implements OnInit {

  selectedOption;
  selected = [];
  options = [{ id: 1, type: 'DD-MM-YYYY'}, { id: 2, type: 'YYYY-MM-DD'}];
  
  constructor() {}

  ngOnInit() {

  }
  
  
}

