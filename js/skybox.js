const images = {
	right: document.getElementById('skyboxRight'),
	left: document.getElementById('skyboxLeft'),
	top: document.getElementById('skyboxTop'),
	bottom: document.getElementById('skyboxBottom'),
	front: document.getElementById('skyboxFront'),
	back: document.getElementById('skyboxBack'),
};

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
