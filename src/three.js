import { animate } from './animate';
import * as THREE from 'three';
export function animateThree(target) {
    const base = animate(target);
    let proxy;
    const threeApi = {
        moveX(x) { base.to({ position: { x } }); return proxy; },
        moveY(y) { base.to({ position: { y } }); return proxy; },
        moveZ(z) { base.to({ position: { z } }); return proxy; },
        rotateX(deg) { base.to({ rotation: { x: THREE.MathUtils.degToRad(deg) } }); return proxy; },
        rotateY(deg) { base.to({ rotation: { y: THREE.MathUtils.degToRad(deg) } }); return proxy; },
        rotateZ(deg) { base.to({ rotation: { z: THREE.MathUtils.degToRad(deg) } }); return proxy; },
        scaleX(s) { base.to({ scale: { x: s } }); return proxy; },
        scaleY(s) { base.to({ scale: { y: s } }); return proxy; },
        scaleZ(s) { base.to({ scale: { z: s } }); return proxy; },
        opacity(o) {
            const t = target;
            if (t.isMaterial) {
                t.transparent = true;
                base.to({ opacity: o });
            }
            else if (t.material) {
                const mat = t.material;
                if (!Array.isArray(mat)) {
                    mat.transparent = true;
                }
                else {
                    mat.forEach((m) => {
                        if (m)
                            m.transparent = true;
                    });
                }
                base.to({ material: { opacity: o } });
            }
            return proxy;
        },
        fov(degrees) {
            if (target instanceof THREE.Camera) {
                base.to({ fov: degrees });
            }
            return proxy;
        },
        set(props) {
            base.to(props);
            return proxy;
        },
    };
    proxy = new Proxy(threeApi, {
        get(_, prop) {
            if (typeof prop === 'string' && prop in threeApi) {
                return threeApi[prop];
            }
            const baseProp = base[prop];
            if (typeof baseProp === 'function') {
                return (...args) => {
                    const result = baseProp(...args);
                    return result === base ? proxy : result;
                };
            }
            return baseProp;
        },
    });
    return proxy;
}
export { animate as animateThreeJS } from './animate';
