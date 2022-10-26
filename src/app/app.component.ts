import { Component } from '@angular/core';
import { filter, fromEvent, merge } from 'rxjs';

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  LineBasicMaterial,
  Vector3,
  Line,
  BufferGeometry,
  CircleGeometry,
  Shape,
  ExtrudeGeometry,
  MeshPhongMaterial,
} from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private flight: Mesh;
  private horizontalLines: Line[] = [];

  private moveToLeft: boolean;
  private moveToRight: boolean;

  constructor() {
    this.initThreeJs();
    this.subscribeToKeys();
  }

  private subscribeToKeys() {
    merge(
      fromEvent(document, 'keydown'),
      fromEvent(document, 'keyup'),
    )
      .pipe(filter((e: KeyboardEvent) => !!e.code.match(/KeyW|KeyA|KeyS|KeyD|ArrowUp|ArrowDown|ArrowLeft|ArrowRight/)))
      .subscribe((e) => {
        console.log(e);

        if (e.type === 'keyup') {
          this.moveToLeft = false;
          this.moveToRight = false;
          return;
        }
        
        if (e.code.match(/KeyA|ArrowLeft/)) {
          this.moveToLeft = true;
        }

        if (e.code.match(/KeyD|ArrowRight/)) {
          this.moveToRight = true;
        }
      });
  }

  private initThreeJs() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight);

    this.camera.position.z = 5;
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.drawFlight();
    this.drawLines();
    this.drawCity();
    this.drawMountains();
    this.drawSun();
    this.startAnimations();
  }

  private drawFlight() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    this.flight = new Mesh(geometry, material);
    this.flight.position.y = -2;
    this.scene.add(this.flight);
  }

  private drawCity() {
    const geometry = new BoxGeometry(0.5, 1, 0.1);
    const material = new MeshBasicMaterial({ color: '#6a0168' });
    const cube = new Mesh(geometry, material);
    cube.position.y = 0.5;
    cube.position.x = 0.6;

    this.scene.add(cube);
  }

  private drawLines() {
    const lineMaterial = new LineBasicMaterial({ color: '#ad18ca' });

    const verticalLinesAmount = 70;

    for (var index = 0; index <= verticalLinesAmount; index++) {
      const start = [-15 + 0.4 * index, 0, 0];
      const end = [-15 + 0.4 * index, -5, 20];

      const linePoints = [new Vector3(...start), new Vector3(...end)];

      const lineGeometry = new BufferGeometry().setFromPoints(linePoints);
      this.scene.add(new Line(lineGeometry, lineMaterial));
    }

    const horizontalLinesAmount = 10;
    for (var index = 0; index <= horizontalLinesAmount; index++) {
      const start = [-15, 0, 0];
      const end = [15, 0, 0];

      const linePoints = [new Vector3(...start), new Vector3(...end)];

      const lineGeometry = new BufferGeometry().setFromPoints(linePoints);
      const newLine = new Line(lineGeometry, lineMaterial);
      newLine.position.y = -0.4 * index;
      this.horizontalLines.push(newLine);
      this.scene.add(newLine);
    }
  }

  private drawSun() {
    const geometry = new CircleGeometry(1, 32, 0.005, 3.15);
    const material = new MeshBasicMaterial({ color: '#f00' });
    const circle = new Mesh(geometry, material);
    this.scene.add(circle);
  }

  private drawMountains() {
    this.drawThreeMountains(true);
    this.drawThreeMountains(false);
  }

  private drawThreeMountains(isLeft: boolean) {
    const lineMaterial = new LineBasicMaterial({ color: '#00efff' });

    const mountain1 = [
      new Vector3(isLeft ? -7.5 : 7.5, 0, 0),
      new Vector3(isLeft ? -6.5 : 6.5, 2, 0),
      new Vector3(isLeft ? -5.5 : 5.5, 0, 0),
    ];
    this.scene.add(new Line(new BufferGeometry().setFromPoints(mountain1), lineMaterial));

    const mountain2 = [
      new Vector3(isLeft ? -6.24 : 6.24, 1.5, 0),
      new Vector3(isLeft ? -5 : 5, 3.5, 0),
      new Vector3(isLeft ? -3.5 : 3.5, 0.5, 0),
    ];
    this.scene.add(new Line(new BufferGeometry().setFromPoints(mountain2), lineMaterial));

    const mountain3 = [
      new Vector3(isLeft ? -4 : 4, 0, 0),
      new Vector3(isLeft ? -3 : 3, 1, 0),
      new Vector3(isLeft ? -2 : 2, 0, 0),
    ];

    this.scene.add(new Line(new BufferGeometry().setFromPoints(mountain3), lineMaterial));
  }

  private startAnimations() {
    requestAnimationFrame(this.startAnimations.bind(this));

    this.horizontalLines.forEach((line, index) => {
      if (!index) {
        return;
      }

      if (line.position.y <= -4) {
        line.position.y = 0;
        return;
      }

      line.position.y -= 0.007;
    });
  
    if (this.moveToLeft && this.flight.position.x > -10) {
      this.flight.position.x -= 0.05;
    }

    if (this.moveToRight && this.flight.position.x < 10) {
      this.flight.position.x += 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
