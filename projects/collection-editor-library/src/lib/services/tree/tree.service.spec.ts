import { editorConfig, nativeElement } from './../../components/editor/editor.component.spec.data';
import { TestBed, inject } from '@angular/core/testing';
import { TreeService } from './tree.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { treeNode } from './tree.service.spec.data';

describe('TreeService', () => {
  let treeService: TreeService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    });

    treeService = TestBed.inject(TreeService);
    treeService.initialize(editorConfig);
  });

  it('should be created', () => {
    const service: TreeService = TestBed.inject(TreeService);
    expect(service).toBeTruthy();
  });

  it('Verify #setTreeElement()', ()=> {
    treeService.setTreeElement(nativeElement);
    expect(treeService.treeNativeElement).toEqual(nativeElement);
  })

  it('#updateNode() should call #setNodeTitle() and #updateTreeNodeMetadata()', ()=> {
    spyOn(treeService, 'updateNode').and.callThrough();
    const metadata = {
      name : 'test',
      instructions : 'test',
      objectType : 'QuestionSet',
      attributions : 'test',
      copyrightYear : 2022,
      maxTime : '19:00',
      warningTime : '10:00'
    };
    spyOn(treeService, 'setNodeTitle');
    spyOn(treeService, 'updateTreeNodeMetadata').and.callThrough();
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return treeNode;
    });
    spyOn(treeService, 'getTreeObject').and.callFake(() => {
      return { visit(cb) { cb({ data: { metadata: {} } }); } }});
    treeService.updateNode(metadata,undefined,'Observation');
    expect(treeService.setNodeTitle).toHaveBeenCalled();
  });

  it("#updateAppIcon() should call #getActiveNode()", ()=> {
    spyOn(treeService, 'getActiveNode').and.callFake(()=> {
      return treeNode;
    });
    spyOn(treeService, 'setTreeCache').and.callFake(()=> {});
    treeService.updateAppIcon('https://dev.sunbirded.org/assets/images/sunbird_logo.png')
    expect(treeService.getActiveNode).toHaveBeenCalled();
  })

  it('#updateMetaDataProperty() should call #getFirstChild() and #setTreeCache()', ()=> {
    spyOn(treeService, 'getFirstChild').and.callFake(()=> treeNode);
    spyOn(treeService, 'setTreeCache').and.callFake(() => {});
    treeService.updateMetaDataProperty('maxScore', 2);
    expect(treeService.getFirstChild).toHaveBeenCalled();
    expect(treeService.setTreeCache).toHaveBeenCalled();
  });

  it("#updateTreeNodeMetadata() should call #setTreeCache()", ()=> {
    spyOn(treeService, 'getActiveNode').and.callFake(()=> treeNode);
    treeService.updateTreeNodeMetadata(treeNode,undefined,'Observation', 'QuestionSet');
  })

  // it("#updateTreeNodeMetadata() should call #setTreeCache() with primaryCategory", ()=> {
  //   spyOn(treeService, 'updateTreeNodeMetadata').and.callThrough();
  //   spyOn(treeService, 'getActiveNode').and.callFake(()=> treeNode);
  //   spyOn(treeService, 'getTreeObject').and.callFake(() => {
  //     return { visit(cb) { cb({ data: { metadata: {} } }); } }});

  //   spyOn(treeService, 'setTreeCache');
  //   treeService.updateTreeNodeMetadata(treeNode,undefined,'Observation', 'QuestionSet');
  //   expect(treeService.setTreeCache).toHaveBeenCalled();
  // })

  it("#removeSpecialChars() should remove special characters from string", ()=> {
    let string = "test@ioo!$%#";
    const result = treeService.removeSpecialChars(string);
    expect(result).toEqual('testioo');
  })
});
