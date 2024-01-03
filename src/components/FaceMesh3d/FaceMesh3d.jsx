import {pointsList} from "./pointsList";
import {useEffect, useRef, useState} from "react";
import * as THREE from "three"

/**
 * Точки отрисовываются,
 * но изображение перевернуто, надо понять на чьей стороне ошибка front или back
 *
 * Сделал также центрирование в canvas объета из точек
 */

function parsePoint(pointsString) {
    return pointsString.split("\n").map((point) => point.split(",").map(Number));
}

const axesLines = false // Линии координат. для отладки
const objectSize = 40 // Размер объекта из точек (деление на диапазон. Чем меньше значение, тем больше размер)

// Размер окна
const canvasSize = {
    width: 400,
    height: 400,
}

// Параметры отрисовки точек
const pointParams = {
    color: 0x000000, // 16bit цвет
    size: 0.03,
}


const FaceMesh3d = () => {
    const [pointList, setPointList] = useState(null)
    const mountRef = useRef(null)

    useEffect(() => {
        setPointList(parsePoint(pointsList))
    }, []);


    useEffect(() => {
        if (!pointList || pointList.length === 0) { return }

        // Делим точки, т.к изначальный диапазон значений слишком высок
        const scaledLandmarks = pointList.map(point => point.map(coord => coord / objectSize));
        const scene = new THREE.Scene();

        // Создание камеры
        const camera = new THREE.PerspectiveCamera(
            90,
            canvasSize.width / canvasSize.height,
            0.1,
            0
        );
        camera.position.z = 5;

        // Рендер с прозрачным фоном
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(canvasSize.width, canvasSize.height);
        mountRef.current.appendChild(renderer.domElement);

        if (axesLines) {
            const axesHelper = new THREE.AxesHelper(2);
            scene.add(axesHelper);
        }

        // Отрисовка точек
        const vertices = new Float32Array(scaledLandmarks.flat());
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({
            color: pointParams.color, // Цвет точек в 16bit
            size: pointParams.size, // Размер точек
            sizeAttenuation: true
        });

        const points = new THREE.Points(geometry, material);
        geometry.center() // центрирование объекта
        scene.add(points);

        // Функция анимации
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Размонтирование
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            geometry.dispose();
            material.dispose();
        };
    }, [pointList]);

    return <div
        style={{border: "1px solid gray", width: "max-content", height: "max-content"}}
        ref={mountRef}
    />
}

export default FaceMesh3d