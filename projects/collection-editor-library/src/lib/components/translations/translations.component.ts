import { Component} from "@angular/core";
import { ConfigService } from "../../services/config/config.service";
import * as _ from 'lodash-es';

@Component({
  selector: "lib-translations",
  templateUrl: "./translations.component.html",
  styleUrls: ["./translations.component.scss"],
})
export class TranslationsComponent {
  public editorState: any = {};
  sampleJson = {
    body: {
      en: "What is the shape of the earth?",
    },
    responseDeclaration: {
      response1: {
        maxScore: 1,
        cardinality: "single",
        type: "integer",
        mapping: [
          {
            response: 0,
            outcomes: {
              FEEDBACK: "feedback1",
            },
          },
          {
            response: 1,
            outcomes: {
              FEEDBACK: "feedback2",
            },
          },
          {
            response: 2,
            outcomes: {
              FEEDBACK: "feedback3",
            },
          },
        ],
      },
    },
    interactionTypes: ["choice"],
    hints: {
      en: ["hints in the specified language"],
    },
    instructions: {
      en: "instructions in the specified language",
    },
    interactions: {
      response1: {
        type: "choice",
        validation: {
          required: "Yes/No",
        },
        options: [
          {
            label: {
              en: ["Circular"],
            },
            hints: {
              en: ["hints in the specified language"],
            },
            value: 0,
          },
          {
            label: {
              en: ["Spherical"],
            },
            hints: {
              en: ["hints in the specified language"],
            },
            value: 1,
          },
          {
            label: {
              en: ["Rectangle"],
            },
            hints: {
              en: ["hints in the specified language"],
            },
            value: 1,
          },
          {
            label: {
              en: ["Square"],
            },
            hints: {
              en: ["hints in the specified language"],
            },
            value: 1,
          },
        ],
      },
    },
    solution: [],
    media: [],
    showEvidence: "Yes/No",
    evidence: {
      required: "Yes/No",
      mimeType: ["image/png", "audio/mp3", "video/mp4", "video/webm"],
      minCount: 1,
      maxCount: 1,
      sizeLimit: "20480",
      caption: "Yes/No",
    },
    showRemarks: "Yes/No",
    remarks: {
      maxLength: "",
      required: "Yes/No",
    },
    canBeNotApplicable: "Yes/No",
  };
  constructor(public configService: ConfigService) {}


  editorDataHandler(event, type?) {
    if (type === 'question') {
      this.editorState.question = event.body;
    } else if (type === 'solution') {
      this.editorState.solutions = event.body;
    }

    if (event.mediaobj) {
      const media = event.mediaobj;
      console.log(media);
    }
  }
}
