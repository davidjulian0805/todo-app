export default class Todo{

    //object for todo list 
    constructor({title, description, dueDate, priority, notes = '', checklist = [], projectId }) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;       
    this.priority = priority;       
    this.notes = notes;
    this.checklist = checklist;     
    this.projectId  = projectId ;
    this.complete = false;
    this.createdAt = new Date().toISOString();
    }
    
    toggleComplete() {
        this.complete = !this.complete;
    }

    setPriority(priority) {
    this.priority = priority;
  }

  update(fields) {
    Object.assign(this, fields);
  }

}