import { Component, OnInit } from '@angular/core';
import { filter, finalize, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectEntity, ProjectRepository } from '../../../data';
import { UnsubscribeMixin } from '../../../core';
import { ProjectCreatePopupComponent, ProjectEditPopupComponent, ProjectShowPopupComponent } from '../../../domain';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent extends UnsubscribeMixin() implements OnInit {
  isLoading: boolean;

  projects: ProjectEntity[];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private projectRepository: ProjectRepository,
    private infoMessage: MatSnackBar
  ) {
    super();
  }

  ngOnInit() {
    this.isLoading = true;
    this.projectRepository
      .getProjects()
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe((items) => (this.projects = items));
  }

  public onProjectDelete(id: number) {
    this.projectRepository
      .deleteProject(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {},
        (error) => {
          if (error.status === 200) {
            this.infoMessage.open('there are still some users in the project', null, {
              duration: 2000,
            });
          }
        },
        () => {
          this.projects = this.projects.filter((project) => project.id !== id);
          this.infoMessage.open('Project deleted', null, {
            duration: 2000,
          });
        }
      );
  }

  openProjectCreatePopup() {
    const dialogRef = this.dialog.open(ProjectCreatePopupComponent, {
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((data) => data),
        takeUntil(this.destroy$)
      )
      .subscribe((project: ProjectEntity) => {
        this.projects = this.projects.concat(project);
      });
  }

  openProjectEditPopup(project: ProjectEntity) {
    const dialogRef = this.dialog.open(ProjectEditPopupComponent, {
      width: '500px',
      data: { project },
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((data) => data),
        takeUntil(this.destroy$)
      )
      .subscribe((newProject) => {
        this.projects = this.projects.map((projectItem) => (projectItem.id === project.id ? newProject : projectItem));
      });
  }

  openProjectPopup(project: ProjectEntity) {
    this.dialog.open(ProjectShowPopupComponent, {
      width: '500px',
      data: { project },
    });
  }
}
