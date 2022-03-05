import {createProjectDOM, createTaskDOM, createTaskBoard, createModal} from "./DOM.js";
import * as app_layer from "./app_layer.js";
import {format, parseISO} from "date-fns"

//To check most recently clicked on button
let currentProjectTitle="Default";

export function addProject(e){

	let {container, modal}=createModal("15vw","20vh","add_project");
	let body=document.body;
	body.appendChild(container);

	modal.innerHTML=`<p><strong>New Project</strong></p>
					<input type="text" placeholder="Project Name">
					<div>
						<button class="modal_submit">Add Project</button>
						<button class="modal_cancel">Cancel</button>
					</div>`

	let submit=modal.querySelector(".modal_submit");
	let input=modal.querySelector("input");
	let cancel=modal.querySelector(".modal_cancel");

	submit.addEventListener("click", ()=>{
		let title=input.value
		let duplicate=isDuplicateProject(title);
		if (!duplicate && title){
			let element=createProjectDOM(title);
			e.target.parentNode.childNodes[1].appendChild(element);  //childNodes[1] will be the project container since inclusion of header
			
			//Project changed so localstorage added
			app_layer.createNewProject(title);
			localStorage.setItem("projects",JSON.stringify(app_layer.projects));
			
			container.remove()
		}
		else if (duplicate){
			alert("A project exists with the same name!")
		}
		else{
			alert("Invalid Project Name")	
		}
	})

	cancel.addEventListener("click", ()=>{
		container.remove()
	})
}
	
function isDuplicateProject(title){							//Will implement binary search if I ever have a lot of projects, for now this will work xD
	for (let i=0; i<app_layer.projects.length; i+=1){
		if (title==app_layer.projects[i].title){
			return true;
		}
	}
	return false
}

export function addTask(e){
	let {container, modal}=createModal("20vw","35vh","add_task");
	let body=document.body;
	body.appendChild(container);

	let today=format(new Date(),"yyyy-MM-dd");

	modal.innerHTML=`<p><strong>New Task</strong></p>
					<input type="text" id="title" placeholder="Title ">
					<input type="text" id="description" placeholder="Description">
					<input type="date" id="deadline" placeholder="Deadline" min=${today}>
					<div>
						<button class="modal_submit">Add Task</button>
						<button class="modal_cancel">Cancel</button>
					</div>`

	let cancel=modal.querySelector(".modal_cancel");
	let submit=modal.querySelector(".modal_submit");

	let currentProject=app_layer.getProjectUsingTitle(currentProjectTitle)
	
	submit.addEventListener("click", ()=>{

		let title=modal.querySelector("#title").value;
		let description=modal.querySelector("#description").value;

		let unformmatedDate=modal.querySelector("#deadline").value;
		if (!unformmatedDate){
			alert("Please provide a valid deadline")
			return;
		}
		let deadline=format(parseISO(unformmatedDate),"dd/MM/yyyy");

		for (let i=0; i<currentProject.tasks.length; i+=1){
			if (title==currentProject.tasks[i].title){
				alert("A task with the same name already exists!");
				return;
			}
		}

		let element=createTaskDOM(title,description,deadline);
		e.target.parentNode.childNodes[1].appendChild(element);		//RELATION from button to taskboard

		let task= app_layer.createTaskObject(title, description, deadline);
		app_layer.addTaskToProject(currentProject, task);
		localStorage.setItem("projects",JSON.stringify(app_layer.projects));

		container.remove()
	})


	cancel.addEventListener("click", ()=>{
		container.remove()
	})
}

// Removed the ability to have duplicate projects so no problem.
export function changeTaskBoard(e){
	let title="";

	if(e.target.parentNode.classList=="project"){
		title=e.target.parentNode.childNodes[0].textContent;
	}
	else if(e.target.classList=="project"){
		title=e.target.childNodes[0].textContent;
	}
	displayReplace(title);
}

export function showX(e){ 
	helperX(e,1)
}

export function hideX(e){
	helperX(e,0);
}

export function removeProject(e){
	e.stopPropagation();										//Stops bubbling or capturing!
	let title=e.target.parentNode.childNodes[0].textContent;	//Getting the title out to delete from the main_array
	
	let {container,submit,cancel}=confirmationModal()

	submit.addEventListener("click", ()=>{
		//Replacing display
		let previousTitle=e.target.parentNode.previousSibling.firstElementChild.textContent;
		displayReplace(previousTitle);
		
		//DOM removal
		let element=e.target.parentNode;
		element.remove();

		//removing from app_layer
		app_layer.removeProject(title);
		localStorage.setItem("projects",JSON.stringify(app_layer.projects));

		//Deleting modal
		container.remove()
	})


	cancel.addEventListener("click", ()=>{
		container.remove()
	})
}

