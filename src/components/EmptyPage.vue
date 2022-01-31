<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<h5>Empty Pagee</h5>
				<p>Use this page to start from scratch and place your custom content.</p>
			</div>
		</div>
	</div>
</template>

<script>

import userService from '../service/UserService';
export default {

created() {
	var data = null ; 
		userService.getUserList().then(response => {
			response.data.data;
		});
		
		console.log(data);
	},
}
</script>