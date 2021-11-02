const cameraProps = {
	xAngle: 0,
	yAngle: 0,
	dist: 1,
	fov: 45,
	near: 0.1,
	far: 2.5,
	aspect: canvas.clientWidth / canvas.clientHeight,
	lookAt: planetMeshExtents.center,
	flip: false,
};

window.addEventListener('resize', () => {
	cameraProps.aspect = canvas.clientWidth / canvas.clientHeight;
});
