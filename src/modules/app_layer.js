export function createNewProject(title){
	let project={
		title,
		tasks:[]
	}
	projects.push(project); 
}

export function removeProject(title){
	for(let i=0;i<projects.length; i++){
		if (projects[i].title==title){		//This wont do,cos it will delete the first one with the name. Error with projects of same name.
			projects.splice(i,1);
			return
		}
	}
}

export function getProjectUsingTitle(title) {
	for(let i=0;i<projects.length; i++){
		if(projects[i].title==title)
			return projects[i];
	}
}

export function createTaskObject(title,description,deadline, state=0){
	return {title, description, deadline, state};
}

export function removeTaskObject(projectTitle, taskTitle){
	let project=getProjectUsingTitle(projectTitle);
	for(let i=0; i<project.tasks.length; i++){
		if (project.tasks[i].title==taskTitle){		//Again no two tasks can have the same name xD
			project.tasks.splice(i,1);
			return
		}
	}
}

export function editTaskObject(projectTitle, oldTitle, newTitle, newDescription, newDeadline){
	let project=getProjectUsingTitle(projectTitle);
	for(let i=0; i<project.tasks.length; i++){
		if (project.tasks[i].title==oldTitle){
			project.tasks[i].title=newTitle;
			project.tasks[i].description=newDescription;
			project.tasks[i].deadline=newDeadline;
			return
		}
	}
}

export function getTaskFromTitle(projectTitle, taskTitle){
	let project=getProjectUsingTitle(projectTitle);
	for(let i=0; i<project.tasks.length; i++){
		if (project.tasks[i].title==taskTitle){		//Again no two tasks can have the same name xD
			return project.tasks[i]
		}
	}
}

export function addTaskToProject(project, task){
	project.tasks.push(task);
}

export let projects=[];

if (localStorage.getItem("projects")){
	projects=JSON.parse( localStorage.getItem("projects"))
}
else{
	//First timers only hmmm
	createNewProject("Default");
	localStorage.setItem("projects",JSON.stringify(projects));
}