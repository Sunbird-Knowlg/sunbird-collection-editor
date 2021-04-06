
import { QuestionCursor } from '@project-sunbird/sunbird-quml-player';
import { Observable, of} from 'rxjs';
import * as _ from 'lodash-es';
import { QuestionService } from '../question/question.service';
import { Inject } from '@angular/core';

export class QumlPlayerService implements QuestionCursor {
  constructor(@Inject(QuestionService) private questionService: QuestionService) {}

  getQuestion(questionId: string): Observable<any> {
    return this.questionService.getQuestionList([questionId]);
  }

  getQuestions(questionIds: string[]): Observable<any> {
    return this.questionService.getQuestionList(questionIds);
  }

}
