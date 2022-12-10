import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
  Material,
} from 'three';

@Component({
  selector: 'app-landscape',
  templateUrl: './landscape.component.html',
  styleUrls: ['./landscape.component.scss'],
})
export class LandscapeComponent implements AfterViewInit {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private flight: Mesh;
  private sun: Mesh;
  private horizontalLines: Line[] = [];

  private moveToLeft: boolean;
  private moveToRight: boolean;

  @ViewChild('landscapeWrapper') private landscapeWrapper: ElementRef;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.initThreeJs();
    this.subscribeToKeys();
  }

  private initThreeJs() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight);

    this.camera.position.z = 5;
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.landscapeWrapper.nativeElement.appendChild(this.renderer.domElement);

    this.drawFlight();
    this.drawLines();
    this.drawCity();
    this.drawMountains();
    this.drawSun();
    this.startAnimations();
  }

  private drawFlight() {
    this.flight = new Mesh(new BoxGeometry(1, 1, 0.1), new MeshBasicMaterial({ color: 0x00ff00 }));
    this.flight.position.y = -2;
    this.flight.position.z = 1;
    this.scene.add(this.flight);
  }

  private drawCity() {
    const material = new MeshBasicMaterial({ color: '#6a0168' });
    const darkMaterial = new MeshBasicMaterial({ color: '#450044' });

    // Last row
    // Large
    this.drawBuildings([0.7, 1.8, 0.09], [[-0.5, 0.5]], darkMaterial);
    this.drawBuildings(
      [0.7, 3, 0.1],
      [
        [-1, 0.5],
        [0, 0.5],
      ],
      material,
    );
    // Middle
    this.drawBuildings([0.8, 1, 0.1], [[0.9, 0.5]], material);
    // Small
    this.drawBuildings([0.2, 0.5, 0.1], [[2, 0.2]], material);

    // First row
    // Middle
    this.drawBuildings(
      [0.8, 1, 0.1],
      [
        [-1.3, 0.3],
        [1.5, 0.3],
      ],
      darkMaterial,
    );
    // Small
    this.drawBuildings(
      [0.2, 0.5, 0.1],
      [
        [0.5, 0.2],
        [0, 0.2],
      ],
      darkMaterial,
    );
  }

  private drawBuildings(boxSize: number[], buildings: Array<Array<number>>, material: Material): void {
    buildings.forEach((coordinates) => {
      const middleBuilding = new Mesh(new BoxGeometry(...boxSize), material);

      middleBuilding.position.x = coordinates[0];
      middleBuilding.position.y = coordinates[1];

      this.scene.add(middleBuilding);
    });
  }

  private drawLines() {
    const geometry = new BoxGeometry(25, 10, 0.5);
    const material = new MeshBasicMaterial({ color: '#000' });
    const background = new Mesh(geometry, material);
    background.position.x = -3;
    background.position.y = -5;
    this.scene.add(background);

    const lineMaterial = new LineBasicMaterial({ color: '#ad18ca' });

    const verticalLinesAmount = 70;

    for (var index = 0; index <= verticalLinesAmount; index++) {
      const start = [-15 + 0.4 * index, 0, 1];
      const end = [-15 + 0.4 * index, -5, 20];

      const linePoints = [new Vector3(...start), new Vector3(...end)];

      const lineGeometry = new BufferGeometry().setFromPoints(linePoints);
      const line = new Line(lineGeometry, lineMaterial);
      line.position.z = 1;
      this.scene.add(line);
    }

    const horizontalLinesAmount = 10;
    for (var index = 0; index <= horizontalLinesAmount; index++) {
      const start = [-15, 0, 1];
      const end = [15, 0, 1];

      const linePoints = [new Vector3(...start), new Vector3(...end)];

      const lineGeometry = new BufferGeometry().setFromPoints(linePoints);
      const newLine = new Line(lineGeometry, lineMaterial);
      newLine.position.y = -0.4 * index;
      this.horizontalLines.push(newLine);
      this.scene.add(newLine);
    }
  }

  private drawSun() {
    this.sun = new Mesh(new CircleGeometry(1, 32), new MeshBasicMaterial({ color: '#f00' }));
    this.sun.position.x = -1;
    this.scene.add(this.sun);
  }

  private drawMountains() {
    this.drawThreeMountains(true);
    this.drawThreeMountains(false);
  }

  private drawThreeMountains(isLeft: boolean) {
    const lineMaterial = new LineBasicMaterial({ color: '#00efff' });

    this.scene.add(
      new Line(
        new BufferGeometry().setFromPoints([
          new Vector3(isLeft ? -7.5 : 7.5, 0, 0),
          new Vector3(isLeft ? -6.5 : 6.5, 2, 0),
          new Vector3(isLeft ? -5.5 : 5.5, 0, 0),
        ]),
        lineMaterial,
      ),
    );

    this.scene.add(
      new Line(
        new BufferGeometry().setFromPoints([
          new Vector3(isLeft ? -6.24 : 6.24, 1.5, 0),
          new Vector3(isLeft ? -5 : 5, 3.5, 0),
          new Vector3(isLeft ? -3.5 : 3.5, 0.5, 0),
        ]),
        lineMaterial,
      ),
    );

    this.scene.add(
      new Line(
        new BufferGeometry().setFromPoints([
          new Vector3(isLeft ? -4 : 4, 0, 0),
          new Vector3(isLeft ? -3 : 3, 1, 0),
          new Vector3(isLeft ? -2 : 2, 0, 0),
        ]),
        lineMaterial,
      ),
    );
  }

  private subscribeToKeys() {
    merge(fromEvent(document, 'keydown'), fromEvent(document, 'keyup'))
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

  private startAnimations() {
    requestAnimationFrame(this.startAnimations.bind(this));

    this.animateFlight();
    this.animateLines();
    this.animateSun();

    this.renderer.render(this.scene, this.camera);
  }

  private animateFlight() {
    if (this.moveToLeft && this.flight.position.x > -10) {
      this.flight.position.x -= 0.05;
    }

    if (this.moveToRight && this.flight.position.x < 10) {
      this.flight.position.x += 0.05;
    }
  }

  private animateLines() {
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
  }

  private animateSun() {
    if (this.sun.position.y < -2) {
      this.sun.position.y = 5;
      this.sun.position.x = -1;
    }

    this.sun.position.y -= 0.01;
    this.sun.position.x += 0.002;
  }
}
