const accordion = document.querySelectorAll(".accordion");
const edit = document.querySelectorAll('.edit');
const create = document.querySelector('.task--create');
const modal = document.querySelector('.task--modal');
const overlay = document.querySelector('#overlay');
const edit_form = document.querySelector('#edit-task');
const form_element = document.querySelectorAll('form');
const edit_task_btn = document.querySelector('#edit-task-btn');
const close_form = document.querySelector('#edit-task #close');
const task_message = document.querySelector('.task--alert span');
let parent_element;
let task_title;
let task_content;
let method;
let action;
let body;
let url;

 
/*! Normalized address bar hiding for iOS & Android (c) @scottjehl MIT License */
(function( win ){
	var doc = win.document;
	
	// If there's a hash, or addEventListener is undefined, stop here
	if(!win.navigator.standalone && !location.hash && win.addEventListener ){
		
		//scroll to 1
		win.scrollTo( 0, 1 );
		var scrollTop = 1,
			getScrollTop = function(){
				return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
			},
		
			//reset to 0 on bodyready, if needed
			bodycheck = setInterval(function(){
				if( doc.body ){
					clearInterval( bodycheck );
					scrollTop = getScrollTop();
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}	
			}, 15 );
		
		win.addEventListener( "load", function(){
			setTimeout(function(){
				//at load, if user hasn't scrolled more than 20 or so...
				if( getScrollTop() < 20 ){
					//reset to hide addr bar at onload
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}
			}, 0);
		}, false );
	}
})( this );

accordion.forEach(accordion => {
    
    accordion.addEventListener("click", function() {
        
        this.classList.toggle("focus");
        const content = this.nextElementSibling;
    
        if (content.style.height) {
            content.style.height = null;
            content.classList.remove('focus');
        } else {            
            content.style.height = "auto";
            content.classList.add('focus');      
        } 
    
    });

});

edit.forEach(edit => {

    edit.addEventListener('click', function() {
        parent_element_index = this.dataset.parentId;
        parent_element = document.querySelectorAll('.task--container.pending .task--wrap')[parent_element_index];
        task_title = parent_element.querySelector('.task--title').textContent;
        task_content = parent_element.querySelector('.task--content span').textContent;        
        if (modal.style.display == 'block') {
            edit_form.querySelector('input[name="title"]').value = '';
            edit_form.querySelector('textarea[name="content"]').value = '';
            modal.style.display = 'none';
            overlay.style.display = 'none';
        } else {
            modal.querySelector('.header').textContent = ('Edit Task');
            edit_form.setAttribute(`action`,`/edit/${parent_element_index}`)
            edit_form.querySelector('input[name="title"]').value = task_title;
            edit_form.querySelector('textarea[name="content"]').value = task_content;
            modal.style.display = 'block';
            overlay.style.display = 'block';
        }
    });

});

create.addEventListener('click', function() {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    edit_form.setAttribute('action','create');
    modal.querySelector('.header').textContent = ('Create Task');
    edit_form.querySelector('input[name="title"]').value = '';
    edit_form.querySelector('textarea[name="content"]').value = '';    
});

close_form.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = 'none';
    overlay.style.display = 'none';
});

form_element.forEach(form => {

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (this.id !== 'edit-task') {
            body = '';
        } else {
            body = JSON.stringify({
                title: edit_form.querySelector('input[name="title"]').value,
                content: edit_form.querySelector('textarea[name="content"]').value
            });
        }

        url = this.action;
        method = this.method;        

        processForm(url, method, body);

    });

});

function processForm(url, method, body) {
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then(data => data.json())
    .then(data => {
        
        const task_alert = document.createElement('div');
        const message_span = document.createElement('span');
        const close_span = document.createElement('span');

        close_span.className = 'task--alert-close';
        close_span.textContent = 'x';

        message_span.textContent = `${data.status_message}`;

        task_alert.className = 'task--alert margin-top-10';
        task_alert.appendChild(message_span);
        task_alert.appendChild(close_span);

        document.body.appendChild(task_alert);
        
        const reload_page = setInterval(function() {
            if (data.status) {
                window.location.reload();
            } else {
                document.body.removeChild(task_alert);
            }
            clearInterval(reload_page);
        }, 1000);
        
        
    })
    .catch(err => {
        console.error('');
    });
};
