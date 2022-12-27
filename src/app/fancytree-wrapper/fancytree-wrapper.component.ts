import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FancyTreeComponent, TreeService, ToasterService, ConfigService } from 'collection-editor-library';
@Component({
  selector: 'app-fancytree-wrapper',
  templateUrl: './fancytree-wrapper.component.html',
  styleUrls: ['./fancytree-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FancytreeWrapperComponent extends FancyTreeComponent implements OnInit{

  @Input() editorConfig: any;

  constructor(treeService: TreeService, toasterService: ToasterService,
              cdr: ChangeDetectorRef, configService: ConfigService) {
    super(treeService, toasterService, cdr, configService );
   }

  ngOnInit(): void {
    this.treeService.initialize(this.editorConfig);
    this.treeService.treeStatus$.subscribe((event: any) => {
      this.treeEventEmitter.emit(event);
    });
    super.ngOnInit();
  }

  addChild() {
    const result = confirm('Want to add?');
    if (result) {
      const activeNode = this.treeService.getActiveNode();
      const newNode = activeNode.addChildren({
        title: 'Untitled Node',
        folder: true
      });
      newNode.setActive();
      activeNode.setExpanded();
    }
  }

  removeNode() {
    const result = confirm('Want to delete?');
    if (result) {
      this.treeService.removeNode();
    }
  }

}
