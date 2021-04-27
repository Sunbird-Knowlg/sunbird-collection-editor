
import { QuestionCursor } from '@project-sunbird/sunbird-quml-player-v8';
import { Observable, of} from 'rxjs';
import * as _ from 'lodash-es';
import { QuestionService } from '../question/question.service';
import { Inject, Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class QumlPlayerService implements QuestionCursor {
  public questionMap =  new Map();
  constructor(private questionService: QuestionService) {}

  getQuestion(questionId: string): Observable<any> {
    if (_.isEmpty(questionId)) { return of({}); }
    const question = this.getQuestionData(questionId);
    if (question) {
        return of({questions : _.castArray(question)});
    } else {
      return this.questionService.getQuestionList(_.castArray(questionId));
    }
  }

  getQuestions(questionIds: string[]): Observable<any> {
    return this.questionService.getQuestionList(questionIds);
  }

  getQuestionData(questionId) {
    return this.questionMap.get(_.first(_.castArray(questionId))) || undefined;
  }

  setQuestionMap(key, value) {
    this.questionMap.set(key, value);
  }

  clearQuestionMap() {
    this.questionMap.clear();
  }

}
