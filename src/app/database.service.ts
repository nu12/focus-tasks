import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private dbInstance: SQLiteObject;
  readonly db_name: string = "focustasks.db";
  readonly db_table: string = "data";
  ITEMS: Array <any> ;
  name: string = ""; // To be used in views

  constructor(
    private platform: Platform,
    private sqlite: SQLite    
  ) { 
    this.databaseConn();
  }

    // Create SQLite database 
    databaseConn() {
        this.platform.ready().then(() => {
          this.sqlite.create({
              name: this.db_name,
              location: 'default'
            }).then((sqLite: SQLiteObject) => {
              this.dbInstance = sqLite;
              sqLite.executeSql(`
                  CREATE TABLE IF NOT EXISTS ${this.db_table} (
                    id INTEGER PRIMARY KEY, 
                    name varchar(255),
                    isDone int
                  )`, [])
                .then((res) => {
                  // alert(JSON.stringify(res));
                })
                .catch((error) => alert(JSON.stringify(error)));
            })
            .catch((error) => alert(JSON.stringify(error)));
        });   
    }

    // Crud
    public addTask(n, i) {
      // validation
      if (!n.length) { 
        alert('Provide task name!');
        return;
      }
      this.dbInstance.executeSql(`
      INSERT INTO ${this.db_table} (name, isDone) VALUES ('${n}', ${i})`, [])
        .then(() => {
          //alert("Success");
          this.getAllTasks();
          this.name = "";
        }, (e) => {
          alert(JSON.stringify(e.err));
        });
    }

    getAllTasks() {
      return this.dbInstance.executeSql(`SELECT * FROM ${this.db_table}`, []).then((res) => {
        this.ITEMS = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.ITEMS.push(res.rows.item(i));
          }
          return this.ITEMS;
        }
      },(e) => {
        alert(JSON.stringify(e));
      });
    }

    // Get user
    getTask(id): Promise<any> {
      return this.dbInstance.executeSql(`SELECT * FROM ${this.db_table} WHERE id = ?`, [id])
      .then((res) => { 
        return {
          id: res.rows.item(0).id,
          name: res.rows.item(0).name,  
          isDone: res.rows.item(0).isDone
        }
      });
    }

    // Update
    updateTask(id, name, isDone) {
      // validation
      if (!name.length) { 
        alert('Provide task name!');
        return;
      }
      this.dbInstance.executeSql(`
      UPDATE ${this.db_table} SET name = '${name}', isDone = ${isDone} WHERE id = ${id}`, [])
        .then(() => {
          //alert("Success");
          this.getAllTasks();
        }, (e) => {
          alert(JSON.stringify(e.err));
        });
    }  

    // Delete
    deleteTask(id) {
      this.dbInstance.executeSql(`
      DELETE FROM ${this.db_table} WHERE id = ${id}`, [])
        .then(() => {
          //alert("Task deleted!");
          this.getAllTasks();
        })
        .catch(e => {
          alert(JSON.stringify(e))
        });
    }
}
