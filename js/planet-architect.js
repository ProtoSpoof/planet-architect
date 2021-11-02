function render(time) {
	time *= 0.001;

	cameraProps.yAngle = (cameraProps.yAngle + 0.1) % 360;
	// if (cameraProps.xAngle == 0) cameraProps.zAngle = (camera.zAngle + 180) % 360;

	const viewMatrix = getViewMatrix(planetMeshExtents, cameraProps);
	const projectionMatrix = getProjectionMatrix(planetMeshExtents, cameraProps);
	const invViewProjectionMatrix = getInvViewProjectionMatrix(viewMatrix, projectionMatrix);

	twgl.resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	renderPlanet(viewMatrix, projectionMatrix);
	renderSkybox(invViewProjectionMatrix);
	requestAnimationFrame(render);
}
console.log(hex2rgb('#f0f0f0'));

requestAnimationFrame(render);
