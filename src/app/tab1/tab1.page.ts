import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(
    private database: DatabaseService
   ) {
     this.database.databaseConn(); 
   }

  ngOnInit() { }

  ionViewDidEnter() {  
    this.database.getAllTasks()
  }

  createTask(){
    this.database.addTask(this.database.name, 0);
  }

  toogleIsDone(id, actualIsDone){
    var task = this.database.ITEMS.find(item => item.id == id)
    if(actualIsDone == 0){
      this.database.updateTask(task.id, task.name, 1);
    }else{
      this.database.updateTask(task.id, task.name, 0);
    }
  }
   
  remove(id) {
    this.database.deleteTask(id);
  }
}
