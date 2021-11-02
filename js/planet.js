// Create Icosphere planetMesh for planet
const planetMesh = icosphere(7, true);
const planetMeshExtents = computeExtents([planetMesh]);

const planetArrays = {
	position: { numComponents: 3, data: planetMesh.vertices },
	texcoord: { numComponents: 2, data: planetMesh.uv },
	normal: { numComponents: 3, data: planetMesh.vertices },
	indices: { numComponents: 3, data: planetMesh.triangles },
};
const planetBufferInfoArray = [twgl.createBufferInfoFromArrays(gl, planetArrays)];

const materialProperty = {
	materialColor: hex2rgb('#52392F'),
	// materialColor: [100, 0, 0],
	ambientIntensity: 10 / 100,
};

const specularProperties = {
	specularColor: hex2rgb('#FFFFFF'),
	ks: 0.2,
	shininess: 1,
};

const planetProgramInfo = twgl.createProgramInfo(gl, planetShaders);

function renderPlanet(viewMatrix, projectionMatrix) {
	gl.useProgram(planetProgramInfo.program);
	const lookAt = m4.inverse(viewMatrix);
	const eyePos = [lookAt[12], lookAt[13], lookAt[14]];
	// const materialColor = [...materialProperty.materialColor];
	const lightInfo = [...lightPosition, lightParameters.lightType == 'point' ? 1 : 0];
	const specularColor = specularProperties.specularColor;
	// console.log(materialColor);
	const uniforms = {
		// Add any required uniform variable name and value pair
		modelMatrix: m4.identity(),
		materialColor: materialProperty.materialColor,
		ambientIntensity: materialProperty.ambientIntensity,
		specularColor,
		ks: specularProperties.ks,
		shininess: specularProperties.shininess,
		lightInfo,
		eyePos,
		viewMatrix,
		projectionMatrix,
	};

	twgl.setUniforms(planetProgramInfo, uniforms);

	planetBufferInfoArray.forEach((bufferInfo) => {
		twgl.setBuffersAndAttributes(gl, planetProgramInfo, bufferInfo);
		twgl.drawBufferInfo(gl, bufferInfo);
	});
}
