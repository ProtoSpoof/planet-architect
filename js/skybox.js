const images = {
	right: new Image(),
	left: new Image(),
	top: new Image(),
	bottom: new Image(),
	front: new Image(),
	back: new Image(),
};
images.right.src = 'assets/galaxy/right.png';
images.left.src = 'assets/galaxy/left.png';
images.top.src = 'assets/galaxy/top.png';
images.bottom.src = 'assets/galaxy/bottom.png';
images.front.src = 'assets/galaxy/front.png';
images.back.src = 'assets/galaxy/back.png';
const cubemapImages = [images.right, images.left, images.top, images.bottom, images.front, images.back];

const cubemap = twgl.createTexture(gl, {
	target: gl.TEXTURE_CUBE_MAP,
	flipY: false,
	src: cubemapImages,
});

const skyboxBufferInfo = twgl.createBufferInfoFromArrays(gl, {
	position: {
		numComponents: 2,
		data: [-1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1],
	},
});

const skyboxProgramInfo = twgl.createProgramInfo(gl, skyboxShaders);

function renderSkybox(invViewProjectionMatrix) {
	gl.depthFunc(gl.LEQUAL);
	const uniforms = {
		cubemap,
		invViewProjectionMatrix,
	};

	gl.useProgram(skyboxProgramInfo.program);
	twgl.setUniforms(skyboxProgramInfo, uniforms);
	twgl.setBuffersAndAttributes(gl, skyboxProgramInfo, skyboxBufferInfo);
	twgl.drawBufferInfo(gl, skyboxBufferInfo);
	gl.depthFunc(gl.LESS);
}
