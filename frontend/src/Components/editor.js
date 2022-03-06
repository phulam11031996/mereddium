import EditorJS from '@editorjs/editorjs'; 
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import InlineImage from 'editorjs-inline-image';

export function editorConstructor(){
	const editor = new EditorJS({
		tools: {
			header: {
				class: Header,
				inlineToolbar : ['link']
			},
			list: {
				class: List,
				inlineToolbar: [
					'link',
					'bold'
				]
			},
			embed: {
				class: Embed,
				inlineToolbar : false,
				config: {
					services: {
						youtube: true
					}
				},
			},
	
			image: {
				class: InlineImage,
				inlineToolbar: true,
				config: {
				  embed: {
					display: true,
				  },
				  unsplash: {
					appName: 'your_app_name',
					clientId: 'your_client_id'
				  },
				},
			},
		}
	  });
	
	  return editor;
}

//   let saveBtn = document.getElementById('customButton');

//   saveBtn.addEventListener('click', function() {
// 	  editor.save().then((outputData) => {
// 		  console.log('article data: ', outputData)
// 	  }).catch((error) => {
// 		  console.log('Saving failed: ', error)
// 	  })
//   });
