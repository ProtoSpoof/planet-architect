const lightOrientation = {
	X: 45,
	Y: 0,
	Z: 0,
};

const lightParameters = {
	distanceFactor: 1000000,
	lightType: 'directional',
};

const lightDirection = m4.transformDirection(
	m4.multiply(
		m4.multiply(m4.rotationX(deg2rad(lightOrientation.X)), m4.rotationY(deg2rad(lightOrientation.Y))),
		m4.rotationZ(deg2rad(lightOrientation.Z))
	),
	[0, 1, 0]
);

const lightPosition = v3.add(
	planetMeshExtents.center,
	v3.mulScalar(lightDirection, (lightParameters.distanceFactor * planetMeshExtents.dia) / 2)
);
