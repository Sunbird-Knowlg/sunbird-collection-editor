import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToasterService } from '../../services/toaster/toaster.service';
import { EditorService } from '../../services/editor/editor.service';
import { HelperService } from '../../services/helper/helper.service';
import { ConfigService } from '../../services/config/config.service';

import * as _ from 'lodash-es';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'lib-manage-collaborator',
  templateUrl: './manage-collaborator.component.html',
  styleUrls: ['./manage-collaborator.component.scss']
})
export class ManageCollaboratorComponent implements OnInit {
  @Output() modalDismissEmitter = new EventEmitter<any>();
  @ViewChild('modal', { static: false }) private modal;
  @Input() addCollaborator;
  @Input() collectionId;
  public showCollaborationPopup: boolean;
  public collaboratorList: any;
  public contentCollaborators: any;
  public contentOwner;
  public creatorAndCollaboratorsIds;
  public selectedUsers = [];
  public selectedcollaborators = [];
  public users = [];
  public rootOrgId;
  private addCollaboratorTabVisit = 0;
  private manageCollaboratorTabVisit = 0;
  public collaborators = [];
  public updatedCollaborators = [];
  public showManageCollaboration = false;

  constructor(
    public helperService: HelperService,
    public toasterService: ToasterService,
    public configService: ConfigService,
    public editorService: EditorService
    ) { }

  ngOnInit() {
    const currentUser: any = _.get(this.editorService.editorConfig, 'context.user');
    this.rootOrgId = currentUser.orgIds;
    this.showCollaborationPopup =  this.addCollaborator;
    this.getCollbaoratorAndCreator();
    this.getAllUserList();
  }

  getCollbaoratorAndCreator() {
    this.editorService.fetchContentDetails(this.collectionId).subscribe(res => {
      this.contentCollaborators = _.get(res.result.content, 'collaborators', []);
      this.contentOwner = [_.get(res.result.content, 'createdBy')];
      this.creatorAndCollaboratorsIds = [...this.contentCollaborators, ...this.contentOwner];
    });
  }

  dismissCollaborationPopup() {
    this.showCollaborationPopup = false;
    this.modalDismissEmitter.emit({});
  }

  getAllUserList() {
    this.helperService.getAllUsers(this.rootOrgId).subscribe((response: any) => {
      this.users = [];
      const count = _.get(response, 'result.response.count');
      if (!count) {
        this.users = [];
        return;
      } else {
        if (_.has(response, 'result.response.content')) {
          const allUsers = _.get(response, 'result.response.content');
          this.excludeCreatorAndCollaborators(allUsers);
        }
      }
    },
    (error) => {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.001'));
      console.log(error);
    });
  }

  excludeCreatorAndCollaborators(allUsers) {
    this.users = _.filter(allUsers, user => {
      return !_.includes(this.creatorAndCollaboratorsIds, user.identifier);
    });
    this.users = allUsers; // line to be removed
  }

  toggleSelectionUser(userIdentifier) {
    _.forEach(this.users, user => {
      if (user.identifier === userIdentifier) {
        if (_.has(user, 'isSelected') && user.isSelected === true) {
          user.isSelected = false;
          const index = this.selectedUsers.indexOf(userIdentifier);
          if (index > -1) {
            this.selectedUsers.splice(index, 1);
          }
        } else {
          user.isSelected = true;
          this.selectedUsers.push(userIdentifier);
        }
      }
    });
  }

  toggleSelectionCollaborator(userIdentifier) {
    _.forEach(this.collaborators, user => {
      if (user.identifier === userIdentifier) {
        if (_.has(user, 'isSelected') && user.isSelected === true) {
          user.isSelected = false;
          const index = this.selectedcollaborators.indexOf(userIdentifier);
          if (index > -1) {
            this.selectedcollaborators.splice(index, 1);
          }
        } else {
          user.isSelected = true;
          this.selectedcollaborators.push(userIdentifier);
        }
      }
    });
  }

  addRemoveCollaboratorToCourse(modal) {
    this.updatedCollaborators = this.contentCollaborators;
    this.updatedCollaborators = _.concat(this.updatedCollaborators, this.selectedUsers);
    this.updatedCollaborators = _.difference(this.updatedCollaborators, this.selectedcollaborators);
    console.log('updatedCollaborators', this.updatedCollaborators);
    this.helperService.updateCollaborator(this.collectionId, this.updatedCollaborators).subscribe((response: any) => {
      if (response.params.status === 'successful') {
        this.toasterService.success('Collaborators updated successfully');
      } else {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.001'));
      }
    },
    (error) => {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.001'));
      console.log(error);
    });
    modal.deny();
  }

  /* to be called when user change tab to add collaborator */
  getAllusers() {
    this.addCollaboratorTabVisit += 1;
    console.log('addCollaboratorTabVisit', this.addCollaboratorTabVisit);
  }

  /* to be called when user change tab to manage collaborator */
  getCollaborators() {
    this.manageCollaboratorTabVisit += 1;
    if (this.manageCollaboratorTabVisit <= 1) {
      // this.contentCollaborators = this.contentOwner; // line to be removed
      if (!_.isEmpty(this.contentCollaborators)) {
        this.helperService.getAllUsers(this.rootOrgId, this.contentCollaborators).subscribe((response: any) => {
          // this.collaborators = [];
          const count = _.get(response, 'result.response.count');
          if (!count) {
            this.collaborators = [];
            this.showManageCollaboration = true;
            return;
          } else {
            if (_.has(response, 'result.response.content')) {
              this.collaborators = _.get(response, 'result.response.content');
              this.showManageCollaboration = true;
            }
          }
        },
        (error) => {
          this.collaborators = [];
          this.showManageCollaboration = true;
          this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.001'));
          console.log(error);
        });
      }
    }
  }
}
