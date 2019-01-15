
var Murlin = (function() {
	var app = {},
		template = {};

	app.init = function() {
		getTemplate();
		addListeners();
	}
	
	function getTemplate() {
		chrome.storage.local.get('template', function (savedtemplate) {
			if (typeof savedtemplate.template !== 'undefined') {
				template = savedtemplate.template;
			} else {
				template = {
					subdomain: '',
					domain: '',
					recordtype: 'none',
					record: ''
				}
			}

			setToTemplate();
		});
	}

	function addListeners() {
		window.addEventListener("keydown", keyhandle);

		var saveButton = document.getElementById('save');
		saveButton.addEventListener("click", saveClickHandle);
	}
	
	function setToTemplate() {
		document.getElementById('subdomain').value = template.subdomain;
		document.getElementById('domain').value = template.domain;
		document.getElementById('recordtype').value = template.recordtype;
		document.getElementById('record').value = template.record;
	}

	function saveClickHandle(e) {
		setTemplate({
			subdomain: document.getElementById('subdomain').value,
			domain: document.getElementById('domain').value,
			recordtype: document.getElementById('recordtype').value,
			record: document.getElementById('record').value
		});
	}

	function setTemplate(tosave) {
		var obj = {
			'template': tosave
		}
		chrome.storage.local.set(obj);
	}

	function keyhandle(e) {
		if (e.keyCode !== 13) {
			return;
		}
		
		var subdomain = document.getElementById('subdomain').value,
			domain = document.getElementById('domain').value,
			recordtype = document.getElementById('recordtype').value,
			record = document.getElementById('record').value,
			url = 'https://';
		
		if (subdomain !== '') {
			url += subdomain + '.';
		} else {
			if (recordtype !== 'none' || record !== '') {
				alert('no subdomain set');
				return;
			}
			if (domain !== '') {
				url += domain + '/';
				window.location.href = url;
				return;
			} else {
				alert('no domain set');
				return;
			}
		}
		if (domain !== '') {
			url += domain + '/';
		} else {
			alert('no domain set');
		}
		if (recordtype !== 'none') {
			if (record === '') {
				alert('no record id set');
				return;
			}

			switch (recordtype) {
				case 'contact':
					url += '/Contact/manageContact.jsp?view=edit&ID=' + record;
					break;
				case 'campaign':
					url += '/app/funnel/funnelEditor?funnelId=' + record;
					break;
				case 'order':
					url += '/Job/manageJob.jsp?view=edit&ID=' + record;
					break;
				case 'orderform':
					url += '/app/orderFormManagement/loadOrderformSetup?orderFormId=' + record;
					break;
				case 'batch':
					url += '/app/report/viewEmailBatchReport/' + record;
					break;
			}
		}
		if (record !== '' && recordtype === 'none') {
			alert('no recordtype set');
			return;
		}
		window.location.href = url;
	};
	
	var coll = document.getElementsByClassName("collapsible");
	var i;

	for (i = 0; i < coll.length; i++) {
	  coll[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.display === "block") {
		  content.style.display = "none";
		} else {
		  content.style.display = "block";
		}
		for (var ii = 0; ii < 10; ii++)
		{
			content = content.nextElementSibling;
			if (content == null)
				return;
			else if (content.style.display === "block") {
			  content.style.display = "none";
			} else {
			  content.style.display = "block";
			}
		}
	  });
	}

	return app;
})(window);

window.onload = function() {
	Murlin.init();
};