export function editTask(e){
	e.stopPropagation();
	let originalTitle=e.target.parentNode.parentNode.children[0].children[1].textContent;

	let today=format(new Date(),"yyyy-MM-dd");

	let {container, modal}=createModal("20vw","35vh","edit");
	let body=document.body;
	body.appendChild(container);

	let task= app_layer.getTaskFromTitle(currentProjectTitle, originalTitle);

	modal.innerHTML=`<p><strong>Edit Task</strong></p>
					<input type="text" id="title" placeholder="Title" value=${task.title}>
					<input type="text" id="description" placeholder="Description" value=${task.description}>
					<input type="date" id="deadline" placeholder="Deadline" min=${today}>
					<div>
						<button class="modal_submit">Edit</button>
						<button class="modal_cancel">Cancel</button>
					</div>
					`

	let cancel=modal.querySelector(".modal_cancel");
	let submit=modal.querySelector(".modal_submit");

	let currentProject=app_layer.getProjectUsingTitle(currentProjectTitle);

	submit.addEventListener("click",()=>{
		let title=modal.querySelector("#title").value;
		let description=modal.querySelector("#description").value;

		let unformmatedDate=modal.querySelector("#deadline").value;
		if (!unformmatedDate){
			alert("Please provide a valid deadline")
			return;
		}

		let deadline=format(parseISO(unformmatedDate),"dd/MM/yyyy");

		for (let i=0; i<currentProject.tasks.length; i+=1){
			if (title==currentProject.tasks[i].title){
				if (title!=originalTitle){
					alert("A task with the same name already exists!");
					return;
				}
			}
		}
		//I dont like this method tbh
		e.target.parentNode.parentNode.children[0].children[1].textContent= title
		e.target.parentNode.parentNode.parentNode.children[1].textContent=description
		e.target.parentNode.children[0].textContent=deadline

		app_layer.editTaskObject(task, title, description, deadline);
		localStorage.setItem("projects",JSON.stringify(app_layer.projects));

		container.remove()
	})

	cancel.addEventListener("click",()=>{
		container.remove()
	})
}

export function removeTask(e){
	e.stopPropagation();
	let title=e.target.parentNode.parentNode.children[0].children[1].textContent;			

	let {container,submit,cancel}=confirmationModal()

	submit.addEventListener("click", ()=>{
		app_layer.removeTaskObject(currentProjectTitle, title)
		localStorage.setItem("projects",JSON.stringify(app_layer.projects));

		let element=e.target.parentNode.parentNode.parentNode;	//Gives me the main task DOM object
		element.remove();

		container.remove()
	})
	
	cancel.addEventListener("click",()=>{
		container.remove();
	})
}

export function changeState(e){
	let taskObject=e.target.parentNode.parentNode.parentNode;	//Getting the task object from the event
	let taskTitle=e.target.parentNode.children[1].textContent;

	let task = app_layer.getTaskFromTitle(currentProjectTitle, taskTitle);

	//state==0 means it hasnt been touched yet
	//state==1 means it was marked done
	//state==-1 means it was marked done then undone, so get f*cked lool
	//All because I couldnt solve a hovering issue ffs

	if (task.state==0){
		taskObject.style.backgroundColor="#65C18C";				//light greenish
		e.target.textContent="✔️";
		task.state=1;
	}
	else if(task.state==1){
		taskObject.style.backgroundColor="#FC4F4F";
		e.target.textContent="";
		task.state=-1;
	}
	else{
		taskObject.style.backgroundColor="#65C18C";
		e.target.textContent="✔️";
		task.state=1;
	}

	localStorage.setItem("projects",JSON.stringify(app_layer.projects));
}

function confirmationModal(){
	let {container, modal}=createModal("30vw","20vh","confirmation");
	let body=document.body;
	body.appendChild(container);

	modal.innerHTML=`<p><strong>Are you sure you want to delete?</strong></p>
					<div>
						<button class="modal_submit">Yes</button>
						<button class="modal_cancel">Cancel</button>
					</div>`
					

	let cancel=modal.querySelector(".modal_cancel");
	let submit=modal.querySelector(".modal_submit");
	return {container, submit, cancel};
}

function displayReplace(title){
	currentProjectTitle=title;
	let mainDisplay=document.getElementById("mainDisplay");
	mainDisplay.remove()

	let container=document.getElementById("container");
	container.appendChild( createTaskBoard( app_layer.getProjectUsingTitle(title).tasks, currentProjectTitle) )
}

function helperX(e,value){ 										//function implemented cos event target kept changing 
	let reference=document.getElementById("project_container");	//so had to make sure I covered both cases
	if (e.target.parentNode==reference){						//Finding a better way would be appreciated ig
		let x=e.target.childNodes[1]; 
		x.style.opacity=value;  
	}
	else if(e.target.parentNode.parentNode==reference){
		let x=e.target.parentNode.childNodes[1]; 
		x.style.opacity=value;
	}
}