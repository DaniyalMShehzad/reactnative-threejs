import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, Suspense, useState, useLayoutEffect } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "expo-three";
import { useAnimatedSensor, SensorType } from "react-native-reanimated";
function Box(props) {
  const [active, setActive] = useState < boolean > false;
  const mesh = useRef();
  useFrame((state, delta) => {
    if (active) {
      mesh.current.rotation.x += delta;
      mesh.current.rotation.y -= delta;
    }
  });
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
    >
      <boxGeometry />
      <meshStandardMaterial color={active ? "green" : "grey"} />
    </mesh>
  );
}
function Shoe(props) {
  const [base, normal, rough] = useLoader(TextureLoader, [
    require("./Airmax/textures/BaseColor.jpg"),
    require("./Airmax/textures/Normal.jpg"),
    require("./Airmax/textures/Roughness.png"),
  ]);

  const material = useLoader(MTLLoader, require("./Airmax/shoe.mtl"));

  const obj = useLoader(OBJLoader, require("./Airmax/shoe.obj"), (loader) => {
    material.preload();
    loader.setMaterials(material);
  });

  const mesh = useRef();

  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = base;
        child.material.normalMap = normal;
        child.material.roughnessMap = rough;
      }
    });
  }, [obj]);
  useFrame((state, delta) => {
    // console.log(props.animatedSensor.sensor.value);
    let { x, y, z } = props.animatedSensor.sensor.value;
    x = ~~(x * 100) / 5000;
    y = ~~(y * 100) / 5000;
    mesh.current.rotation.x += x;
    mesh.current.rotation.y += y;
  });
  return (
    <mesh ref={mesh} rotation={[1, 0, 0]}>
      <primitive object={obj} scale={9} />
    </mesh>
  );
}
// function Shoe(props) {
//   const [base, normal, rough] = useLoader(TextureLoader, [
//     require("./Airmax/textures/BaseColor.jpg"),
//     require("./Airmax/textures/Normal.jpg"),
//     require("./Airmax/textures/Roughness.png"),
//   ]);

//   const material = useLoader(MTLLoader, require("./Airmax/shoe.mtl"));

//   const obj = useLoader(OBJLoader, require("./Airmax/shoe.obj"), (loader) => {
//     material.preload();
//     loader.setMaterials(material);
//   });

//   useLayoutEffect(() => {
//     obj.traverse((child) => {
//       if (child instanceof THREE.Mash) {
//         child.material.map = base;
//         child.material.normalMap = normal;
//         child.material.roughnessmap = rough;
//       }
//     });
//   }, [obj]);
//   return (
//     <mesh rotation={[0.7, 0, 0]}>
//       <primitive object={obj} scale={10} />
//     </mesh>
//   );
// }
export default function App() {
  const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE, {
    interval: 100,
  });
  console.log(animatedSensor);
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[5, 5, 5]} />
      <Suspense fallback={null}>
        <Shoe animatedSensor={animatedSensor} />
      </Suspense>
      {/* <Box />
      <Box position={[0, 2, 0]} />
      <Box position={[0, -2, 0]} /> */}
      {/* <mesh  scale={0.1}>
        <torusKnotGeometry radius={10} args={[10, 1, 260, 6, 10, 16]} />
        <meshStandardMaterial color={"green"} />
      </mesh> */}
    </Canvas>
  );
}
