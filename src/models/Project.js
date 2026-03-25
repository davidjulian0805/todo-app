export default class Project {
    constructor(name){
        this.id = crypto.randomUUID();
        this.name = name;
        this.createdAt = new Date().toISOString // Returns a date as a string value in ISO format.
    }
}