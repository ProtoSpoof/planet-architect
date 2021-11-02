const m4 = twgl.m4;
const v3 = twgl.v3;

const canvas = document.getElementById('main');
const gl = canvas.getContext('webgl2');

function computeExtents(o) {
	const extents = o.map((d) => {
		const xExtent = d3.extent(d.vertices.filter((_, i) => i % 3 === 0));
		const yExtent = d3.extent(d.vertices.filter((_, i) => i % 3 === 1));
		const zExtent = d3.extent(d.vertices.filter((_, i) => i % 3 === 2));
		return {
			min: [xExtent[0], yExtent[0], zExtent[0]],
			max: [xExtent[1], yExtent[1], zExtent[1]],
		};
	});

	const transformedExtents = extents.map((extent, i) => {
		return o[i].modelMatrix
			? {
					min: m4.transformPoint(o[i].modelMatrix, extent.min),
					max: m4.transformPoint(o[i].modelMatrix, extent.max),
			  }
			: extent;
	});
	const xMin = d3.min(transformedExtents, (d) => d.min[0]);
	const xMax = d3.max(transformedExtents, (d) => d.max[0]);
	const yMin = d3.min(transformedExtents, (d) => d.min[1]);
	const yMax = d3.max(transformedExtents, (d) => d.max[1]);
	const zMin = d3.min(transformedExtents, (d) => d.min[2]);
	const zMax = d3.max(transformedExtents, (d) => d.max[2]);
	const min = [xMin, yMin, zMin],
		max = [xMax, yMax, zMax];
	const center = v3.divScalar(v3.add(min, max), 2); // center of AABB
	const dia = v3.length(v3.subtract(max, min)); // Diagonal length of the AABB
	return {
		min,
		max,
		center,
		dia,
	};
}

function getProjectionMatrix(modelDim, cameraProps) {
	return m4.perspective(
		deg2rad(cameraProps.fov),
		cameraProps.aspect,
		cameraProps.near * modelDim.dia,
		cameraProps.far * modelDim.dia
	);
}

// function getCameraTranformationMatrix(scale, modelDim, cameraProps) {
// 	const s = modelDim.dia / 8;

// 	const rotationTranformation = m4.multiply(
// 		m4.rotationY(deg2rad(cameraProps.yAngle)),
// 		m4.rotationX(deg2rad(cameraProps.xAngle))
// 	);

// 	const translationVector = v3.add(
// 		cameraProps.lookAt,
// 		v3.mulScalar(m4.transformDirection(rotationTranformation, [0, 0, 1]), cameraProps.dist * modelDim.dia)
// 	);

// 	return m4.multiply(
// 		m4.multiply(m4.translation(translationVector), rotationTransformation),
// 		scale ? m4.scaling([s, s, s]) : m4.identity()
// 	);
// }

function getViewMatrix(modelDim, cameraProps) {
	const gazeDirection = m4.transformDirection(
		m4.multiply(m4.rotationY(deg2rad(cameraProps.yAngle)), m4.rotationX(deg2rad(cameraProps.xAngle))),
		[0, 0, 1]
	);
	const eye = v3.add(cameraProps.lookAt, v3.mulScalar(gazeDirection, cameraProps.dist * modelDim.dia));
	return m4.inverse(m4.lookAt(eye, cameraProps.lookAt, [0, 1, 0]));
}

function getInvViewProjectionMatrix(viewMatrix, projectionMatrix) {
	const view = viewMatrix.slice();
	const viewD = m4.setTranslation(view, [0, 0, 0]);
	const viewDirectionProjection = m4.multiply(projectionMatrix, viewD);
	return m4.inverse(viewDirectionProjection);
}

function deg2rad(deg) {
	return (Math.PI * deg) / 180;
}

function hex2rgb(hex) {
	return (hex = hex.replace('#', ''))
		.match(new RegExp('(.{' + hex.length / 3 + '})', 'g'))
		.map((l) => parseInt(hex.length % 2 ? l + l : l, 16) / 255);
}
