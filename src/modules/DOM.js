import * as app_layer from "./app_layer.js"
import * as eventListeners from "./event_listeners.js"

export function loadHome(){
	const content=document.getElementById("content");
	initialize(content, app_layer.projects);
}

function initialize(content, projects) {
	content.appendChild(createHeader());
	content.appendChild(createBody(projects));
	content.appendChild(createFooter());
}

function createHeader(){
	let header=document.createElement("div");
	header.id='header';
	header.textContent="To-Do List"
	return header;
}

function createBody(projects){
	let container=document.createElement("div");
	container.id='container';
	container.appendChild(createSidebar(projects)); 				//Sidebar containing projects, take parameter for localstorage.
	container.appendChild(createTaskBoard(projects[0].tasks));  	//"Default" tasks, again parameter for storage.
	return container;
}

function createSidebar(projects){
	let sidebar=document.createElement("div");
	sidebar.id='sidebar';
	
	let header=document.createElement("p");
	header.textContent="Projects";
	header.id="project_container_header";
	//Add a title to the sidebar

	let project_container=document.createElement("div");
	project_container.id="project_container";
	for(let i=0;i<projects.length;i++){
		let checker=false;
		if (i==0) //This is for Default project cos we dont wanna delete that.
			checker=true;
		project_container.appendChild(createProjectDOM(projects[i].title, checker));
	}

	let add_project_button=document.createElement("button");
	add_project_button.textContent="+ Add New Project";
	add_project_button.addEventListener("click", eventListeners.addProject);
	
	sidebar.appendChild(header);
	sidebar.appendChild(project_container);
	sidebar.appendChild(add_project_button);
	return sidebar;
}

export function createTaskBoard(tasks, headerTitle="Default"){
	let mainDisplay=document.createElement("div");
	mainDisplay.id='mainDisplay';

	let header=document.createElement("p");
	header.textContent=headerTitle;
	header.id="task_container_header";

	let task_container=document.createElement("div");
	task_container.id="task_container";
	for(let i=0;i<tasks.length;i++){
		task_container.appendChild(createTaskDOM(tasks[i].title, tasks[i].description, tasks[i].deadline, tasks[i].state));
	}


	let add_task_button=document.createElement("button");
	add_task_button.textContent="+ Add New Task";
	add_task_button.addEventListener("click", eventListeners.addTask);

	mainDisplay.appendChild(header);
	mainDisplay.appendChild(task_container);
	mainDisplay.appendChild(add_task_button);
	return mainDisplay;
}

export function createProjectDOM(title, checker=false){  //checker=1 is for the default project,cos we dont want cancel button there.
	let project=document.createElement("div");
	project.classList.add("project");

	project.addEventListener("click", eventListeners.changeTaskBoard);

	let name=document.createElement("div");
	name.textContent=title;
	name.classList.add('project_name');

	if (checker==true){   //skipping the cancel button part
		project.appendChild(name);
		return project;
	}

	project.addEventListener("mouseover", eventListeners.showX);
	project.addEventListener("mouseout", eventListeners.hideX); 

	let cancelButton=document.createElement("div");
	cancelButton.textContent="x";
	cancelButton.classList.add("cancelButton");
	cancelButton.addEventListener("click", eventListeners.removeProject);

	project.appendChild(name);
	project.appendChild(cancelButton);
	return project;
}

export function createTaskDOM(titleArg, descriptionArg, deadlineArg, state){
	let task=document.createElement("div");
	task.classList.add("task");
	task.innerHTML=`<div class="task_first_part">
						<div class="button_and_name">
							<div class='checker_button'></div>
							<p class='task_name'>${titleArg}</p>
						</div>
						<div class="deadline_and_delete">
							<p class='task_deadline'>${deadlineArg}</p>
							<div class='edit_task'>✏️</div>
							<div class='delete_task'>✖️</div>
						</div>
					</div>
					<p class='task_description'>${descriptionArg}</p>`

	let deleteButton=task.querySelector('.delete_task');
	deleteButton.addEventListener("click", eventListeners.removeTask);

	let checkerButton=task.querySelector('.checker_button');
	checkerButton.addEventListener("click", eventListeners.changeState)

	let editButton=task.querySelector('.edit_task');
	editButton.addEventListener("click", eventListeners.editTask);
	
	if (state==1){
		task.style.backgroundColor="#65C18C";
		checkerButton.textContent="✔️";
	}
	else if(state==-1){
		task.style.backgroundColor="#FC4F4F";
		checkerButton.textContent="";
	}

	return task;
}

function createFooter(){
	let footer=document.createElement("div");
	footer.id='footer';
	footer.innerHTML=`<p>@warstilide49 for The Odin Project</p>`
	return footer;
}

export function createModal(width, height, modalId){
	let container=document.createElement("div");
	container.classList.add('modal_bg')

	let modal=document.createElement("div")
	modal.classList.add("modal");
	modal.id=modalId;
	modal.style.height=height;
	modal.style.width=width;

	container.appendChild(modal);
	return {container,modal}
}