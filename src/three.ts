import { animate, type AnimationInstance } from './animate';
import * as THREE from 'three';

export interface ThreeAnimationInstance extends AnimationInstance {
  moveX(x: number): this;
  moveY(y: number): this;
  moveZ(z: number): this;
  rotateX(deg: number): this;
  rotateY(deg: number): this;
  rotateZ(deg: number): this;
  scaleX(s: number): this;
  scaleY(s: number): this;
  scaleZ(s: number): this;
  opacity(o: number): this;
  fov(degrees: number): this;
  set(props: Record<string, any>): this;
}

export function animateThree(target: THREE.Object3D | THREE.Material | THREE.Camera): ThreeAnimationInstance {
  const base = animate(target);

  let proxy: ThreeAnimationInstance;

  const threeApi = {
    moveX(x: number) { base.to({ position: { x } }); return proxy; },
    moveY(y: number) { base.to({ position: { y } }); return proxy; },
    moveZ(z: number) { base.to({ position: { z } }); return proxy; },
    rotateX(deg: number) { base.to({ rotation: { x: THREE.MathUtils.degToRad(deg) } }); return proxy; },
    rotateY(deg: number) { base.to({ rotation: { y: THREE.MathUtils.degToRad(deg) } }); return proxy; },
    rotateZ(deg: number) { base.to({ rotation: { z: THREE.MathUtils.degToRad(deg) } }); return proxy; },
    scaleX(s: number) { base.to({ scale: { x: s } }); return proxy; },
    scaleY(s: number) { base.to({ scale: { y: s } }); return proxy; },
    scaleZ(s: number) { base.to({ scale: { z: s } }); return proxy; },
    
    opacity(o: number) {
      const t = target as any;
      if (t.isMaterial) {
        (t as THREE.Material).transparent = true;
        base.to({ opacity: o });
      } else if (t.material) {
        const mat = t.material;
        if (!Array.isArray(mat)) {
          (mat as THREE.Material).transparent = true;
        } else {
          mat.forEach((m) => {
            if (m) (m as THREE.Material).transparent = true;
          });
        }
        base.to({ material: { opacity: o } });
      }
      return proxy;
    },
    
    fov(degrees: number) {
      if (target instanceof THREE.Camera) {
        base.to({ fov: degrees });
      }
      return proxy;
    },
    
    set(props: Record<string, any>) {
      base.to(props);
      return proxy;
    },
  };

  proxy = new Proxy(threeApi, {
    get(_, prop: string | symbol) {
      if (typeof prop === 'string' && prop in threeApi) {
        return threeApi[prop as keyof typeof threeApi];
      }
      
      const baseProp = (base as any)[prop];
      
      if (typeof baseProp === 'function') {
        return (...args: any[]) => {
          const result = baseProp(...args);
          return result === base ? proxy : result;
        };
      }
      
      return baseProp;
    },
  }) as ThreeAnimationInstance;

  return proxy;
}

export { animate as animateThreeJS } from './animate';